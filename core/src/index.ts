// Domain - Value Objects
export { Dinheiro } from './domain/value-objects/Dinheiro';
export { Periodo } from './domain/value-objects/Periodo';
export { StatusPagamento } from './domain/value-objects/StatusPagamento';
export type { StatusPagamentoValor } from './domain/value-objects/StatusPagamento';
export { CategoriaDespesa } from './domain/value-objects/CategoriaDespesa';
export { Email } from './domain/value-objects/Email';

// Domain - Entities
export { Entrada } from './domain/entities/Entrada';
export type { EntradaProps } from './domain/entities/Entrada';
export { ContaFixa } from './domain/entities/ContaFixa';
export type { ContaFixaProps } from './domain/entities/ContaFixa';
export { GastoVariavel } from './domain/entities/GastoVariavel';
export type { GastoVariavelProps, FormaPagamento } from './domain/entities/GastoVariavel';
export { Meta } from './domain/entities/Meta';
export type { MetaProps, TipoMeta } from './domain/entities/Meta';
export { PlanoMensal } from './domain/entities/PlanoMensal';
export type { PlanoMensalProps } from './domain/entities/PlanoMensal';
export { ContaBancaria } from './domain/entities/ContaBancaria';
export type { ContaBancariaProps } from './domain/entities/ContaBancaria';
export { Usuario } from './domain/entities/Usuario';
export type { UsuarioProps } from './domain/entities/Usuario';

// Domain - Aggregates
export { PlanoMensalAggregate } from './domain/aggregates/PlanoMensalAggregate';
export type { ComprometimentoSalario, ResumoPlanejamento, ResumoReal, ItemComprometimento } from './domain/aggregates/PlanoMensalAggregate';

// Domain - Events
export { ContaPagaEvent } from './domain/events/ContaPagaEvent';
export { GastoExcedidoEvent } from './domain/events/GastoExcedidoEvent';
export { MetaAtualizadaEvent } from './domain/events/MetaAtualizadaEvent';

// Application - Ports (interfaces de repositório)
export type { IPlanoMensalRepository } from './application/ports/IPlanoMensalRepository';
export type { IEntradaRepository } from './application/ports/IEntradaRepository';
export type { IContaFixaRepository } from './application/ports/IContaFixaRepository';
export type { IGastoVariavelRepository } from './application/ports/IGastoVariavelRepository';
export type { IMetaRepository } from './application/ports/IMetaRepository';
export type { IUsuarioRepository } from './application/ports/IUsuarioRepository';
export type { IContaBancariaRepository } from './application/ports/IContaBancariaRepository';

// Application - DTOs
export type { ResumoDashboardDTO, ComprometimentoDTO, ItemComprometimentoDTO } from './application/dtos/ResumoDashboardDTO';
export type { EntradaDTO, CriarEntradaDTO } from './application/dtos/EntradaDTO';
export type { ContaFixaDTO, CriarContaFixaDTO, PagarContaDTO, AtualizarContaFixaDTO } from './application/dtos/ContaFixaDTO';
export type { GastoVariavelDTO, CriarGastoVariavelDTO } from './application/dtos/GastoVariavelDTO';
export type { MetaDTO, CriarMetaDTO } from './application/dtos/MetaDTO';

// Application - Use Cases
export { CriarPlanoMensal } from './application/use-cases/CriarPlanoMensal';
export type { CriarPlanoMensalInput, CriarPlanoMensalOutput } from './application/use-cases/CriarPlanoMensal';
export { RegistrarEntrada } from './application/use-cases/RegistrarEntrada';
export { PagarConta } from './application/use-cases/PagarConta';
export { LancarGasto } from './application/use-cases/LancarGasto';
export { AtualizarMeta } from './application/use-cases/AtualizarMeta';
export { ObterResumoDashboard } from './application/use-cases/ObterResumoDashboard';
