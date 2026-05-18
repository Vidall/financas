import { PlanoMensal } from '../entities/PlanoMensal';
import { Entrada } from '../entities/Entrada';
import { ContaFixa } from '../entities/ContaFixa';
import { GastoVariavel } from '../entities/GastoVariavel';
import { Meta } from '../entities/Meta';
import { ContaBancaria } from '../entities/ContaBancaria';
import { Dinheiro } from '../value-objects/Dinheiro';
import { Periodo } from '../value-objects/Periodo';

export interface ItemComprometimento {
  item: string;
  valor: number;
  percentual: number;
}

export interface ComprometimentoSalario {
  salarioReferencia: number;
  custoFixoTotal: number;
  percentualComprometido: number;
  sobraReal: number;
  percentualLivre: number;
  detalhamento: ItemComprometimento[];
}

export interface ResumoPlanejamento {
  entradasPlanejadas: number;
  saidasPlanejadas: number;
  sobraPlanejada: number;
}

export interface ResumoReal {
  entradasReais: number;
  saidasReais: number;
  sobraReal: number;
}

export class PlanoMensalAggregate {
  private constructor(
    private readonly _plano: PlanoMensal,
    private readonly _entradas: Entrada[],
    private readonly _contasFixas: ContaFixa[],
    private readonly _gastosVariaveis: GastoVariavel[],
    private readonly _metas: Meta[],
    private readonly _contas: ContaBancaria[],
  ) {}

  static reconstituir(
    plano: PlanoMensal,
    entradas: Entrada[],
    contasFixas: ContaFixa[],
    gastosVariaveis: GastoVariavel[],
    metas: Meta[],
    contas: ContaBancaria[],
  ): PlanoMensalAggregate {
    return new PlanoMensalAggregate(plano, entradas, contasFixas, gastosVariaveis, metas, contas);
  }

  static criar(plano: PlanoMensal): PlanoMensalAggregate {
    return new PlanoMensalAggregate(plano, [], [], [], [], []);
  }

  get plano(): PlanoMensal { return this._plano; }
  get id(): string { return this._plano.id; }
  get periodo(): Periodo { return this._plano.periodo; }
  get entradas(): Entrada[] { return [...this._entradas]; }
  get contasFixas(): ContaFixa[] { return [...this._contasFixas]; }
  get gastosVariaveis(): GastoVariavel[] { return [...this._gastosVariaveis]; }
  get metas(): Meta[] { return [...this._metas]; }
  get contas(): ContaBancaria[] { return [...this._contas]; }

  // --- Cálculos de resumo ---

  get totalEntradasPlanejadas(): Dinheiro {
    return this._entradas.reduce((acc, e) => acc.somar(e.valor), Dinheiro.zero());
  }

  get totalEntradasReais(): Dinheiro {
    return this._entradas
      .filter(e => e.recebido)
      .reduce((acc, e) => acc.somar(e.valor), Dinheiro.zero());
  }

  get totalContasFixasPlanejadas(): Dinheiro {
    return this._contasFixas.reduce((acc, c) => acc.somar(c.valorPlanejado), Dinheiro.zero());
  }

  get totalContasFixasReais(): Dinheiro {
    return this._contasFixas
      .filter(c => c.valorReal)
      .reduce((acc, c) => acc.somar(c.valorReal!), Dinheiro.zero());
  }

  get totalGastosPlanejados(): Dinheiro {
    return this._gastosVariaveis.reduce((acc, g) => acc.somar(g.valorPlanejado), Dinheiro.zero());
  }

  get totalGastosReais(): Dinheiro {
    return this._gastosVariaveis
      .filter(g => g.valorReal)
      .reduce((acc, g) => acc.somar(g.valorReal!), Dinheiro.zero());
  }

  get totalGastosUtilizados(): Dinheiro {
    return this._gastosVariaveis
      .filter(g => g.valorUtilizado)
      .reduce((acc, g) => acc.somar(g.valorUtilizado!), Dinheiro.zero());
  }

  get valorEfetivoDeveria(): number {
    const saidasEfetivas = this.totalContasFixasReais.somar(this.totalGastosUtilizados);
    return this.totalEntradasReais.subtrairPermitindoNegativo(saidasEfetivas);
  }

  get totalMetasMensais(): Dinheiro {
    return this._metas.reduce((acc, m) => acc.somar(m.valorMensal), Dinheiro.zero());
  }

  get totalSaidasPlanejadas(): Dinheiro {
    return this.totalContasFixasPlanejadas
      .somar(this.totalGastosPlanejados)
      .somar(this.totalMetasMensais);
  }

  get totalSaidasReais(): Dinheiro {
    return this.totalContasFixasReais
      .somar(this.totalGastosReais);
  }

  get sobraPlanejada(): number {
    return this.totalEntradasPlanejadas.subtrairPermitindoNegativo(this.totalSaidasPlanejadas);
  }

  get sobraReal(): number {
    return this.totalEntradasReais.subtrairPermitindoNegativo(this.totalSaidasReais);
  }

  get sobraGeral(): number {
    return this.totalEntradasPlanejadas.subtrairPermitindoNegativo(this.totalSaidasReais);
  }

  get saldoCarteira(): Dinheiro {
    return this._contas.reduce((acc, c) => acc.somar(c.saldo), Dinheiro.zero());
  }

  get resumoPlanejamento(): ResumoPlanejamento {
    return {
      entradasPlanejadas: this.totalEntradasPlanejadas.valor,
      saidasPlanejadas: this.totalSaidasPlanejadas.valor,
      sobraPlanejada: this.sobraPlanejada,
    };
  }

  get resumoReal(): ResumoReal {
    return {
      entradasReais: this.totalEntradasReais.valor,
      saidasReais: this.totalSaidasReais.valor,
      sobraReal: this.sobraReal,
    };
  }

  get comprometimentoSalario(): ComprometimentoSalario {
    const salario = this._plano.salarioReferencia.eZero()
      ? this.totalEntradasPlanejadas
      : this._plano.salarioReferencia;
    const custoTotal = this.totalSaidasPlanejadas;

    const detalhamento: ItemComprometimento[] = [
      ...this._contasFixas.map(c => ({
        item: c.nome,
        valor: c.valorPlanejado.valor,
        percentual: Number(c.valorPlanejado.percentualDe(salario).toFixed(1)),
      })),
      ...this._gastosVariaveis.map(g => ({
        item: g.nome,
        valor: g.valorPlanejado.valor,
        percentual: Number(g.valorPlanejado.percentualDe(salario).toFixed(1)),
      })),
      ...this._metas.map(m => ({
        item: m.nome,
        valor: m.valorMensal.valor,
        percentual: Number(m.valorMensal.percentualDe(salario).toFixed(1)),
      })),
    ];

    const percentualComprometido = custoTotal.percentualDe(salario);
    const sobraReal = salario.subtrairPermitindoNegativo(custoTotal);

    return {
      salarioReferencia: salario.valor,
      custoFixoTotal: custoTotal.valor,
      percentualComprometido: Number(percentualComprometido.toFixed(1)),
      sobraReal,
      percentualLivre: Number((100 - percentualComprometido).toFixed(1)),
      detalhamento,
    };
  }

  verificarAtrasos(hoje: Date): PlanoMensalAggregate {
    const contasAtualizadas = this._contasFixas.map(c => c.verificarAtraso(hoje));
    return new PlanoMensalAggregate(
      this._plano,
      this._entradas,
      contasAtualizadas,
      this._gastosVariaveis,
      this._metas,
      this._contas,
    );
  }
}
