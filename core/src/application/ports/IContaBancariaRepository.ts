import { ContaBancaria } from '../../domain/entities/ContaBancaria';

export interface IContaBancariaRepository {
  findById(id: string): Promise<ContaBancaria | null>;
  findByUsuario(usuarioId: string): Promise<ContaBancaria[]>;
  save(conta: ContaBancaria): Promise<void>;
  delete(id: string): Promise<void>;
}
