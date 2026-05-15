export type StatusPagamentoValor = 'Pendente' | 'Concluído' | 'Atrasado';

export class StatusPagamento {
  private constructor(private readonly _valor: StatusPagamentoValor) {}

  static readonly Pendente = new StatusPagamento('Pendente');
  static readonly Concluido = new StatusPagamento('Concluído');
  static readonly Atrasado = new StatusPagamento('Atrasado');

  static de(valor: string): StatusPagamento {
    switch (valor) {
      case 'Pendente': return StatusPagamento.Pendente;
      case 'Concluído': return StatusPagamento.Concluido;
      case 'Atrasado': return StatusPagamento.Atrasado;
      default: throw new Error(`Status inválido: ${valor}`);
    }
  }

  get valor(): StatusPagamentoValor { return this._valor; }

  isPendente(): boolean { return this._valor === 'Pendente'; }
  isConcluido(): boolean { return this._valor === 'Concluído'; }
  isAtrasado(): boolean { return this._valor === 'Atrasado'; }

  toString(): string { return this._valor; }
}
