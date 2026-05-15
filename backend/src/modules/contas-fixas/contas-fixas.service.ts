import { Injectable } from '@nestjs/common';
import { PagarConta } from '@financas/core';
import { ContaFixaRepository } from './conta-fixa.repository';
import { CriarContaFixaDto } from './dto/criar-conta-fixa.dto';
import { PagarContaDto } from './dto/pagar-conta.dto';
import { ContaFixa, Dinheiro, StatusPagamento } from '@financas/core';

@Injectable()
export class ContasFixasService {
  constructor(private readonly repo: ContaFixaRepository) {}

  listar(planoMensalId: string) {
    return this.repo.findByPlanoMensal(planoMensalId);
  }

  async criar(dto: CriarContaFixaDto) {
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
    return conta;
  }

  async pagar(id: string, dto: PagarContaDto) {
    const useCase = new PagarConta(this.repo);
    return useCase.execute(id, dto);
  }

  remover(id: string) {
    return this.repo.delete(id);
  }
}
