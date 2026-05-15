import { Periodo } from '../value-objects/Periodo';
import { Dinheiro } from '../value-objects/Dinheiro';

export interface ItemComprometimento {
  item: string;
  valor: number;
  percentual: number;
}

export interface PlanoMensalProps {
  id: string;
  usuarioId: string;
  periodo: Periodo;
  salarioReferencia: Dinheiro;
  criadoEm: Date;
}

export class PlanoMensal {
  private constructor(private readonly props: PlanoMensalProps) {}

  static criar(props: PlanoMensalProps): PlanoMensal {
    return new PlanoMensal({ ...props });
  }

  static reconstituir(props: PlanoMensalProps): PlanoMensal {
    return new PlanoMensal({ ...props });
  }

  get id(): string { return this.props.id; }
  get usuarioId(): string { return this.props.usuarioId; }
  get periodo(): Periodo { return this.props.periodo; }
  get salarioReferencia(): Dinheiro { return this.props.salarioReferencia; }
  get criadoEm(): Date { return this.props.criadoEm; }
}
