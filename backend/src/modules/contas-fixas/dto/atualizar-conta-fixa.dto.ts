import { IsNumber, IsOptional, Min } from 'class-validator';

export class AtualizarContaFixaDto {
  @IsNumber()
  @Min(0)
  @IsOptional()
  valorPlanejado?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valorReal?: number;
}
