export interface CriarGastoVariavelDTO {
  planoMensalId: string;
  nome: string;
  categoriaNome: string;
  categoriaIcone?: string;
  formaPagamento: string;
  valorPlanejado: number;
  valorReal?: number;
  data?: string;
}

export interface GastoVariavelDTO {
  id: string;
  planoMensalId: string;
  nome: string;
  categoria: { nome: string; icone: string };
  formaPagamento: string;
  valorPlanejado: number;
  valorReal?: number;
  diferenca: number;
  excedido: boolean;
  data?: string;
  status: string;
}
