import { Injectable, NotFoundException } from '@nestjs/common';
import { RegistrarEntrada } from '@financas/core';
import { EntradaRepository } from './entrada.repository';
import { PlanoMensalRepository } from '../plano-mensal/plano-mensal.repository';
import { CriarEntradaDto } from './dto/criar-entrada.dto';
import { AtualizarEntradaDto } from './dto/atualizar-entrada.dto';
import { Dinheiro, Entrada } from '@financas/core';
import type { EntradaDTO } from '@financas/core';

function toDTO(entrada: Entrada): EntradaDTO {
  return {
    id: entrada.id,
    planoMensalId: entrada.planoMensalId,
    nome: entrada.nome,
    valor: entrada.valor.valor,
    recebido: entrada.recebido,
    data: entrada.data?.toISOString(),
  };
}

@Injectable()
export class EntradasService {
  constructor(
    private readonly entradaRepo: EntradaRepository,
    private readonly planoRepo: PlanoMensalRepository,
  ) {}

  async listar(planoMensalId: string): Promise<EntradaDTO[]> {
    const entradas = await this.entradaRepo.findByPlanoMensal(planoMensalId);
    return entradas.map(toDTO);
  }

  async criar(dto: CriarEntradaDto): Promise<EntradaDTO> {
    const useCase = new RegistrarEntrada(this.entradaRepo, this.planoRepo);
    return useCase.execute(dto);
  }

  async atualizar(id: string, dto: AtualizarEntradaDto): Promise<EntradaDTO> {
    const entrada = await this.entradaRepo.findById(id);
    if (!entrada) throw new NotFoundException('Entrada não encontrada');

    const atualizada = Entrada.reconstituir({
      id: entrada.id,
      planoMensalId: entrada.planoMensalId,
      nome: dto.nome ?? entrada.nome,
      valor: dto.valor !== undefined ? Dinheiro.de(dto.valor) : entrada.valor,
      recebido: dto.recebido ?? entrada.recebido,
      data: dto.data ? new Date(dto.data) : entrada.data,
    });

    await this.entradaRepo.save(atualizada);
    return toDTO(atualizada);
  }

  async remover(id: string): Promise<void> {
    await this.entradaRepo.delete(id);
  }
}
