import { Dinheiro } from '../value-objects/Dinheiro';

export class ContaPagaEvent {
  readonly occurredAt = new Date();
  readonly name = 'ContaPaga';

  constructor(
    readonly contaFixaId: string,
    readonly planoMensalId: string,
    readonly valorPago: Dinheiro,
    readonly dataPago: Date,
  ) {}
}
