export interface CriarEntradaDTO {
  planoMensalId: string;
  nome: string;
  valor: number;
  recebido?: boolean;
  data?: string;
}

export interface EntradaDTO {
  id: string;
  planoMensalId: string;
  nome: string;
  valor: number;
  recebido: boolean;
  data?: string;
}
