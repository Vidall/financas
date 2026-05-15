import { Injectable } from '@nestjs/common';
import { AtualizarMeta } from '@financas/core';
import { MetaRepository } from './meta.repository';
import { CriarMetaDto } from './dto/criar-meta.dto';
import { AtualizarMetaDto } from './dto/atualizar-meta.dto';
import { Meta, Dinheiro, StatusPagamento } from '@financas/core';

@Injectable()
export class MetasService {
  constructor(private readonly repo: MetaRepository) {}

  listar(planoMensalId: string) {
    return this.repo.findByPlanoMensal(planoMensalId);
  }

  async criar(dto: CriarMetaDto) {
    const meta = Meta.criar({
      id: crypto.randomUUID(),
      planoMensalId: dto.planoMensalId,
      nome: dto.nome,
      tipo: dto.tipo,
      metaTotal: Dinheiro.de(dto.metaTotal),
      valorMensal: Dinheiro.de(dto.valorMensal),
      totalGuardado: Dinheiro.zero(),
      onde: dto.onde,
      data: dto.data ? new Date(dto.data) : undefined,
      status: StatusPagamento.Pendente,
    });
    await this.repo.save(meta);
    return meta;
  }

  async atualizar(id: string, dto: AtualizarMetaDto) {
    const useCase = new AtualizarMeta(this.repo);
    return useCase.execute(id, dto.novoTotalGuardado);
  }

  remover(id: string) {
    return this.repo.delete(id);
  }
}
