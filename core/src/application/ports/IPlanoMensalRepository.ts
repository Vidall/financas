import { PlanoMensal } from '../../domain/entities/PlanoMensal';
import { Periodo } from '../../domain/value-objects/Periodo';

export interface IPlanoMensalRepository {
  findById(id: string): Promise<PlanoMensal | null>;
  findByUsuarioAndPeriodo(usuarioId: string, periodo: Periodo): Promise<PlanoMensal | null>;
  findAllByUsuario(usuarioId: string): Promise<PlanoMensal[]>;
  save(plano: PlanoMensal): Promise<void>;
  delete(id: string): Promise<void>;
}
