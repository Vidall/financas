import { Injectable } from '@nestjs/common';
import { PagarConta } from '@financas/core';
import { ContaFixaRepository } from './conta-fixa.repository';
import { CriarContaFixaDto } from './dto/criar-conta-fixa.dto';
import { PagarContaDto } from './dto/pagar-conta.dto';
import { ContaFixa, ContaFixaDTO, Dinheiro, StatusPagamento } from '@financas/core';

function toDTO(conta: ContaFixa): ContaFixaDTO {
  return {
    id: conta.id,
    planoMensalId: conta.planoMensalId,
    nome: conta.nome,
    valorPlanejado: conta.valorPlanejado.valor,
    valorReal: conta.valorReal?.valor,
    vencimento: conta.vencimento?.toISOString(),
    dataPago: conta.dataPago?.toISOString(),
    status: conta.status.valor,
    observacao: conta.observacao,
  };
}

@Injectable()
export class ContasFixasService {
  constructor(private readonly repo: ContaFixaRepository) {}

  async listar(planoMensalId: string): Promise<ContaFixaDTO[]> {
    const contas = await this.repo.findByPlanoMensal(planoMensalId);
    return contas.map(toDTO);
  }

  async criar(dto: CriarContaFixaDto): Promise<ContaFixaDTO> {
    const conta = ContaFixa.criar({
      id: crypto.randomUUID(),
      planoMensalId: dto.planoMensalId,
      nome: dto.nome,
      valorPlanejado: Dinheiro.de(dto.valorPlanejado),
      vencimento: dto.vencimento ? new Date(dto.vencimento) : undefined,
      status: StatusPagamento.Pendente,
      observacao: dto.observacao,
    });
    await this.repo.save(conta);
    return toDTO(conta);
  }

  async pagar(id: string, dto: PagarContaDto): Promise<ContaFixaDTO> {
    const useCase = new PagarConta(this.repo);
    return useCase.execute(id, dto);
  }

  remover(id: string) {
    return this.repo.delete(id);
  }
}
