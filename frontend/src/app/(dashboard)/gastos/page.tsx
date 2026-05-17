'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePeriodoStore } from '../../../store/periodoStore';
import { useMeses, useCriarPlano } from '../../../hooks/usePlanoMensal';
import { useGastosVariaveis, useCriarGasto, useRemoverGasto, useAtualizarGasto } from '../../../hooks/useGastosVariaveis';
import { GastoRow } from '../../../components/gastos-variaveis/GastoRow';
import { NovoGastoModal } from '../../../components/gastos-variaveis/NovoGastoModal';
import { AtualizarGastoModal } from '../../../components/gastos-variaveis/AtualizarGastoModal';
import type { CriarGastoVariavelDTO, GastoVariavelDTO } from '@financas/core';

export default function GastosPage() {
  const { mes, ano } = usePeriodoStore();
  const { data: meses } = useMeses();
  const plano = meses?.find(p => p.mes === mes && p.ano === ano);
  const { data: gastos = [], isLoading } = useGastosVariaveis(plano?.id ?? '');
  const criarGasto = useCriarGasto();
  const removerGasto = useRemoverGasto();
  const atualizarGasto = useAtualizarGasto();
  const criarPlano = useCriarPlano();
  const [modal, setModal] = useState(false);
  const [atualizandoGasto, setAtualizandoGasto] = useState<GastoVariavelDTO | null>(null);

  const totalPlanejado = gastos.reduce((s, g) => s + g.valorPlanejado, 0);
  const totalReal = gastos.reduce((s, g) => s + (g.valorReal ?? 0), 0);
  const excedidos = gastos.filter(g => g.excedido).length;

  async function handleRemover(id: string) {
    await removerGasto.mutateAsync(id);
  }

  async function handleAtualizar(id: string, dto: { valorReal?: number; valorUtilizado?: number; data?: string }) {
    await atualizarGasto.mutateAsync({ id, ...dto });
  }

  async function handleSalvar(dto: CriarGastoVariavelDTO) {
    let planoId = plano?.id;
    if (!planoId) {
      const novo = await criarPlano.mutateAsync({ mes, ano, salarioReferencia: 0 });
      planoId = novo.id;
    }
    await criarGasto.mutateAsync({ ...dto, planoMensalId: planoId! });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="card">
          <p className="text-xs text-muted mb-1">Planejado</p>
          <p className="text-xl font-bold text-text">R$ {totalPlanejado.toFixed(2)}</p>
        </div>
        <div className="card border-neon-cyan/20">
          <p className="text-xs text-muted mb-1">Gasto real</p>
          <p className="text-xl font-bold text-neon-cyan">R$ {totalReal.toFixed(2)}</p>
        </div>
        <div className={`card ${excedidos > 0 ? 'border-neon-orange/30' : 'border-neon-green/20'}`}>
          <p className="text-xs text-muted mb-1">Excedidos</p>
          <p className={`text-xl font-bold ${excedidos > 0 ? 'text-neon-orange' : 'text-neon-green'}`}>{excedidos}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text">Gastos Variáveis</h2>
          <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-1.5 text-xs py-1.5">
            <Plus size={14} /> Novo gasto
          </button>
        </div>

        {isLoading ? (
          <p className="text-muted text-sm text-center py-8">Carregando...</p>
        ) : gastos.length === 0 ? (
          <p className="text-muted text-sm text-center py-8">Nenhum gasto cadastrado</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-border">
                  {['Nome', 'Categoria', 'Pagamento', 'Planejado', 'Real', 'Diferença', 'Status', 'Data', ''].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs text-muted font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="md:table-row-group block space-y-0">
                {gastos.map(g => (
                  <GastoRow
                    key={g.id}
                    gasto={g}
                    onRemover={handleRemover}
                    onAtualizar={id => setAtualizandoGasto(gastos.find(x => x.id === id)!)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <NovoGastoModal
          planoMensalId={plano?.id ?? ''}
          onSalvar={handleSalvar}
          onFechar={() => setModal(false)}
        />
      )}
      {atualizandoGasto && (
        <AtualizarGastoModal
          gasto={atualizandoGasto}
          onSalvar={handleAtualizar}
          onFechar={() => setAtualizandoGasto(null)}
        />
      )}
    </div>
  );
}
