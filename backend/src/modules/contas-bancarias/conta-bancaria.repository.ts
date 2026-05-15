import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ContaBancariaMapper } from '../../infrastructure/mappers/conta-bancaria.mapper';
import type { IContaBancariaRepository } from '@financas/core';
import { ContaBancaria } from '@financas/core';

@Injectable()
export class ContaBancariaRepository implements IContaBancariaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ContaBancaria | null> {
    const raw = await this.prisma.contaBancaria.findUnique({ where: { id } });
    return raw ? ContaBancariaMapper.toDomain(raw) : null;
  }

  async findByUsuario(usuarioId: string): Promise<ContaBancaria[]> {
    const rows = await this.prisma.contaBancaria.findMany({ where: { usuarioId } });
    return rows.map(ContaBancariaMapper.toDomain);
  }

  async save(conta: ContaBancaria): Promise<void> {
    const data = ContaBancariaMapper.toPrisma(conta);
    await this.prisma.contaBancaria.upsert({
      where: { id: conta.id },
      create: data,
      update: { banco: data.banco, saldo: data.saldo },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.contaBancaria.delete({ where: { id } });
  }
}
