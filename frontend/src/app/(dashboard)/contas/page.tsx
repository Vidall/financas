'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePeriodoStore } from '../../../store/periodoStore';
import { useMeses, useCriarPlano } from '../../../hooks/usePlanoMensal';
import { useContasFixas, useCriarContaFixa, usePagarConta, useRemoverContaFixa } from '../../../hooks/useContasFixas';
import { ContaFixaRow } from '../../../components/contas-fixas/ContaFixaRow';
import { NovaContaFixaModal } from '../../../components/contas-fixas/NovaContaFixaModal';
import { PagarContaModal } from '../../../components/contas-fixas/PagarContaModal';
import type { CriarContaFixaDTO, ContaFixaDTO } from '@financas/core';

export default function ContasPage() {
  const { mes, ano } = usePeriodoStore();
  const { data: meses } = useMeses();
  const plano = meses?.find(p => p.mes === mes && p.ano === ano);
  const { data: contas = [], isLoading } = useContasFixas(plano?.id ?? '');
  const criarConta = useCriarContaFixa();
  const pagarConta = usePagarConta();
  const removerConta = useRemoverContaFixa();
  const criarPlano = useCriarPlano();
  const [novaModal, setNovaModal] = useState(false);
  const [pagandoConta, setPagandoConta] = useState<ContaFixaDTO | null>(null);

  const totalPlanejado = contas.reduce((s, c) => s + c.valorPlanejado, 0);
  const totalReal = contas.reduce((s, c) => s + (c.valorReal ?? 0), 0);
  const pagas = contas.filter(c => c.status === 'Concluído').length;

  async function handleCriar(dto: CriarContaFixaDTO) {
    let planoId = plano?.id;
    if (!planoId) {
      const novo = await criarPlano.mutateAsync({ mes, ano, salarioReferencia: 0 });
      planoId = novo.id;
    }
    await criarConta.mutateAsync({ ...dto, planoMensalId: planoId });
  }

  async function handleRemover(id: string) {
    await removerConta.mutateAsync(id);
  }

  async function handlePagar(valorReal: number, dataPago: string, observacao?: string) {
    if (!pagandoConta) return;
    await pagarConta.mutateAsync({ id: pagandoConta.id, dto: { valorReal, dataPago, observacao } });
    setPagandoConta(null);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <p className="text-xs text-muted mb-1">Planejado</p>
          <p className="text-xl font-bold text-text">R$ {totalPlanejado.toFixed(2)}</p>
        </div>
        <div className="card border-neon-cyan/20">
          <p className="text-xs text-muted mb-1">Pago</p>
          <p className="text-xl font-bold text-neon-cyan">R$ {totalReal.toFixed(2)}</p>
        </div>
        <div className="card border-neon-green/20">
          <p className="text-xs text-muted mb-1">Pagas</p>
          <p className="text-xl font-bold text-neon-green">{pagas}/{contas.length}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text">Contas Fixas</h2>
          <button onClick={() => setNovaModal(true)} className="btn-primary flex items-center gap-1.5 text-xs py-1.5">
            <Plus size={14} /> Nova conta
          </button>
        </div>

        {isLoading ? (
          <p className="text-muted text-sm text-center py-8">Carregando...</p>
        ) : contas.length === 0 ? (
          <p className="text-muted text-sm text-center py-8">Nenhuma conta cadastrada</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Nome', 'Planejado', 'Pago', 'Status', 'Data', 'Observação', ''].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs text-muted font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contas.map(c => (
                  <ContaFixaRow
                    key={c.id}
                    conta={c}
                    onPagar={id => setPagandoConta(contas.find(x => x.id === id)!)}
                    onRemover={handleRemover}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {novaModal && (
        <NovaContaFixaModal
          planoMensalId={plano?.id ?? ''}
          onSalvar={handleCriar}
          onFechar={() => setNovaModal(false)}
        />
      )}
      {pagandoConta && (
        <PagarContaModal
          contaNome={pagandoConta.nome}
          valorPlanejado={pagandoConta.valorPlanejado}
          onConfirmar={handlePagar}
          onFechar={() => setPagandoConta(null)}
        />
      )}
    </div>
  );
}
