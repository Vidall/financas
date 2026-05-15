import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MetasService } from './metas.service';
import { CriarMetaDto } from './dto/criar-meta.dto';
import { AtualizarMetaDto } from './dto/atualizar-meta.dto';

@UseGuards(JwtAuthGuard)
@Controller('metas')
export class MetasController {
  constructor(private readonly service: MetasService) {}

  @Get(':planoId')
  listar(@Param('planoId') planoId: string) {
    return this.service.listar(planoId);
  }

  @Post()
  criar(@Body() dto: CriarMetaDto) {
    return this.service.criar(dto);
  }

  @Patch(':id/atualizar')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarMetaDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
