import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, Min } from 'class-validator';

export class AtualizarEntradaDto {
  @IsString()
  @IsOptional()
  nome?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valor?: number;

  @IsBoolean()
  @IsOptional()
  recebido?: boolean;

  @IsDateString()
  @IsOptional()
  data?: string;
}
