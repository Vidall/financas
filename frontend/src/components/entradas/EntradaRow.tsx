'use client';

import { Trash2, CheckCircle2, Clock } from 'lucide-react';
import type { EntradaDTO } from '@financas/core';

interface Props {
  entrada: EntradaDTO;
  onRemover: (id: string) => void;
  onToggleRecebido: (id: string, recebido: boolean) => void;
}

export function EntradaRow({ entrada, onRemover, onToggleRecebido }: Props) {
  const badge = entrada.recebido
    ? <span className="badge-green">Recebido</span>
    : <span className="badge-yellow">Aguardando</span>;

  const toggleBtn = (
    <button
      onClick={() => onToggleRecebido(entrada.id, !entrada.recebido)}
      className={`p-1.5 rounded transition-colors ${entrada.recebido ? 'text-neon-green hover:text-muted hover:bg-white/5' : 'text-muted hover:text-neon-green hover:bg-neon-green/10'}`}
      title={entrada.recebido ? 'Marcar como aguardando' : 'Marcar como recebido'}
    >
      {entrada.recebido ? <CheckCircle2 size={14} /> : <Clock size={14} />}
    </button>
  );

  const removeBtn = (
    <button
      onClick={() => onRemover(entrada.id)}
      className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
      title="Remover entrada"
    >
      <Trash2 size={14} />
    </button>
  );

  return (
    <>
      {/* Linha desktop */}
      <tr className="hidden md:table-row border-b border-border hover:bg-white/[0.02] transition-colors">
        <td className="px-4 py-3 text-sm text-text">{entrada.nome}</td>
        <td className="px-4 py-3 text-sm text-neon-green font-medium">
          R$ {(entrada.valor ?? 0).toFixed(2)}
        </td>
        <td className="px-4 py-3">{badge}</td>
        <td className="px-4 py-3 text-sm text-muted">
          {entrada.data ? new Date(entrada.data).toLocaleDateString('pt-BR') : '—'}
        </td>
        <td className="px-4 py-3 flex items-center gap-1">
          {toggleBtn}
          {removeBtn}
        </td>
      </tr>

      {/* Card mobile */}
      <tr className="md:hidden">
        <td colSpan={5} className="py-2 px-0">
          <div className="bg-surface border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">{entrada.nome}</span>
              <span className="text-sm font-bold text-neon-green">R$ {(entrada.valor ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {badge}
                {entrada.data && (
                  <span className="text-xs text-muted">
                    {new Date(entrada.data).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {toggleBtn}
                {removeBtn}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
