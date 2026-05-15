import { Module } from '@nestjs/common';
import { MetasController } from './metas.controller';
import { MetasService } from './metas.service';
import { MetaRepository } from './meta.repository';

@Module({
  controllers: [MetasController],
  providers: [MetasService, MetaRepository],
  exports: [MetaRepository],
})
export class MetasModule {}
