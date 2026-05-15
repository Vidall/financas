import type { PlanoMensal as PlanoMensalPrisma } from '@prisma/client';
import { PlanoMensal, Periodo, Dinheiro } from '@financas/core';

export class PlanoMensalMapper {
  static toDomain(raw: PlanoMensalPrisma): PlanoMensal {
    return PlanoMensal.reconstituir({
      id: raw.id,
      usuarioId: raw.usuarioId,
      periodo: Periodo.de(raw.mes, raw.ano),
      salarioReferencia: Dinheiro.de(raw.salarioReferencia),
      criadoEm: raw.criadoEm,
    });
  }

  static toPrismaCreate(domain: PlanoMensal): Omit<PlanoMensalPrisma, 'criadoEm'> {
    return {
      id: domain.id,
      usuarioId: domain.usuarioId,
      mes: domain.periodo.mes,
      ano: domain.periodo.ano,
      salarioReferencia: domain.salarioReferencia.valor,
    };
  }
}
