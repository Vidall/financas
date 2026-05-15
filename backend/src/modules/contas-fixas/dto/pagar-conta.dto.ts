import { IsNumber, IsDateString, IsOptional, IsString, Min } from 'class-validator';

export class PagarContaDto {
  @IsNumber()
  @Min(0)
  valorReal: number;

  @IsDateString()
  dataPago: string;

  @IsString()
  @IsOptional()
  observacao?: string;
}
