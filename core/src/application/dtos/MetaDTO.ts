export interface CriarMetaDTO {
  planoMensalId: string;
  nome: string;
  tipo: 'Reserva' | 'Meta';
  metaTotal: number;
  valorMensal: number;
  onde?: string;
  data?: string;
}

export interface MetaDTO {
  id: string;
  planoMensalId: string;
  nome: string;
  tipo: string;
  metaTotal: number;
  valorMensal: number;
  valorRealMes?: number;
  totalGuardado: number;
  percentualAtingido: number;
  valorRestante: number;
  mesesEstimados: number | null;
  onde?: string;
  data?: string;
  status: string;
  atingida: boolean;
}
