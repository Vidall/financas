import { Dinheiro } from '../value-objects/Dinheiro';
import { StatusPagamento } from '../value-objects/StatusPagamento';
import { CategoriaDespesa } from '../value-objects/CategoriaDespesa';
import { GastoExcedidoEvent } from '../events/GastoExcedidoEvent';

export type FormaPagamento = 'Débito' | 'Crédito' | 'Pix' | 'Dinheiro';

export interface GastoVariavelProps {
  id: string;
  planoMensalId: string;
  nome: string;
  categoria: CategoriaDespesa;
  formaPagamento: FormaPagamento;
  valorPlanejado: Dinheiro;
  valorReal?: Dinheiro;
  data?: Date;
  status: StatusPagamento;
}

export class GastoVariavel {
  private _events: GastoExcedidoEvent[] = [];

  private constructor(private readonly props: GastoVariavelProps) {}

  static criar(props: GastoVariavelProps): GastoVariavel {
    if (!props.nome.trim()) throw new Error('Nome do gasto é obrigatório');
    return new GastoVariavel({ ...props });
  }

  static reconstituir(props: GastoVariavelProps): GastoVariavel {
    return new GastoVariavel({ ...props });
  }

  get id(): string { return this.props.id; }
  get planoMensalId(): string { return this.props.planoMensalId; }
  get nome(): string { return this.props.nome; }
  get categoria(): CategoriaDespesa { return this.props.categoria; }
  get formaPagamento(): FormaPagamento { return this.props.formaPagamento; }
  get valorPlanejado(): Dinheiro { return this.props.valorPlanejado; }
  get valorReal(): Dinheiro | undefined { return this.props.valorReal; }
  get data(): Date | undefined { return this.props.data; }
  get status(): StatusPagamento { return this.props.status; }
  get events(): GastoExcedidoEvent[] { return [...this._events]; }

  get diferenca(): number {
    if (!this.props.valorReal) return 0;
    return this.props.valorPlanejado.subtrairPermitindoNegativo(this.props.valorReal);
  }

  get excedido(): boolean {
    return this.diferenca < 0;
  }

  lancar(valorReal: Dinheiro, data: Date): GastoVariavel {
    const gasto = new GastoVariavel({
      ...this.props,
      valorReal,
      data,
      status: StatusPagamento.Concluido,
    });
    if (valorReal.maiorQue(this.props.valorPlanejado)) {
      gasto._events.push(new GastoExcedidoEvent(
        this.props.id,
        this.props.planoMensalId,
        this.props.valorPlanejado,
        valorReal,
      ));
    }
    return gasto;
  }

  clearEvents(): void { this._events = []; }
}
