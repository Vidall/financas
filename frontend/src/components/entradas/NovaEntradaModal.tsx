'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { CriarEntradaDTO } from '@financas/core';

interface Props {
  planoMensalId: string;
  onSalvar: (dto: CriarEntradaDTO) => Promise<void>;
  onFechar: () => void;
}

export function NovaEntradaModal({ planoMensalId, onSalvar, onFechar }: Props) {
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');
  const [recebido, setRecebido] = useState(false);
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSalvar({ planoMensalId, nome, valor: Number(valor), recebido, data: data || undefined });
      onFechar();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md border-neon-cyan/20 shadow-glow-cyan animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Nova Entrada</h2>
          <button onClick={onFechar} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Nome</label>
            <input className="input" value={nome} onChange={e => setNome(e.target.value)}
              required placeholder="Ex: Salário" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Valor (R$)</label>
            <input className="input" type="number" step="0.01" min="0" value={valor}
              onChange={e => setValor(e.target.value)} required placeholder="0,00" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Data</label>
            <input className="input" type="date" value={data} onChange={e => setData(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="recebido" checked={recebido}
              onChange={e => setRecebido(e.target.checked)} className="w-4 h-4 accent-neon-cyan" />
            <label htmlFor="recebido" className="text-sm text-muted">Já recebido</label>
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
