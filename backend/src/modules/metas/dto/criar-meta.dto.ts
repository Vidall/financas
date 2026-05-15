import { IsString, IsNumber, IsOptional, IsDateString, IsIn, Min } from 'class-validator';

export class CriarMetaDto {
  @IsString()
  planoMensalId: string;

  @IsString()
  nome: string;

  @IsIn(['Reserva', 'Meta'])
  tipo: 'Reserva' | 'Meta';

  @IsNumber()
  @Min(0)
  metaTotal: number;

  @IsNumber()
  @Min(0)
  valorMensal: number;

  @IsString()
  @IsOptional()
  onde?: string;

  @IsDateString()
  @IsOptional()
  data?: string;
}
