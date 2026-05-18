'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { ContaFixaDTO } from '@financas/core';

interface Props {
  conta: ContaFixaDTO;
  onSalvar: (id: string, dto: { valorPlanejado?: number; valorReal?: number }) => Promise<void>;
  onFechar: () => void;
}

export function EditarContaFixaModal({ conta, onSalvar, onFechar }: Props) {
  const [valorPlanejado, setValorPlanejado] = useState(String(conta.valorPlanejado));
  const [valorReal, setValorReal] = useState(conta.valorReal !== undefined ? String(conta.valorReal) : '');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const vp = parseFloat(valorPlanejado);
    const vr = valorReal !== '' ? parseFloat(valorReal) : undefined;
    if (isNaN(vp) || vp < 0) { setErro('Valor planejado inválido'); return; }
    if (vr !== undefined && (isNaN(vr) || vr < 0)) { setErro('Valor real inválido'); return; }
    setErro('');
    setLoading(true);
    try {
      await onSalvar(conta.id, { valorPlanejado: vp, valorReal: vr });
      onFechar();
    } catch {
      setErro('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-sm border-neon-cyan/20 shadow-glow-cyan animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Editar — {conta.nome}</h2>
          <button onClick={onFechar} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Valor planejado (R$)</label>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              value={valorPlanejado}
              onChange={e => setValorPlanejado(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">
              Valor real (R$)
              <span className="ml-1 text-muted/60">opcional</span>
            </label>
            <input
              className="input"
              type="number"
              step="0.01"
              min="0"
              value={valorReal}
              onChange={e => setValorReal(e.target.value)}
              placeholder="0,00"
            />
          </div>

          {erro && <p className="text-xs text-neon-orange">{erro}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onFechar} className="btn-danger flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
