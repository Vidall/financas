import { Module } from '@nestjs/common';
import { CarteirasController } from './carteiras.controller';
import { CarteirasService } from './carteiras.service';
import { ContaBancariaRepository } from './conta-bancaria.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CarteirasController],
  providers: [CarteirasService, ContaBancariaRepository],
})
export class CarteirasModule {}
