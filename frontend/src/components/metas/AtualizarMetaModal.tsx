'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Props {
  metaNome: string;
  totalAtual: number;
  onConfirmar: (novoTotal: number) => Promise<void>;
  onFechar: () => void;
}

export function AtualizarMetaModal({ metaNome, totalAtual, onConfirmar, onFechar }: Props) {
  const [valor, setValor] = useState(String(totalAtual));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirmar(Number(valor));
      onFechar();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-sm border-neon-purple/20 shadow-glow-purple animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Atualizar meta</h2>
          <button onClick={onFechar} className="text-muted hover:text-text transition-colors"><X size={18} /></button>
        </div>
        <p className="text-sm text-muted mb-4">{metaNome}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Total guardado (R$)</label>
            <input className="input" type="number" step="0.01" min="0" value={valor}
              onChange={e => setValor(e.target.value)} required autoFocus />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onFechar} className="btn-danger flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
