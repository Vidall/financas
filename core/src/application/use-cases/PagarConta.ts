import { Dinheiro } from '../../domain/value-objects/Dinheiro';
import { IContaFixaRepository } from '../ports/IContaFixaRepository';
import { PagarContaDTO, ContaFixaDTO } from '../dtos/ContaFixaDTO';

export class PagarConta {
  constructor(private readonly repo: IContaFixaRepository) {}

  async execute(contaId: string, dto: PagarContaDTO): Promise<ContaFixaDTO> {
    const conta = await this.repo.findById(contaId);
    if (!conta) throw new Error('Conta não encontrada');

    const contaPaga = conta.pagar(
      Dinheiro.de(dto.valorReal),
      new Date(dto.dataPago),
      dto.observacao,
    );

    await this.repo.save(contaPaga);

    return {
      id: contaPaga.id,
      planoMensalId: contaPaga.planoMensalId,
      nome: contaPaga.nome,
      valorPlanejado: contaPaga.valorPlanejado.valor,
      valorReal: contaPaga.valorReal?.valor,
      dataPago: contaPaga.dataPago?.toISOString(),
      status: contaPaga.status.valor,
      observacao: contaPaga.observacao,
    };
  }
}
