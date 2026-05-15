import { IsString, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class CriarContaFixaDto {
  @IsString()
  planoMensalId: string;

  @IsString()
  nome: string;

  @IsNumber()
  @Min(0)
  valorPlanejado: number;

  @IsDateString()
  @IsOptional()
  vencimento?: string;

  @IsString()
  @IsOptional()
  observacao?: string;
}
