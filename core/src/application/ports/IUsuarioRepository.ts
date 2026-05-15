import { Usuario } from '../../domain/entities/Usuario';
import { Email } from '../../domain/value-objects/Email';

export interface IUsuarioRepository {
  findById(id: string): Promise<Usuario | null>;
  findByEmail(email: Email): Promise<Usuario | null>;
  save(usuario: Usuario): Promise<void>;
}
