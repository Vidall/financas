import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PlanoMensalMapper } from '../../infrastructure/mappers/plano-mensal.mapper';
import type { IPlanoMensalRepository } from '@financas/core';
import { PlanoMensal, Periodo } from '@financas/core';

@Injectable()
export class PlanoMensalRepository implements IPlanoMensalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<PlanoMensal | null> {
    const raw = await this.prisma.planoMensal.findUnique({ where: { id } });
    return raw ? PlanoMensalMapper.toDomain(raw) : null;
  }

  async findByUsuarioAndPeriodo(usuarioId: string, periodo: Periodo): Promise<PlanoMensal | null> {
    const raw = await this.prisma.planoMensal.findUnique({
      where: { usuarioId_mes_ano: { usuarioId, mes: periodo.mes, ano: periodo.ano } },
    });
    return raw ? PlanoMensalMapper.toDomain(raw) : null;
  }

  async findAllByUsuario(usuarioId: string): Promise<PlanoMensal[]> {
    const rows = await this.prisma.planoMensal.findMany({
      where: { usuarioId },
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
    });
    return rows.map(PlanoMensalMapper.toDomain);
  }

  async save(plano: PlanoMensal): Promise<void> {
    const data = PlanoMensalMapper.toPrismaCreate(plano);
    await this.prisma.planoMensal.upsert({
      where: { id: plano.id },
      create: data,
      update: { salarioReferencia: data.salarioReferencia },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.planoMensal.delete({ where: { id } });
  }
}
