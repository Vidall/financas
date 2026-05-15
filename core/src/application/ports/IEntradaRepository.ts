import { Entrada } from '../../domain/entities/Entrada';

export interface IEntradaRepository {
  findById(id: string): Promise<Entrada | null>;
  findByPlanoMensal(planoMensalId: string): Promise<Entrada[]>;
  save(entrada: Entrada): Promise<void>;
  delete(id: string): Promise<void>;
}
