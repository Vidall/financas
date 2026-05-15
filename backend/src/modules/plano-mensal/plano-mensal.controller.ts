import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanoMensalService } from './plano-mensal.service';
import { CriarPlanoDto } from './dto/criar-plano.dto';

@UseGuards(JwtAuthGuard)
@Controller('plano')
export class PlanoMensalController {
  constructor(private readonly service: PlanoMensalService) {}

  @Post()
  criar(@Req() req: Request, @Body() dto: CriarPlanoDto) {
    const usuarioId = (req.user as any).sub as string;
    return this.service.criar(usuarioId, dto);
  }

  @Get('meses')
  listarMeses(@Req() req: Request) {
    const usuarioId = (req.user as any).sub as string;
    return this.service.listarMeses(usuarioId);
  }

  @Get(':mes/:ano')
  dashboard(
    @Req() req: Request,
    @Param('mes', ParseIntPipe) mes: number,
    @Param('ano', ParseIntPipe) ano: number,
  ) {
    const usuarioId = (req.user as any).sub as string;
    return this.service.dashboard(usuarioId, mes, ano);
  }
}
