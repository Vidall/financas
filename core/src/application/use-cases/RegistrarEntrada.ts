import { Entrada } from '../../domain/entities/Entrada';
import { Dinheiro } from '../../domain/value-objects/Dinheiro';
import { IEntradaRepository } from '../ports/IEntradaRepository';
import { IPlanoMensalRepository } from '../ports/IPlanoMensalRepository';
import { CriarEntradaDTO, EntradaDTO } from '../dtos/EntradaDTO';

export class RegistrarEntrada {
  constructor(
    private readonly entradaRepo: IEntradaRepository,
    private readonly planoRepo: IPlanoMensalRepository,
  ) {}

  async execute(dto: CriarEntradaDTO): Promise<EntradaDTO> {
    const plano = await this.planoRepo.findById(dto.planoMensalId);
    if (!plano) throw new Error('Plano mensal não encontrado');

    const entrada = Entrada.criar({
      id: crypto.randomUUID(),
      planoMensalId: dto.planoMensalId,
      nome: dto.nome,
      valor: Dinheiro.de(dto.valor),
      recebido: dto.recebido ?? false,
      data: dto.data ? new Date(dto.data) : undefined,
    });

    await this.entradaRepo.save(entrada);

    return {
      id: entrada.id,
      planoMensalId: entrada.planoMensalId,
      nome: entrada.nome,
      valor: entrada.valor.valor,
      recebido: entrada.recebido,
      data: entrada.data?.toISOString(),
    };
  }
}
