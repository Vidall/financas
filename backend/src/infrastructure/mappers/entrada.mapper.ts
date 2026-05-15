import type { Entrada as EntradaPrisma } from '@prisma/client';
import { Entrada, Dinheiro } from '@financas/core';

export class EntradaMapper {
  static toDomain(raw: EntradaPrisma): Entrada {
    return Entrada.reconstituir({
      id: raw.id,
      planoMensalId: raw.planoMensalId,
      nome: raw.nome,
      valor: Dinheiro.de(raw.valor),
      recebido: raw.recebido,
      data: raw.data ?? undefined,
    });
  }

  static toPrisma(domain: Entrada): EntradaPrisma {
    return {
      id: domain.id,
      planoMensalId: domain.planoMensalId,
      nome: domain.nome,
      valor: domain.valor.valor,
      recebido: domain.recebido,
      data: domain.data ?? null,
    };
  }
}
