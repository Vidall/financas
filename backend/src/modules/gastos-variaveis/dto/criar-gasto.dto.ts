import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CriarGastoDto {
  @IsString()
  planoMensalId: string;

  @IsString()
  nome: string;

  @IsString()
  categoriaNome: string;

  @IsString()
  @IsOptional()
  categoriaIcone?: string;

  @IsString()
  formaPagamento: string;

  @IsNumber()
  @Min(0)
  valorPlanejado: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valorReal?: number;

  @IsDateString()
  @IsOptional()
  data?: string;
}
