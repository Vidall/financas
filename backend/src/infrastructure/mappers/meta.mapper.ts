import type { Meta as MetaPrisma } from '@prisma/client';
import { Meta, Dinheiro, StatusPagamento } from '@financas/core';
import type { TipoMeta } from '@financas/core';

export class MetaMapper {
  static toDomain(raw: MetaPrisma): Meta {
    return Meta.reconstituir({
      id: raw.id,
      planoMensalId: raw.planoMensalId,
      nome: raw.nome,
      tipo: raw.tipo as TipoMeta,
      metaTotal: Dinheiro.de(raw.metaTotal),
      valorMensal: Dinheiro.de(raw.valorMensal),
      totalGuardado: Dinheiro.de(raw.totalGuardado),
      onde: raw.onde ?? undefined,
      data: raw.data ?? undefined,
      status: StatusPagamento.de(raw.status),
    });
  }

  static toPrisma(domain: Meta): MetaPrisma {
    return {
      id: domain.id,
      planoMensalId: domain.planoMensalId,
      nome: domain.nome,
      tipo: domain.tipo,
      metaTotal: domain.metaTotal.valor,
      valorMensal: domain.valorMensal.valor,
      totalGuardado: domain.totalGuardado.valor,
      onde: domain.onde ?? null,
      data: domain.data ?? null,
      status: domain.status.valor,
    };
  }
}
