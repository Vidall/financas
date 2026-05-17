import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ContaBancaria, Dinheiro } from '@financas/core';
import { ContaBancariaRepository } from './conta-bancaria.repository';
import { CriarCarteiraDto } from './dto/criar-carteira.dto';
import { AtualizarCarteiraDto } from './dto/atualizar-carteira.dto';

function toDTO(conta: ContaBancaria) {
  return { id: conta.id, banco: conta.banco, saldo: conta.saldo.valor };
}

@Injectable()
export class CarteirasService {
  constructor(private readonly repo: ContaBancariaRepository) {}

  async listar(usuarioId: string) {
    const contas = await this.repo.findByUsuario(usuarioId);
    return contas.map(toDTO);
  }

  async criar(usuarioId: string, dto: CriarCarteiraDto) {
    const conta = ContaBancaria.criar({
      id: randomUUID(),
      usuarioId,
      banco: dto.banco,
      saldo: Dinheiro.de(dto.saldo),
    });
    await this.repo.save(conta);
    return toDTO(conta);
  }

  async atualizar(id: string, dto: AtualizarCarteiraDto) {
    const conta = await this.repo.findById(id);
    if (!conta) throw new NotFoundException('Carteira não encontrada');
    const atualizada = conta.atualizarSaldo(Dinheiro.de(dto.saldo));
    await this.repo.save(atualizada);
    return toDTO(atualizada);
  }

  async remover(id: string) {
    await this.repo.delete(id);
  }
}
