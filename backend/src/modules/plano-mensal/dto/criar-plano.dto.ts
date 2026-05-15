import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CriarPlanoDto {
  @IsInt()
  @Min(1) @Max(12)
  mes: number;

  @IsInt()
  @Min(2000) @Max(2100)
  ano: number;

  @IsNumber()
  @Min(0)
  salarioReferencia: number;
}
