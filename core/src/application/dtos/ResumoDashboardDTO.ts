export interface ItemComprometimentoDTO {
  item: string;
  valor: number;
  percentual: number;
}

export interface ComprometimentoDTO {
  salarioReferencia: number;
  custoFixoTotal: number;
  percentualComprometido: number;
  sobraReal: number;
  percentualLivre: number;
  detalhamento: ItemComprometimentoDTO[];
}

export interface ResumoDashboardDTO {
  planoId: string;
  periodo: { mes: number; ano: number; descricao: string };
  planejamento: {
    entradas: number;
    saidasContas: number;
    saidasGastos: number;
    saidas: number;
    sobra: number;
  };
  real: {
    entradas: number;
    saidasContas: number;
    saidasGastos: number;
    saidas: number;
    sobra: number;
  };
  saldoCarteira: number;
  carteira: {
    valorReal: number;
    valorDeveria: number;
    diferenca: number;
  };
  comprometimento: ComprometimentoDTO;
  totalMetas: number;
  totalMetasAtingidas: number;
  aReceber: number;
  aPagar: number;
}
