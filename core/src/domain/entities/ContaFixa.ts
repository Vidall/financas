import { Dinheiro } from '../value-objects/Dinheiro';
import { StatusPagamento } from '../value-objects/StatusPagamento';
import { ContaPagaEvent } from '../events/ContaPagaEvent';

export interface ContaFixaProps {
  id: string;
  planoMensalId: string;
  nome: string;
  valorPlanejado: Dinheiro;
  valorReal?: Dinheiro;
  vencimento?: Date;
  dataPago?: Date;
  status: StatusPagamento;
  observacao?: string;
}

export class ContaFixa {
  private _events: ContaPagaEvent[] = [];

  private constructor(private readonly props: ContaFixaProps) {}

  static criar(props: ContaFixaProps): ContaFixa {
    if (!props.nome.trim()) throw new Error('Nome da conta é obrigatório');
    return new ContaFixa({ ...props });
  }

  static reconstituir(props: ContaFixaProps): ContaFixa {
    return new ContaFixa({ ...props });
  }

  get id(): string { return this.props.id; }
  get planoMensalId(): string { return this.props.planoMensalId; }
  get nome(): string { return this.props.nome; }
  get valorPlanejado(): Dinheiro { return this.props.valorPlanejado; }
  get valorReal(): Dinheiro | undefined { return this.props.valorReal; }
  get vencimento(): Date | undefined { return this.props.vencimento; }
  get dataPago(): Date | undefined { return this.props.dataPago; }
  get status(): StatusPagamento { return this.props.status; }
  get observacao(): string | undefined { return this.props.observacao; }
  get events(): ContaPagaEvent[] { return [...this._events]; }

  verificarAtraso(hoje: Date): ContaFixa {
    if (this.props.vencimento && this.props.status.isPendente()) {
      if (hoje > this.props.vencimento) {
        return new ContaFixa({ ...this.props, status: StatusPagamento.Atrasado });
      }
    }
    return this;
  }

  atualizar(valorPlanejado?: Dinheiro, valorReal?: Dinheiro): ContaFixa {
    return new ContaFixa({
      ...this.props,
      ...(valorPlanejado !== undefined && { valorPlanejado }),
      ...(valorReal !== undefined && { valorReal }),
    });
  }

  pagar(valorReal: Dinheiro, dataPago: Date, observacao?: string): ContaFixa {
    const conta = new ContaFixa({
      ...this.props,
      valorReal,
      dataPago,
      status: StatusPagamento.Concluido,
      observacao,
    });
    conta._events.push(new ContaPagaEvent(this.props.id, this.props.planoMensalId, valorReal, dataPago));
    return conta;
  }

  clearEvents(): void { this._events = []; }
}
