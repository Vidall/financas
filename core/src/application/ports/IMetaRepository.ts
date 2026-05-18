import { Meta } from '../../domain/entities/Meta';

export interface IMetaRepository {
  findById(id: string): Promise<Meta | null>;
  findByPlanoMensal(planoMensalId: string): Promise<Meta[]>;
  save(meta: Meta): Promise<void>;
  saveMany(metas: Meta[]): Promise<void>;
  delete(id: string): Promise<void>;
}
