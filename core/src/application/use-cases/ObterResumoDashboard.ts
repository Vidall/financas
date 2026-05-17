import { PlanoMensalAggregate } from '../../domain/aggregates/PlanoMensalAggregate';
import { IPlanoMensalRepository } from '../ports/IPlanoMensalRepository';
import { IEntradaRepository } from '../ports/IEntradaRepository';
import { IContaFixaRepository } from '../ports/IContaFixaRepository';
import { IGastoVariavelRepository } from '../ports/IGastoVariavelRepository';
import { IMetaRepository } from '../ports/IMetaRepository';
import { IContaBancariaRepository } from '../ports/IContaBancariaRepository';
import { Periodo } from '../../domain/value-objects/Periodo';
import { ResumoDashboardDTO } from '../dtos/ResumoDashboardDTO';

export class ObterResumoDashboard {
  constructor(
    private readonly planoRepo: IPlanoMensalRepository,
    private readonly entradaRepo: IEntradaRepository,
    private readonly contaFixaRepo: IContaFixaRepository,
    private readonly gastoRepo: IGastoVariavelRepository,
    private readonly metaRepo: IMetaRepository,
    private readonly contaBancariaRepo: IContaBancariaRepository,
  ) {}

  async execute(usuarioId: string, mes: number, ano: number): Promise<ResumoDashboardDTO> {
    const periodo = Periodo.de(mes, ano);
    const plano = await this.planoRepo.findByUsuarioAndPeriodo(usuarioId, periodo);
    if (!plano) throw new Error(`Plano para ${periodo.toString()} não encontrado`);

    const [entradas, contasFixas, gastos, metas, contas] = await Promise.all([
      this.entradaRepo.findByPlanoMensal(plano.id),
      this.contaFixaRepo.findByPlanoMensal(plano.id),
      this.gastoRepo.findByPlanoMensal(plano.id),
      this.metaRepo.findByPlanoMensal(plano.id),
      this.contaBancariaRepo.findByUsuario(usuarioId),
    ]);

    const aggregate = PlanoMensalAggregate.reconstituir(plano, entradas, contasFixas, gastos, metas, contas);
    const comprometimento = aggregate.comprometimentoSalario;

    const saldoCarteira = aggregate.saldoCarteira.valor;
    const sobraReal = aggregate.sobraReal;

    return {
      planoId: plano.id,
      periodo: { mes, ano, descricao: periodo.toString() },
      planejamento: {
        entradas: aggregate.totalEntradasPlanejadas.valor,
        saidasContas: aggregate.totalContasFixasPlanejadas.valor,
        saidasGastos: aggregate.totalGastosPlanejados.valor,
        saidas: aggregate.totalSaidasPlanejadas.valor,
        sobra: aggregate.sobraPlanejada,
      },
      real: {
        entradas: aggregate.totalEntradasReais.valor,
        saidasContas: aggregate.totalContasFixasReais.valor,
        saidasGastos: aggregate.totalGastosReais.valor,
        saidas: aggregate.totalSaidasReais.valor,
        sobra: sobraReal,
      },
      saldoCarteira,
      carteira: {
        valorReal: saldoCarteira,
        valorDeveria: sobraReal,
        diferenca: saldoCarteira - sobraReal,
      },
      comprometimento,
      totalMetas: metas.length,
      totalMetasAtingidas: metas.filter(m => m.atingida).length,
    };
  }
}
