import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ContaFixaMapper } from '../../infrastructure/mappers/conta-fixa.mapper';
import type { IContaFixaRepository } from '@financas/core';
import { ContaFixa } from '@financas/core';

@Injectable()
export class ContaFixaRepository implements IContaFixaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ContaFixa | null> {
    const raw = await this.prisma.contaFixa.findUnique({ where: { id } });
    return raw ? ContaFixaMapper.toDomain(raw) : null;
  }

  async findByPlanoMensal(planoMensalId: string): Promise<ContaFixa[]> {
    const rows = await this.prisma.contaFixa.findMany({ where: { planoMensalId } });
    return rows.map(ContaFixaMapper.toDomain);
  }

  async save(conta: ContaFixa): Promise<void> {
    const data = ContaFixaMapper.toPrisma(conta);
    await this.prisma.contaFixa.upsert({
      where: { id: conta.id },
      create: data,
      update: {
        nome: data.nome,
        valorPlanejado: data.valorPlanejado,
        valorReal: data.valorReal,
        vencimento: data.vencimento,
        dataPago: data.dataPago,
        status: data.status,
        observacao: data.observacao,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.contaFixa.delete({ where: { id } });
  }
}
