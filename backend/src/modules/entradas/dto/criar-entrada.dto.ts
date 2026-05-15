import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, Min } from 'class-validator';

export class CriarEntradaDto {
  @IsString()
  planoMensalId: string;

  @IsString()
  nome: string;

  @IsNumber()
  @Min(0)
  valor: number;

  @IsBoolean()
  @IsOptional()
  recebido?: boolean;

  @IsDateString()
  @IsOptional()
  data?: string;
}
