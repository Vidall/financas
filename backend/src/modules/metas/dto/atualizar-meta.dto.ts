import { IsNumber, Min } from 'class-validator';

export class AtualizarMetaDto {
  @IsNumber()
  @Min(0)
  novoTotalGuardado: number;
}
