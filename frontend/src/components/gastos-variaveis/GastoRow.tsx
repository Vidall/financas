'use client';

import { TrendingUp, Trash2, Pencil } from 'lucide-react';
import type { GastoVariavelDTO } from '@financas/core';

interface Props {
  gasto: GastoVariavelDTO;
  onRemover: (id: string) => void;
  onAtualizar: (id: string) => void;
}

function BadgeStatus({ status }: { status: string }) {
  if (status === 'Concluído') return <span className="badge-green">Concluído</span>;
  return <span className="badge-yellow">Pendente</span>;
}

export function GastoRow({ gasto, onRemover, onAtualizar }: Props) {
  const g = gasto as any;
  const actions = (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onAtualizar(gasto.id)}
        className="p-1.5 text-muted hover:text-neon-cyan hover:bg-neon-cyan/10 rounded transition-colors"
        title="Atualizar gasto"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={() => onRemover(gasto.id)}
        className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
        title="Remover gasto"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );

  return (
    <>
      {/* Linha desktop */}
      <tr className="hidden md:table-row border-b border-border hover:bg-white/[0.02] transition-colors">
        <td className="px-4 py-3 text-sm text-text">{gasto.nome}</td>
        <td className="px-4 py-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <span>{gasto.categoria.icone !== undefined ? gasto.categoria.icone : ''}</span>
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
          {g.valorUtilizado !== undefined && (
            <div className="text-xs text-muted mt-0.5">
              Utilizado: R$ {g.valorUtilizado.toFixed(2)}
              {g.valorSobra !== undefined && ` · Sobra: R$ ${g.valorSobra.toFixed(2)}`}
            </div>
          )}
        </td>
        <td className={`px-4 py-3 text-xs font-medium ${gasto.diferenca < 0 ? 'text-neon-orange' : gasto.diferenca > 0 ? 'text-neon-green' : 'text-muted'}`}>
          {gasto.diferenca !== 0 ? `${gasto.diferenca > 0 ? '+' : ''}R$ ${gasto.diferenca.toFixed(2)}` : '—'}
        </td>
        <td className="px-4 py-3"><BadgeStatus status={gasto.status} /></td>
        <td className="px-4 py-3 text-sm text-muted">
          {gasto.data ? new Date(gasto.data).toLocaleDateString('pt-BR') : '—'}
        </td>
        <td className="px-4 py-3">{actions}</td>
      </tr>

      {/* Card mobile */}
      <tr className="md:hidden">
        <td colSpan={9} className="py-2 px-0">
          <div className="bg-surface border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-text">{gasto.nome}</span>
                <div className="text-xs text-muted mt-0.5">
                  {gasto.categoria.icone ? `${gasto.categoria.icone} ` : ''}{gasto.categoria.nome} · {gasto.formaPagamento}
                </div>
              </div>
              <BadgeStatus status={gasto.status} />
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <div className="text-muted">
                  Planejado: <span className="text-text">R$ {gasto.valorPlanejado.toFixed(2)}</span>
                </div>
                {gasto.valorReal !== undefined && (
                  <div className="text-muted flex items-center gap-1">
                    Real:{' '}
                    <span className={`font-medium flex items-center gap-0.5 ${gasto.excedido ? 'text-neon-orange' : 'text-text'}`}>
                      {gasto.excedido && <TrendingUp size={11} />}
                      R$ {gasto.valorReal.toFixed(2)}
                    </span>
                  </div>
                )}
                {g.valorUtilizado !== undefined && (
                  <div className="text-muted">
                    Utilizado: <span className="text-neon-cyan font-medium">R$ {g.valorUtilizado.toFixed(2)}</span>
                    {g.valorSobra !== undefined && (
                      <> · Sobra: <span className={`font-medium ${g.valorSobra < 0 ? 'text-neon-orange' : 'text-neon-green'}`}>R$ {g.valorSobra.toFixed(2)}</span></>
                    )}
                  </div>
                )}
                {gasto.diferenca !== 0 && (
                  <div className={`font-medium ${gasto.diferenca < 0 ? 'text-neon-orange' : 'text-neon-green'}`}>
                    {gasto.diferenca > 0 ? '+' : ''}R$ {gasto.diferenca.toFixed(2)}
                  </div>
                )}
                {gasto.data && (
                  <div className="text-muted">{new Date(gasto.data).toLocaleDateString('pt-BR')}</div>
                )}
              </div>
              <div className="self-end">{actions}</div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
