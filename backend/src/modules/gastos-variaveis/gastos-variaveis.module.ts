import { Module } from '@nestjs/common';
import { GastosVariaveisController } from './gastos-variaveis.controller';
import { GastosVariaveisService } from './gastos-variaveis.service';
import { GastoVariavelRepository } from './gasto-variavel.repository';
import { PlanoMensalRepository } from '../plano-mensal/plano-mensal.repository';

@Module({
  controllers: [GastosVariaveisController],
  providers: [GastosVariaveisService, GastoVariavelRepository, PlanoMensalRepository],
  exports: [GastoVariavelRepository],
})
export class GastosVariaveisModule {}
