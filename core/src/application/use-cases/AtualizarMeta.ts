import { Dinheiro } from '../../domain/value-objects/Dinheiro';
import { IMetaRepository } from '../ports/IMetaRepository';
import { MetaDTO } from '../dtos/MetaDTO';

export class AtualizarMeta {
  constructor(private readonly repo: IMetaRepository) {}

  async execute(metaId: string, novoTotalGuardado: number): Promise<MetaDTO> {
    const meta = await this.repo.findById(metaId);
    if (!meta) throw new Error('Meta não encontrada');

    const metaAtualizada = meta.atualizar(Dinheiro.de(novoTotalGuardado));
    await this.repo.save(metaAtualizada);

    return {
      id: metaAtualizada.id,
      planoMensalId: metaAtualizada.planoMensalId,
      nome: metaAtualizada.nome,
      tipo: metaAtualizada.tipo,
      metaTotal: metaAtualizada.metaTotal.valor,
      valorMensal: metaAtualizada.valorMensal.valor,
      totalGuardado: metaAtualizada.totalGuardado.valor,
      percentualAtingido: metaAtualizada.percentualAtingido,
      valorRestante: metaAtualizada.valorRestante,
      mesesEstimados: metaAtualizada.mesesEstimados,
      onde: metaAtualizada.onde,
      data: metaAtualizada.data?.toISOString(),
      status: metaAtualizada.status.valor,
      atingida: metaAtualizada.atingida,
    };
  }
}
