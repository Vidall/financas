'use client';

import { TrendingUp } from 'lucide-react';
import type { GastoVariavelDTO } from '@financas/core';

interface Props { gasto: GastoVariavelDTO; }

function BadgeStatus({ status }: { status: string }) {
  if (status === 'Concluído') return <span className="badge-green">Concluído</span>;
  return <span className="badge-yellow">Pendente</span>;
}

export function GastoRow({ gasto }: Props) {
  return (
    <tr className="border-b border-border hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3 text-sm text-text">{gasto.nome}</td>
      <td className="px-4 py-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <span>{gasto.categoria.icone}</span>
          {gasto.categoria.nome}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-muted">{gasto.formaPagamento}</td>
      <td className="px-4 py-3 text-sm text-muted">R$ {gasto.valorPlanejado.toFixed(2)}</td>
      <td className={`px-4 py-3 text-sm font-medium ${gasto.excedido ? 'text-neon-orange' : 'text-text'}`}>
        <span className="flex items-center gap-1">
          {gasto.excedido && <TrendingUp size={13} />}
          {gasto.valorReal !== undefined ? `R$ ${gasto.valorReal.toFixed(2)}` : '—'}
        </span>
      </td>
      <td className={`px-4 py-3 text-xs font-medium ${gasto.diferenca < 0 ? 'text-neon-orange' : gasto.diferenca > 0 ? 'text-neon-green' : 'text-muted'}`}>
        {gasto.diferenca !== 0 ? `${gasto.diferenca > 0 ? '+' : ''}R$ ${gasto.diferenca.toFixed(2)}` : '—'}
      </td>
      <td className="px-4 py-3"><BadgeStatus status={gasto.status} /></td>
      <td className="px-4 py-3 text-sm text-muted">
        {gasto.data ? new Date(gasto.data).toLocaleDateString('pt-BR') : '—'}
      </td>
    </tr>
  );
}
