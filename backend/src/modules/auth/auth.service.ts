import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; refreshToken: string }> {
    const existe = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (existe) throw new ConflictException('Email já cadastrado');

    const senhaHash = await bcrypt.hash(dto.senha, 12);
    const usuario = await this.prisma.usuario.create({
      data: { nome: dto.nome, email: dto.email, senhaHash },
    });

    return this.gerarTokens(usuario.id, usuario.email);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email: dto.email } });
    if (!usuario) throw new UnauthorizedException('Credenciais inválidas');

    const senhaValida = await bcrypt.compare(dto.senha, usuario.senhaHash);
    if (!senhaValida) throw new UnauthorizedException('Credenciais inválidas');

    return this.gerarTokens(usuario.id, usuario.email);
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: { sub: string; email: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret',
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }

    const tokenHash = this.hashToken(refreshToken);
    const registro = await this.prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!registro || registro.revokedAt || registro.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token revogado ou expirado');
    }

    await this.prisma.refreshToken.update({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });

    return this.gerarTokens(payload.sub, payload.email);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async gerarTokens(
    usuarioId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: usuarioId, email };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET ?? 'dev_secret',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    });

    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: { usuarioId, tokenHash, expiresAt },
    });

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
