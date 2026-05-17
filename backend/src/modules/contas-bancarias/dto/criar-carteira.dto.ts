import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CriarCarteiraDto {
  @IsString()
  @IsNotEmpty()
  banco: string;

  @IsNumber()
  @Min(0)
  saldo: number;
}
