import { Injectable } from '@nestjs/common';
import {
  CriarPlanoMensal,
  ObterResumoDashboard,
} from '@financas/core';
import { PlanoMensalRepository } from './plano-mensal.repository';
import { EntradaRepository } from '../entradas/entrada.repository';
import { ContaFixaRepository } from '../contas-fixas/conta-fixa.repository';
import { GastoVariavelRepository } from '../gastos-variaveis/gasto-variavel.repository';
import { MetaRepository } from '../metas/meta.repository';
import { ContaBancariaRepository } from '../contas-bancarias/conta-bancaria.repository';
import { CriarPlanoDto } from './dto/criar-plano.dto';

@Injectable()
export class PlanoMensalService {
  constructor(
    private readonly planoRepo: PlanoMensalRepository,
    private readonly entradaRepo: EntradaRepository,
    private readonly contaFixaRepo: ContaFixaRepository,
    private readonly gastoRepo: GastoVariavelRepository,
    private readonly metaRepo: MetaRepository,
    private readonly contaBancariaRepo: ContaBancariaRepository,
  ) {}

  async criar(usuarioId: string, dto: CriarPlanoDto) {
    const useCase = new CriarPlanoMensal(this.planoRepo, this.metaRepo);
    return useCase.execute({ usuarioId, ...dto });
  }

  async dashboard(usuarioId: string, mes: number, ano: number) {
    const useCase = new ObterResumoDashboard(
      this.planoRepo,
      this.entradaRepo,
      this.contaFixaRepo,
      this.gastoRepo,
      this.metaRepo,
      this.contaBancariaRepo,
    );
    return useCase.execute(usuarioId, mes, ano);
  }

  async listarMeses(usuarioId: string) {
    const planos = await this.planoRepo.findAllByUsuario(usuarioId);
    return planos.map(p => ({
      id: p.id,
      mes: p.periodo.mes,
      ano: p.periodo.ano,
      descricao: p.periodo.toString(),
    }));
  }
}
