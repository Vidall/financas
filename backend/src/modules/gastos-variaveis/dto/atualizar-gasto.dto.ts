import { IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class AtualizarGastoDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorReal?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valorUtilizado?: number;

  @IsDateString()
  @IsOptional()
  data?: string;
}
