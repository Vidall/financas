'use client';

import { CheckCircle2, Trash2 } from 'lucide-react';
import type { ContaFixaDTO } from '@financas/core';

interface Props {
  conta: ContaFixaDTO;
  onPagar: (id: string) => void;
  onRemover: (id: string) => void;
}

function BadgeStatus({ status }: { status: string }) {
  if (status === 'Concluído') return <span className="badge-green">Concluído</span>;
  if (status === 'Atrasado') return <span className="badge-red">Atrasado</span>;
  return <span className="badge-yellow">Pendente</span>;
}

export function ContaFixaRow({ conta, onPagar, onRemover }: Props) {
  const excedido = conta.valorReal !== undefined && conta.valorReal > conta.valorPlanejado;

  return (
    <tr className="border-b border-border hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3 text-sm text-text">{conta.nome}</td>
      <td className="px-4 py-3 text-sm text-muted">R$ {(conta.valorPlanejado ?? 0).toFixed(2)}</td>
      <td className={`px-4 py-3 text-sm font-medium ${excedido ? 'text-neon-orange' : 'text-text'}`}>
        {conta.valorReal !== undefined ? `R$ ${conta.valorReal.toFixed(2)}` : '—'}
      </td>
      <td className="px-4 py-3"><BadgeStatus status={conta.status} /></td>
      <td className="px-4 py-3 text-sm text-muted">
        {conta.dataPago ? new Date(conta.dataPago).toLocaleDateString('pt-BR') : '—'}
      </td>
      <td className="px-4 py-3 text-xs text-muted max-w-[120px] truncate">{conta.observacao ?? '—'}</td>
      <td className="px-4 py-3 flex items-center gap-1">
        {conta.status !== 'Concluído' && (
          <button
            onClick={() => onPagar(conta.id)}
            className="p-1.5 text-muted hover:text-neon-green hover:bg-neon-green/10 rounded transition-colors"
            title="Marcar como pago"
          >
            <CheckCircle2 size={14} />
          </button>
        )}
        <button
          onClick={() => onRemover(conta.id)}
          className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
          title="Remover conta"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
