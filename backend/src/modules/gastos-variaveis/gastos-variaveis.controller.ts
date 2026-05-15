import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GastosVariaveisService } from './gastos-variaveis.service';
import { CriarGastoDto } from './dto/criar-gasto.dto';
import { AtualizarGastoDto } from './dto/atualizar-gasto.dto';

@UseGuards(JwtAuthGuard)
@Controller('gastos-variaveis')
export class GastosVariaveisController {
  constructor(private readonly service: GastosVariaveisService) {}

  @Get(':planoId')
  listar(@Param('planoId') planoId: string) {
    return this.service.listar(planoId);
  }

  @Post()
  criar(@Body() dto: CriarGastoDto) {
    return this.service.criar(dto);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarGastoDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
