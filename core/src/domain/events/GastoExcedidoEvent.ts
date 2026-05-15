import { Dinheiro } from '../value-objects/Dinheiro';

export class GastoExcedidoEvent {
  readonly occurredAt = new Date();
  readonly name = 'GastoExcedido';
  readonly excesso: number;

  constructor(
    readonly gastoVariavelId: string,
    readonly planoMensalId: string,
    readonly valorPlanejado: Dinheiro,
    readonly valorReal: Dinheiro,
  ) {
    this.excesso = valorReal.valor - valorPlanejado.valor;
  }
}
