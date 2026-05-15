import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContasFixasService } from './contas-fixas.service';
import { CriarContaFixaDto } from './dto/criar-conta-fixa.dto';
import { PagarContaDto } from './dto/pagar-conta.dto';

@UseGuards(JwtAuthGuard)
@Controller('contas-fixas')
export class ContasFixasController {
  constructor(private readonly service: ContasFixasService) {}

  @Get(':planoId')
  listar(@Param('planoId') planoId: string) {
    return this.service.listar(planoId);
  }

  @Post()
  criar(@Body() dto: CriarContaFixaDto) {
    return this.service.criar(dto);
  }

  @Patch(':id/pagar')
  pagar(@Param('id') id: string, @Body() dto: PagarContaDto) {
    return this.service.pagar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
