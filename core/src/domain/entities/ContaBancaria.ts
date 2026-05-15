import { Dinheiro } from '../value-objects/Dinheiro';

export interface ContaBancariaProps {
  id: string;
  usuarioId: string;
  banco: string;
  saldo: Dinheiro;
}

export class ContaBancaria {
  private constructor(private readonly props: ContaBancariaProps) {}

  static criar(props: ContaBancariaProps): ContaBancaria {
    if (!props.banco.trim()) throw new Error('Nome do banco é obrigatório');
    return new ContaBancaria({ ...props });
  }

  static reconstituir(props: ContaBancariaProps): ContaBancaria {
    return new ContaBancaria({ ...props });
  }

  get id(): string { return this.props.id; }
  get usuarioId(): string { return this.props.usuarioId; }
  get banco(): string { return this.props.banco; }
  get saldo(): Dinheiro { return this.props.saldo; }

  atualizarSaldo(novoSaldo: Dinheiro): ContaBancaria {
    return new ContaBancaria({ ...this.props, saldo: novoSaldo });
  }
}
