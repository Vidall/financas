import { Module } from '@nestjs/common';
import { EntradasController } from './entradas.controller';
import { EntradasService } from './entradas.service';
import { EntradaRepository } from './entrada.repository';
import { PlanoMensalRepository } from '../plano-mensal/plano-mensal.repository';

@Module({
  controllers: [EntradasController],
  providers: [EntradasService, EntradaRepository, PlanoMensalRepository],
  exports: [EntradaRepository],
})
export class EntradasModule {}
