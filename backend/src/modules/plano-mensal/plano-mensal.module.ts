import { Module } from '@nestjs/common';
import { PlanoMensalController } from './plano-mensal.controller';
import { PlanoMensalService } from './plano-mensal.service';
import { PlanoMensalRepository } from './plano-mensal.repository';
import { EntradaRepository } from '../entradas/entrada.repository';
import { ContaFixaRepository } from '../contas-fixas/conta-fixa.repository';
import { GastoVariavelRepository } from '../gastos-variaveis/gasto-variavel.repository';
import { MetaRepository } from '../metas/meta.repository';
import { ContaBancariaRepository } from '../contas-bancarias/conta-bancaria.repository';

@Module({
  controllers: [PlanoMensalController],
  providers: [
    PlanoMensalService,
    PlanoMensalRepository,
    EntradaRepository,
    ContaFixaRepository,
    GastoVariavelRepository,
    MetaRepository,
    ContaBancariaRepository,
  ],
})
export class PlanoMensalModule {}
