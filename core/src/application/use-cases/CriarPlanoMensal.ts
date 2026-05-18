import { PlanoMensal } from '../../domain/entities/PlanoMensal';
import { Meta } from '../../domain/entities/Meta';
import { Periodo } from '../../domain/value-objects/Periodo';
import { Dinheiro } from '../../domain/value-objects/Dinheiro';
import { StatusPagamento } from '../../domain/value-objects/StatusPagamento';
import { IPlanoMensalRepository } from '../ports/IPlanoMensalRepository';
import { IMetaRepository } from '../ports/IMetaRepository';
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
  constructor(
    private readonly planoRepo: IPlanoMensalRepository,
    private readonly metaRepo: IMetaRepository,
  ) {}

  async execute(input: CriarPlanoMensalInput): Promise<CriarPlanoMensalOutput> {
    const periodo = Periodo.de(input.mes, input.ano);

    const existente = await this.planoRepo.findByUsuarioAndPeriodo(input.usuarioId, periodo);
    if (existente) throw new Error(`Plano para ${periodo.toString()} já existe`);

    const plano = PlanoMensal.criar({
      id: randomUUID(),
      usuarioId: input.usuarioId,
      periodo,
      salarioReferencia: Dinheiro.de(input.salarioReferencia),
      criadoEm: new Date(),
    });

    await this.planoRepo.save(plano);

    await this.carryOverMetas(input, plano.id);

    return { id: plano.id, periodo: periodo.toString() };
  }

  private async carryOverMetas(input: CriarPlanoMensalInput, novoPlanoId: string): Promise<void> {
    const mesAnterior = input.mes === 1 ? 12 : input.mes - 1;
    const anoAnterior = input.mes === 1 ? input.ano - 1 : input.ano;
    const periodoAnterior = Periodo.de(mesAnterior, anoAnterior);

    const planoAnterior = await this.planoRepo.findByUsuarioAndPeriodo(input.usuarioId, periodoAnterior);
    if (!planoAnterior) return;

    const metasAnteriores = await this.metaRepo.findByPlanoMensal(planoAnterior.id);
    if (metasAnteriores.length === 0) return;

    const metasNovas = metasAnteriores.map(meta =>
      Meta.reconstituir({
        id: randomUUID(),
        planoMensalId: novoPlanoId,
        nome: meta.nome,
        tipo: meta.tipo,
        metaTotal: meta.metaTotal,
        valorMensal: meta.valorMensal,
        valorRealMes: undefined,
        totalGuardado: meta.totalGuardado,
        onde: meta.onde,
        data: meta.data,
        status: StatusPagamento.Pendente,
      }),
    );

    await this.metaRepo.saveMany(metasNovas);
  }
}
