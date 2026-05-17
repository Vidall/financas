'use client';

import { useState } from 'react';
import type { GastoVariavelDTO } from '@financas/core';

interface Props {
  gasto: GastoVariavelDTO;
  onSalvar: (id: string, dto: { valorReal?: number; valorUtilizado?: number; data?: string }) => void;
  onFechar: () => void;
}

export function AtualizarGastoModal({ gasto, onSalvar, onFechar }: Props) {
  const [valorReal, setValorReal] = useState(String(gasto.valorReal ?? gasto.valorPlanejado));
  const [valorUtilizado, setValorUtilizado] = useState(String((gasto as any).valorUtilizado ?? ''));
  const [data, setData] = useState(gasto.data ? gasto.data.slice(0, 10) : '');
  const [erro, setErro] = useState('');

  function handleSalvar() {
    const vr = parseFloat(valorReal);
    const vu = valorUtilizado !== '' ? parseFloat(valorUtilizado) : undefined;

    if (isNaN(vr) || vr < 0) { setErro('Valor real inválido'); return; }
    if (vu !== undefined && (isNaN(vu) || vu < 0)) { setErro('Valor utilizado inválido'); return; }
    if (vu !== undefined && vu > vr) { setErro('Valor utilizado não pode ser maior que o valor real'); return; }

    setErro('');
    onSalvar(gasto.id, {
      valorReal: vr,
      valorUtilizado: vu,
      data: data || undefined,
    });
    onFechar();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0">
      <div className="bg-surface border border-border rounded-2xl p-5 w-full max-w-sm space-y-4">
        <h2 className="text-sm font-semibold text-text">Atualizar gasto — {gasto.nome}</h2>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted block mb-1">Valor real (R$)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={valorReal}
              onChange={e => setValorReal(e.target.value)}
              className="input w-full"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">
              Valor já utilizado (R$)
              <span className="ml-1 text-muted/60">opcional — valor pago até agora</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={valorUtilizado}
              onChange={e => setValorUtilizado(e.target.value)}
              className="input w-full"
              placeholder="0.00"
            />
            {valorUtilizado !== '' && !isNaN(parseFloat(valorUtilizado)) && (
              <p className="text-xs text-muted mt-1">
                Sobra: R$ {Math.max(0, parseFloat(valorReal || '0') - parseFloat(valorUtilizado)).toFixed(2)}
              </p>
            )}
          </div>

          <div>
            <label className="text-xs text-muted block mb-1">Data</label>
            <input
              type="date"
              value={data}
              onChange={e => setData(e.target.value)}
              className="input w-full"
            />
          </div>
        </div>

        {erro && <p className="text-xs text-neon-orange">{erro}</p>}

        <div className="flex gap-2 pt-1">
          <button onClick={onFechar} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={handleSalvar} className="btn-primary flex-1">Salvar</button>
        </div>
      </div>
    </div>
  );
}
