import { PlanoMensal } from '../../domain/entities/PlanoMensal';
import { Periodo } from '../../domain/value-objects/Periodo';
import { Dinheiro } from '../../domain/value-objects/Dinheiro';
import { IPlanoMensalRepository } from '../ports/IPlanoMensalRepository';
import { randomUUID } from 'crypto';

export interface CriarPlanoMensalInput {
  usuarioId: string;
  mes: number;
  ano: number;
  salarioReferencia: number;
}

export interface CriarPlanoMensalOutput {
  id: string;
  periodo: string;
}

export class CriarPlanoMensal {
  constructor(private readonly repo: IPlanoMensalRepository) {}

  async execute(input: CriarPlanoMensalInput): Promise<CriarPlanoMensalOutput> {
    const periodo = Periodo.de(input.mes, input.ano);

    const existente = await this.repo.findByUsuarioAndPeriodo(input.usuarioId, periodo);
    if (existente) throw new Error(`Plano para ${periodo.toString()} já existe`);

    const plano = PlanoMensal.criar({
      id: randomUUID(),
      usuarioId: input.usuarioId,
      periodo,
      salarioReferencia: Dinheiro.de(input.salarioReferencia),
      criadoEm: new Date(),
    });

    await this.repo.save(plano);
    return { id: plano.id, periodo: periodo.toString() };
  }
}
