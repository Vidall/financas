'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { CriarMetaDTO } from '@financas/core';

interface Props {
  planoMensalId: string;
  onSalvar: (dto: CriarMetaDTO) => Promise<void>;
  onFechar: () => void;
}

export function NovaMetaModal({ planoMensalId, onSalvar, onFechar }: Props) {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'Reserva' | 'Meta'>('Meta');
  const [metaTotal, setMetaTotal] = useState('');
  const [valorMensal, setValorMensal] = useState('');
  const [onde, setOnde] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSalvar({ planoMensalId, nome, tipo, metaTotal: Number(metaTotal), valorMensal: Number(valorMensal), onde: onde || undefined });
      onFechar();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md border-neon-purple/20 shadow-glow-purple animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Nova Meta / Reserva</h2>
          <button onClick={onFechar} className="text-muted hover:text-text transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Nome</label>
              <input className="input" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Reserva de emergência" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Tipo</label>
              <select className="input" value={tipo} onChange={e => setTipo(e.target.value as 'Reserva' | 'Meta')}>
                <option value="Meta">Meta</option>
                <option value="Reserva">Reserva</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Meta total (R$)</label>
              <input className="input" type="number" step="0.01" min="0" value={metaTotal}
                onChange={e => setMetaTotal(e.target.value)} required placeholder="0,00" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Valor mensal (R$)</label>
              <input className="input" type="number" step="0.01" min="0" value={valorMensal}
                onChange={e => setValorMensal(e.target.value)} required placeholder="0,00" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Onde está guardado</label>
            <input className="input" value={onde} onChange={e => setOnde(e.target.value)} placeholder="Ex: Mercado Pago" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onFechar} className="btn-danger flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
