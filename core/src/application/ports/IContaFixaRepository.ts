import { ContaFixa } from '../../domain/entities/ContaFixa';

export interface IContaFixaRepository {
  findById(id: string): Promise<ContaFixa | null>;
  findByPlanoMensal(planoMensalId: string): Promise<ContaFixa[]>;
  save(conta: ContaFixa): Promise<void>;
  delete(id: string): Promise<void>;
}
