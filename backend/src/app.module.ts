import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PlanoMensalModule } from './modules/plano-mensal/plano-mensal.module';
import { EntradasModule } from './modules/entradas/entradas.module';
import { ContasFixasModule } from './modules/contas-fixas/contas-fixas.module';
import { GastosVariaveisModule } from './modules/gastos-variaveis/gastos-variaveis.module';
import { MetasModule } from './modules/metas/metas.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PlanoMensalModule,
    EntradasModule,
    ContasFixasModule,
    GastosVariaveisModule,
    MetasModule,
  ],
})
export class AppModule {}
