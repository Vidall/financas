import { GastoVariavel } from '../../domain/entities/GastoVariavel';

export interface IGastoVariavelRepository {
  findById(id: string): Promise<GastoVariavel | null>;
  findByPlanoMensal(planoMensalId: string): Promise<GastoVariavel[]>;
  findByCategoria(planoMensalId: string, categoriaNome: string): Promise<GastoVariavel[]>;
  save(gasto: GastoVariavel): Promise<void>;
  delete(id: string): Promise<void>;
}
