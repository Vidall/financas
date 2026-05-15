export interface CriarContaFixaDTO {
  planoMensalId: string;
  nome: string;
  valorPlanejado: number;
  vencimento?: string;
  observacao?: string;
}

export interface PagarContaDTO {
  valorReal: number;
  dataPago: string;
  observacao?: string;
}

export interface ContaFixaDTO {
  id: string;
  planoMensalId: string;
  nome: string;
  valorPlanejado: number;
  valorReal?: number;
  vencimento?: string;
  dataPago?: string;
  status: string;
  observacao?: string;
}
