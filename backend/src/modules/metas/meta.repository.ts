import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MetaMapper } from '../../infrastructure/mappers/meta.mapper';
import type { IMetaRepository } from '@financas/core';
import { Meta } from '@financas/core';

@Injectable()
export class MetaRepository implements IMetaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Meta | null> {
    const raw = await this.prisma.meta.findUnique({ where: { id } });
    return raw ? MetaMapper.toDomain(raw) : null;
  }

  async findByPlanoMensal(planoMensalId: string): Promise<Meta[]> {
    const rows = await this.prisma.meta.findMany({ where: { planoMensalId } });
    return rows.map(MetaMapper.toDomain);
  }

  async save(meta: Meta): Promise<void> {
    const data = MetaMapper.toPrisma(meta);
    await this.prisma.meta.upsert({
      where: { id: meta.id },
      create: data,
      update: {
        nome: data.nome,
        tipo: data.tipo,
        metaTotal: data.metaTotal,
        valorMensal: data.valorMensal,
        valorRealMes: data.valorRealMes,
        totalGuardado: data.totalGuardado,
        onde: data.onde,
        data: data.data,
        status: data.status,
      },
    });
  }

  async saveMany(metas: Meta[]): Promise<void> {
    for (const meta of metas) {
      await this.save(meta);
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.meta.delete({ where: { id } });
  }
}
