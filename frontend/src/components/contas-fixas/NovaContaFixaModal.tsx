'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { CriarContaFixaDTO } from '@financas/core';

interface Props {
  planoMensalId: string;
  onSalvar: (dto: CriarContaFixaDTO) => Promise<void>;
  onFechar: () => void;
}

export function NovaContaFixaModal({ planoMensalId, onSalvar, onFechar }: Props) {
  const [nome, setNome] = useState('');
  const [valorPlanejado, setValorPlanejado] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [observacao, setObservacao] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSalvar({
        planoMensalId,
        nome,
        valorPlanejado: Number(valorPlanejado),
        vencimento: vencimento || undefined,
        observacao: observacao || undefined,
      });
      onFechar();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md border-neon-cyan/20 shadow-glow-cyan animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Nova Conta Fixa</h2>
          <button onClick={onFechar} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Nome</label>
            <input className="input" value={nome} onChange={e => setNome(e.target.value)}
              required placeholder="Ex: Aluguel" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Valor planejado (R$)</label>
            <input className="input" type="number" step="0.01" min="0" value={valorPlanejado}
              onChange={e => setValorPlanejado(e.target.value)} required placeholder="0,00" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Vencimento</label>
            <input className="input" type="date" value={vencimento} onChange={e => setVencimento(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Observação</label>
            <input className="input" value={observacao} onChange={e => setObservacao(e.target.value)}
              placeholder="Opcional" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onFechar} className="btn-danger flex-1">Cancelar</button>
            <button type="submit" disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
