import type { ContaBancaria as ContaBancariaPrisma } from '@prisma/client';
import { ContaBancaria, Dinheiro } from '@financas/core';

export class ContaBancariaMapper {
  static toDomain(raw: ContaBancariaPrisma): ContaBancaria {
    return ContaBancaria.reconstituir({
      id: raw.id,
      usuarioId: raw.usuarioId,
      banco: raw.banco,
      saldo: Dinheiro.de(raw.saldo),
    });
  }

  static toPrisma(domain: ContaBancaria): ContaBancariaPrisma {
    return {
      id: domain.id,
      usuarioId: domain.usuarioId,
      banco: domain.banco,
      saldo: domain.saldo.valor,
    };
  }
}
