import { Injectable } from '@nestjs/common';
import { MetaRepository } from './meta.repository';
import { CriarMetaDto } from './dto/criar-meta.dto';
import { AtualizarMetaDto } from './dto/atualizar-meta.dto';
import { Meta, Dinheiro, StatusPagamento } from '@financas/core';
import type { MetaDTO } from '@financas/core';

function toDTO(meta: Meta): MetaDTO {
  return {
    id: meta.id,
    planoMensalId: meta.planoMensalId,
    nome: meta.nome,
    tipo: meta.tipo,
    metaTotal: meta.metaTotal.valor,
    valorMensal: meta.valorMensal.valor,
    valorRealMes: meta.valorRealMes?.valor,
    totalGuardado: meta.totalGuardado.valor,
    percentualAtingido: meta.percentualAtingido,
    valorRestante: meta.valorRestante,
    mesesEstimados: meta.mesesEstimados,
    onde: meta.onde,
    data: meta.data?.toISOString(),
    status: meta.status.valor,
    atingida: meta.atingida,
  };
}

@Injectable()
export class MetasService {
  constructor(private readonly repo: MetaRepository) {}

  async listar(planoMensalId: string): Promise<MetaDTO[]> {
    const metas = await this.repo.findByPlanoMensal(planoMensalId);
    return metas.map(toDTO);
  }

  async criar(dto: CriarMetaDto): Promise<MetaDTO> {
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
    return toDTO(meta);
  }

  async atualizar(id: string, dto: AtualizarMetaDto): Promise<MetaDTO> {
    const meta = await this.repo.findById(id);
    if (!meta) throw new Error('Meta não encontrada');
    const atualizada = meta.atualizar(
      Dinheiro.de(dto.novoTotalGuardado),
      dto.valorRealMes !== undefined ? Dinheiro.de(dto.valorRealMes) : undefined,
    );
    await this.repo.save(atualizada);
    return toDTO(atualizada);
  }

  remover(id: string) {
    return this.repo.delete(id);
  }
}
