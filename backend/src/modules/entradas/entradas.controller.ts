import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EntradasService } from './entradas.service';
import { CriarEntradaDto } from './dto/criar-entrada.dto';
import { AtualizarEntradaDto } from './dto/atualizar-entrada.dto';

@UseGuards(JwtAuthGuard)
@Controller('entradas')
export class EntradasController {
  constructor(private readonly service: EntradasService) {}

  @Get(':planoId')
  listar(@Param('planoId') planoId: string) {
    return this.service.listar(planoId);
  }

  @Post()
  criar(@Body() dto: CriarEntradaDto) {
    return this.service.criar(dto);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarEntradaDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
