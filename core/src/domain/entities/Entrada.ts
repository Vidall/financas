import { Dinheiro } from '../value-objects/Dinheiro';

export interface EntradaProps {
  id: string;
  planoMensalId: string;
  nome: string;
  valor: Dinheiro;
  recebido: boolean;
  data?: Date;
}

export class Entrada {
  private constructor(private readonly props: EntradaProps) {}

  static criar(props: EntradaProps): Entrada {
    if (!props.nome.trim()) throw new Error('Nome da entrada é obrigatório');
    return new Entrada({ ...props });
  }

  static reconstituir(props: EntradaProps): Entrada {
    return new Entrada({ ...props });
  }

  get id(): string { return this.props.id; }
  get planoMensalId(): string { return this.props.planoMensalId; }
  get nome(): string { return this.props.nome; }
  get valor(): Dinheiro { return this.props.valor; }
  get recebido(): boolean { return this.props.recebido; }
  get data(): Date | undefined { return this.props.data; }

  marcarComoRecebido(data: Date): Entrada {
    return new Entrada({ ...this.props, recebido: true, data });
  }
}
