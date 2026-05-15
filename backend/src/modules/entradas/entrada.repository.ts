import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { EntradaMapper } from '../../infrastructure/mappers/entrada.mapper';
import type { IEntradaRepository } from '@financas/core';
import { Entrada } from '@financas/core';

@Injectable()
export class EntradaRepository implements IEntradaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Entrada | null> {
    const raw = await this.prisma.entrada.findUnique({ where: { id } });
    return raw ? EntradaMapper.toDomain(raw) : null;
  }

  async findByPlanoMensal(planoMensalId: string): Promise<Entrada[]> {
    const rows = await this.prisma.entrada.findMany({ where: { planoMensalId } });
    return rows.map(EntradaMapper.toDomain);
  }

  async save(entrada: Entrada): Promise<void> {
    const data = EntradaMapper.toPrisma(entrada);
    await this.prisma.entrada.upsert({
      where: { id: entrada.id },
      create: data,
      update: { nome: data.nome, valor: data.valor, recebido: data.recebido, data: data.data },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.entrada.delete({ where: { id } });
  }
}
