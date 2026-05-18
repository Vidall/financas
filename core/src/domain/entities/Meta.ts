import { Dinheiro } from '../value-objects/Dinheiro';
import { StatusPagamento } from '../value-objects/StatusPagamento';
import { MetaAtualizadaEvent } from '../events/MetaAtualizadaEvent';

export type TipoMeta = 'Reserva' | 'Meta';

export interface MetaProps {
  id: string;
  planoMensalId: string;
  nome: string;
  tipo: TipoMeta;
  metaTotal: Dinheiro;
  valorMensal: Dinheiro;
  valorRealMes?: Dinheiro;
  totalGuardado: Dinheiro;
  onde?: string;
  data?: Date;
  status: StatusPagamento;
}

export class Meta {
  private _events: MetaAtualizadaEvent[] = [];

  private constructor(private readonly props: MetaProps) {}

  static criar(props: MetaProps): Meta {
    if (!props.nome.trim()) throw new Error('Nome da meta é obrigatório');
    return new Meta({ ...props });
  }

  static reconstituir(props: MetaProps): Meta {
    return new Meta({ ...props });
  }

  get id(): string { return this.props.id; }
  get planoMensalId(): string { return this.props.planoMensalId; }
  get nome(): string { return this.props.nome; }
  get tipo(): TipoMeta { return this.props.tipo; }
  get metaTotal(): Dinheiro { return this.props.metaTotal; }
  get valorMensal(): Dinheiro { return this.props.valorMensal; }
  get valorRealMes(): Dinheiro | undefined { return this.props.valorRealMes; }
  get totalGuardado(): Dinheiro { return this.props.totalGuardado; }
  get onde(): string | undefined { return this.props.onde; }
  get data(): Date | undefined { return this.props.data; }
  get status(): StatusPagamento { return this.props.status; }
  get events(): MetaAtualizadaEvent[] { return [...this._events]; }

  get percentualAtingido(): number {
    return this.props.totalGuardado.percentualDe(this.props.metaTotal);
  }

  get valorRestante(): number {
    return this.props.metaTotal.subtrairPermitindoNegativo(this.props.totalGuardado);
  }

  get mesesEstimados(): number | null {
    if (this.props.valorMensal.eZero()) return null;
    const restante = Math.max(0, this.valorRestante);
    return Math.ceil(restante / this.props.valorMensal.valor);
  }

  get atingida(): boolean {
    return this.percentualAtingido >= 100;
  }

  atualizar(novoTotalGuardado: Dinheiro, valorRealMes?: Dinheiro): Meta {
    const meta = new Meta({
      ...this.props,
      totalGuardado: novoTotalGuardado,
      ...(valorRealMes !== undefined && { valorRealMes }),
    });
    meta._events.push(new MetaAtualizadaEvent(this.props.id, this.props.planoMensalId, novoTotalGuardado));
    return meta;
  }

  clearEvents(): void { this._events = []; }
}
