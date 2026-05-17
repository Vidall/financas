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

  const pagarBtn = conta.status !== 'Concluído' && (
    <button
      onClick={() => onPagar(conta.id)}
      className="p-1.5 text-muted hover:text-neon-green hover:bg-neon-green/10 rounded transition-colors"
      title="Marcar como pago"
    >
      <CheckCircle2 size={14} />
    </button>
  );

  const removeBtn = (
    <button
      onClick={() => onRemover(conta.id)}
      className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
      title="Remover conta"
    >
      <Trash2 size={14} />
    </button>
  );

  return (
    <>
      {/* Linha desktop */}
      <tr className="hidden md:table-row border-b border-border hover:bg-white/[0.02] transition-colors">
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
          {pagarBtn}
          {removeBtn}
        </td>
      </tr>

      {/* Card mobile */}
      <tr className="md:hidden">
        <td colSpan={7} className="py-2 px-0">
          <div className="bg-surface border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">{conta.nome}</span>
              <BadgeStatus status={conta.status} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-muted">
                  Planejado: <span className="text-text">R$ {(conta.valorPlanejado ?? 0).toFixed(2)}</span>
                </div>
                {conta.valorReal !== undefined && (
                  <div className="text-muted">
                    Pago: <span className={excedido ? 'text-neon-orange font-medium' : 'text-text'}>
                      R$ {conta.valorReal.toFixed(2)}
                    </span>
                  </div>
                )}
                {conta.dataPago && (
                  <div className="text-muted">{new Date(conta.dataPago).toLocaleDateString('pt-BR')}</div>
                )}
                {conta.observacao && (
                  <div className="text-muted truncate max-w-[200px]">{conta.observacao}</div>
                )}
              </div>
              <div className="flex items-center gap-1 self-end">
                {pagarBtn}
                {removeBtn}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
