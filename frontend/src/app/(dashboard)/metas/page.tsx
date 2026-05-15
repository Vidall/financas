'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePeriodoStore } from '../../../store/periodoStore';
import { useMeses, useCriarPlano } from '../../../hooks/usePlanoMensal';
import { useMetas, useCriarMeta, useAtualizarMeta } from '../../../hooks/useMetas';
import { MetaCard } from '../../../components/metas/MetaCard';
import { NovaMetaModal } from '../../../components/metas/NovaMetaModal';
import { AtualizarMetaModal } from '../../../components/metas/AtualizarMetaModal';
import type { CriarMetaDTO, MetaDTO } from '@financas/core';

export default function MetasPage() {
  const { mes, ano } = usePeriodoStore();
  const { data: meses } = useMeses();
  const plano = meses?.find(p => p.mes === mes && p.ano === ano);
  const { data: metas = [], isLoading } = useMetas(plano?.id ?? '');
  const criarMeta = useCriarMeta();
  const atualizarMeta = useAtualizarMeta();
  const criarPlano = useCriarPlano();

  const [novaModal, setNovaModal] = useState(false);
  const [atualizando, setAtualizando] = useState<MetaDTO | null>(null);

  const totalGuardado = metas.reduce((s, m) => s + m.totalGuardado, 0);
  const totalMeta = metas.reduce((s, m) => s + m.metaTotal, 0);
  const atingidas = metas.filter(m => m.atingida).length;

  async function handleCriar(dto: CriarMetaDTO) {
    let planoId = plano?.id;
    if (!planoId) {
      const novo = await criarPlano.mutateAsync({ mes, ano, salarioReferencia: 0 });
      planoId = novo.id;
    }
    await criarMeta.mutateAsync({ ...dto, planoMensalId: planoId });
  }

  async function handleAtualizar(novoTotal: number) {
    if (!atualizando) return;
    await atualizarMeta.mutateAsync({ id: atualizando.id, novoTotalGuardado: novoTotal });
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="card border-neon-purple/20">
          <p className="text-xs text-muted mb-1">Total guardado</p>
          <p className="text-xl font-bold text-neon-purple">R$ {totalGuardado.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-muted mb-1">Total das metas</p>
          <p className="text-xl font-bold text-text">R$ {totalMeta.toFixed(2)}</p>
        </div>
        <div className="card border-neon-green/20">
          <p className="text-xs text-muted mb-1">Atingidas</p>
          <p className="text-xl font-bold text-neon-green">{atingidas}/{metas.length}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text">Metas e Reservas</h2>
        <button onClick={() => setNovaModal(true)} className="btn-primary flex items-center gap-1.5 text-xs py-1.5">
          <Plus size={14} /> Nova meta
        </button>
      </div>

      {isLoading ? (
        <p className="text-muted text-sm text-center py-8">Carregando...</p>
      ) : metas.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-muted text-sm">Nenhuma meta cadastrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metas.map(m => (
            <MetaCard key={m.id} meta={m} onAtualizar={id => setAtualizando(metas.find(x => x.id === id)!)} />
          ))}
        </div>
      )}

      {novaModal && (
        <NovaMetaModal
          planoMensalId={plano?.id ?? ''}
          onSalvar={handleCriar}
          onFechar={() => setNovaModal(false)}
        />
      )}
      {atualizando && (
        <AtualizarMetaModal
          metaNome={atualizando.nome}
          totalAtual={atualizando.totalGuardado}
          onConfirmar={handleAtualizar}
          onFechar={() => setAtualizando(null)}
        />
      )}
    </div>
  );
}
