'use client';

import { Trash2 } from 'lucide-react';
import type { EntradaDTO } from '@financas/core';

interface Props {
  entrada: EntradaDTO;
  onRemover: (id: string) => void;
}

export function EntradaRow({ entrada, onRemover }: Props) {
  return (
    <tr className="border-b border-border hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3 text-sm text-text">{entrada.nome}</td>
      <td className="px-4 py-3 text-sm text-neon-green font-medium">
        R$ {entrada.valor.toFixed(2)}
      </td>
      <td className="px-4 py-3">
        {entrada.recebido
          ? <span className="badge-green">Recebido</span>
          : <span className="badge-yellow">Aguardando</span>}
      </td>
      <td className="px-4 py-3 text-sm text-muted">
        {entrada.data ? new Date(entrada.data).toLocaleDateString('pt-BR') : '—'}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onRemover(entrada.id)}
          className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
