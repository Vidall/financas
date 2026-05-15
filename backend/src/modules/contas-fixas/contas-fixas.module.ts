import { Module } from '@nestjs/common';
import { ContasFixasController } from './contas-fixas.controller';
import { ContasFixasService } from './contas-fixas.service';
import { ContaFixaRepository } from './conta-fixa.repository';

@Module({
  controllers: [ContasFixasController],
  providers: [ContasFixasService, ContaFixaRepository],
  exports: [ContaFixaRepository],
})
export class ContasFixasModule {}
