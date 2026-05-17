import { IsNumber, Min } from 'class-validator';

export class AtualizarCarteiraDto {
  @IsNumber()
  @Min(0)
  saldo: number;
}
