import { Dinheiro } from '../value-objects/Dinheiro';

export class MetaAtualizadaEvent {
  readonly occurredAt = new Date();
  readonly name = 'MetaAtualizada';

  constructor(
    readonly metaId: string,
    readonly planoMensalId: string,
    readonly novoTotalGuardado: Dinheiro,
  ) {}
}
