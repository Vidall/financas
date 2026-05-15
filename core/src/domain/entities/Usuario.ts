import { Email } from '../value-objects/Email';

export interface UsuarioProps {
  id: string;
  nome: string;
  email: Email;
  senhaHash: string;
  criadoEm: Date;
}

export class Usuario {
  private constructor(private readonly props: UsuarioProps) {}

  static criar(props: UsuarioProps): Usuario {
    if (!props.nome.trim()) throw new Error('Nome do usuário é obrigatório');
    return new Usuario({ ...props });
  }

  static reconstituir(props: UsuarioProps): Usuario {
    return new Usuario({ ...props });
  }

  get id(): string { return this.props.id; }
  get nome(): string { return this.props.nome; }
  get email(): Email { return this.props.email; }
  get senhaHash(): string { return this.props.senhaHash; }
  get criadoEm(): Date { return this.props.criadoEm; }
}
