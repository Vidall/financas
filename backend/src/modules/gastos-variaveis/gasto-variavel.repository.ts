import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { GastoVariavelMapper } from '../../infrastructure/mappers/gasto-variavel.mapper';
import type { IGastoVariavelRepository } from '@financas/core';
import { GastoVariavel } from '@financas/core';

@Injectable()
export class GastoVariavelRepository implements IGastoVariavelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<GastoVariavel | null> {
    const raw = await this.prisma.gastoVariavel.findUnique({ where: { id } });
    return raw ? GastoVariavelMapper.toDomain(raw) : null;
  }

  async findByPlanoMensal(planoMensalId: string): Promise<GastoVariavel[]> {
    const rows = await this.prisma.gastoVariavel.findMany({ where: { planoMensalId } });
    return rows.map(GastoVariavelMapper.toDomain);
  }

  async findByCategoria(planoMensalId: string, categoriaNome: string): Promise<GastoVariavel[]> {
    const rows = await this.prisma.gastoVariavel.findMany({
      where: { planoMensalId, categoriaNome },
    });
    return rows.map(GastoVariavelMapper.toDomain);
  }

  async save(gasto: GastoVariavel): Promise<void> {
    const data = GastoVariavelMapper.toPrisma(gasto);
    await this.prisma.gastoVariavel.upsert({
      where: { id: gasto.id },
      create: data,
      update: {
        nome: data.nome,
        categoriaNome: data.categoriaNome,
        categoriaIcone: data.categoriaIcone,
        formaPagamento: data.formaPagamento,
        valorPlanejado: data.valorPlanejado,
        valorReal: data.valorReal,
        data: data.data,
        status: data.status,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.gastoVariavel.delete({ where: { id } });
  }
}
