import { Injectable } from '@nestjs/common';
import { LancarGasto } from '@financas/core';
import { GastoVariavelRepository } from './gasto-variavel.repository';
import { PlanoMensalRepository } from '../plano-mensal/plano-mensal.repository';
import { CriarGastoDto } from './dto/criar-gasto.dto';
import { AtualizarGastoDto } from './dto/atualizar-gasto.dto';
import { GastoVariavel, Dinheiro } from '@financas/core';

@Injectable()
export class GastosVariaveisService {
  constructor(
    private readonly gastoRepo: GastoVariavelRepository,
    private readonly planoRepo: PlanoMensalRepository,
  ) {}

  listar(planoMensalId: string) {
    return this.gastoRepo.findByPlanoMensal(planoMensalId);
  }

  async criar(dto: CriarGastoDto) {
    const useCase = new LancarGasto(this.gastoRepo, this.planoRepo);
    return useCase.execute(dto);
  }

  async atualizar(id: string, dto: AtualizarGastoDto) {
    const gasto = await this.gastoRepo.findById(id);
    if (!gasto) throw new Error('Gasto não encontrado');

    const atualizado = dto.valorReal !== undefined && dto.data
      ? gasto.lancar(Dinheiro.de(dto.valorReal), new Date(dto.data))
      : GastoVariavel.reconstituir({
          id: gasto.id,
          planoMensalId: gasto.planoMensalId,
          nome: gasto.nome,
          categoria: gasto.categoria,
          formaPagamento: gasto.formaPagamento,
          valorPlanejado: gasto.valorPlanejado,
          valorReal: dto.valorReal !== undefined ? Dinheiro.de(dto.valorReal) : gasto.valorReal,
          data: dto.data ? new Date(dto.data) : gasto.data,
          status: gasto.status,
        });

    await this.gastoRepo.save(atualizado);
    return atualizado;
  }

  remover(id: string) {
    return this.gastoRepo.delete(id);
  }
}
