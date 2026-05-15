import type { ContaFixa as ContaFixaPrisma } from '@prisma/client';
import { ContaFixa, Dinheiro, StatusPagamento } from '@financas/core';

export class ContaFixaMapper {
  static toDomain(raw: ContaFixaPrisma): ContaFixa {
    return ContaFixa.reconstituir({
      id: raw.id,
      planoMensalId: raw.planoMensalId,
      nome: raw.nome,
      valorPlanejado: Dinheiro.de(raw.valorPlanejado),
      valorReal: raw.valorReal != null ? Dinheiro.de(raw.valorReal) : undefined,
      vencimento: raw.vencimento ?? undefined,
      dataPago: raw.dataPago ?? undefined,
      status: StatusPagamento.de(raw.status),
      observacao: raw.observacao ?? undefined,
    });
  }

  static toPrisma(domain: ContaFixa): ContaFixaPrisma {
    return {
      id: domain.id,
      planoMensalId: domain.planoMensalId,
      nome: domain.nome,
      valorPlanejado: domain.valorPlanejado.valor,
      valorReal: domain.valorReal?.valor ?? null,
      vencimento: domain.vencimento ?? null,
      dataPago: domain.dataPago ?? null,
      status: domain.status.valor,
      observacao: domain.observacao ?? null,
    };
  }
}
