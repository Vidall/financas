import { GastoVariavel, FormaPagamento } from '../../domain/entities/GastoVariavel';
import { Dinheiro } from '../../domain/value-objects/Dinheiro';
import { CategoriaDespesa } from '../../domain/value-objects/CategoriaDespesa';
import { StatusPagamento } from '../../domain/value-objects/StatusPagamento';
import { IGastoVariavelRepository } from '../ports/IGastoVariavelRepository';
import { IPlanoMensalRepository } from '../ports/IPlanoMensalRepository';
import { CriarGastoVariavelDTO, GastoVariavelDTO } from '../dtos/GastoVariavelDTO';
import { randomUUID } from 'crypto';

export class LancarGasto {
  constructor(
    private readonly gastoRepo: IGastoVariavelRepository,
    private readonly planoRepo: IPlanoMensalRepository,
  ) {}

  async execute(dto: CriarGastoVariavelDTO): Promise<GastoVariavelDTO> {
    const plano = await this.planoRepo.findById(dto.planoMensalId);
    if (!plano) throw new Error('Plano mensal não encontrado');

    const categoria = CategoriaDespesa.de(dto.categoriaNome, dto.categoriaIcone);

    const gasto = GastoVariavel.criar({
      id:randomUUID(),
      planoMensalId: dto.planoMensalId,
      nome: dto.nome,
      categoria,
      formaPagamento: dto.formaPagamento as FormaPagamento,
      valorPlanejado: Dinheiro.de(dto.valorPlanejado),
      status: StatusPagamento.Pendente,
    });

    const gastoFinal = dto.valorReal && dto.data
      ? gasto.lancar(Dinheiro.de(dto.valorReal), new Date(dto.data))
      : gasto;

    await this.gastoRepo.save(gastoFinal);

    return {
      id: gastoFinal.id,
      planoMensalId: gastoFinal.planoMensalId,
      nome: gastoFinal.nome,
      categoria: { nome: gastoFinal.categoria.nome, icone: gastoFinal.categoria.icone },
      formaPagamento: gastoFinal.formaPagamento,
      valorPlanejado: gastoFinal.valorPlanejado.valor,
      valorReal: gastoFinal.valorReal?.valor,
      diferenca: gastoFinal.diferenca,
      excedido: gastoFinal.excedido,
      data: gastoFinal.data?.toISOString(),
      status: gastoFinal.status.valor,
    };
  }
}
