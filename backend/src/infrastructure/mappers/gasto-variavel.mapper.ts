import type { GastoVariavel as GastoVariavelPrisma } from '@prisma/client';
import { GastoVariavel, Dinheiro, StatusPagamento, CategoriaDespesa } from '@financas/core';
import type { FormaPagamento } from '@financas/core';

export class GastoVariavelMapper {
  static toDomain(raw: GastoVariavelPrisma): GastoVariavel {
    return GastoVariavel.reconstituir({
      id: raw.id,
      planoMensalId: raw.planoMensalId,
      nome: raw.nome,
      categoria: CategoriaDespesa.de(raw.categoriaNome, raw.categoriaIcone),
      formaPagamento: raw.formaPagamento as FormaPagamento,
      valorPlanejado: Dinheiro.de(raw.valorPlanejado),
      valorReal: raw.valorReal != null ? Dinheiro.de(raw.valorReal) : undefined,
      valorUtilizado: raw.valorUtilizado != null ? Dinheiro.de(raw.valorUtilizado) : undefined,
      data: raw.data ?? undefined,
      status: StatusPagamento.de(raw.status),
    });
  }

  static toPrisma(domain: GastoVariavel): GastoVariavelPrisma {
    return {
      id: domain.id,
      planoMensalId: domain.planoMensalId,
      nome: domain.nome,
      categoriaNome: domain.categoria.nome,
      categoriaIcone: domain.categoria.icone,
      formaPagamento: domain.formaPagamento,
      valorPlanejado: domain.valorPlanejado.valor,
      valorReal: domain.valorReal?.valor ?? null,
      valorUtilizado: domain.valorUtilizado?.valor ?? null,
      data: domain.data ?? null,
      status: domain.status.valor,
    };
  }
}
