import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CarteirasService } from './carteiras.service';
import { CriarCarteiraDto } from './dto/criar-carteira.dto';
import { AtualizarCarteiraDto } from './dto/atualizar-carteira.dto';

@UseGuards(JwtAuthGuard)
@Controller('carteiras')
export class CarteirasController {
  constructor(private readonly service: CarteirasService) {}

  @Get()
  listar(@Request() req: any) {
    return this.service.listar(req.user.sub);
  }

  @Post()
  criar(@Request() req: any, @Body() dto: CriarCarteiraDto) {
    return this.service.criar(req.user.sub, dto);
  }

  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarCarteiraDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  remover(@Param('id') id: string) {
    return this.service.remover(id);
  }
}
