"use client";

import { TrendingUp, Trash2 } from "lucide-react";
import type { MetaDTO } from "@financas/core";

interface Props {
  meta: MetaDTO;
  onAtualizar: (id: string) => void;
  onRemover: (id: string) => void;
}

export function MetaCard({ meta, onAtualizar, onRemover }: Props) {
  const pct = Math.min(meta.percentualAtingido, 100);

  const corClass = meta.tipo === "Reserva" ? "bg-neon-cyan" : "bg-neon-purple";

  const borderClass =
    meta.tipo === "Reserva" ? "border-neon-cyan/20" : "border-neon-purple/20";

  return (
    <div className={`card ${borderClass}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border mb-2 inline-block ${
              meta.tipo === "Reserva"
                ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20"
                : "bg-neon-purple/10 text-neon-purple border-neon-purple/20"
            }`}
          >
            {meta.tipo}
          </span>

          <h3 className="text-sm font-semibold text-text">{meta.nome}</h3>

          {meta.onde && (
            <p className="text-xs text-muted mt-0.5">📍 {meta.onde}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAtualizar(meta.id)}
            className="btn-primary text-xs py-1 px-2.5"
          >
            Atualizar
          </button>
          <button
            onClick={() => onRemover(meta.id)}
            className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            title="Remover meta"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted mb-1.5">
          <span>
            <span>R$ {Number(meta.totalGuardado ?? 0).toFixed(2)}</span>
          </span>

          <span>{pct.toFixed(1)}%</span>

          <span>R$ {Number(meta.metaTotal ?? 0).toFixed(2)}</span>
        </div>

        <div className="w-full bg-border rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${corClass}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center mb-2">
        <div>
          <p className="text-xs text-muted">Planejado mês</p>
          <p className="text-sm font-medium text-text">R$ {Number(meta.valorMensal ?? 0).toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Real mês</p>
          <p className={`text-sm font-medium ${meta.valorRealMes !== undefined ? (meta.valorRealMes >= meta.valorMensal ? 'text-neon-green' : 'text-neon-orange') : 'text-muted'}`}>
            {meta.valorRealMes !== undefined ? `R$ ${Number(meta.valorRealMes).toFixed(2)}` : '—'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div>
          <p className="text-xs text-muted">Faltam</p>
          <p className="text-sm font-medium text-text">
            R$ {Math.max(0, meta.valorRestante ?? 0).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted">Meses est.</p>
          <p className="text-sm font-medium text-text">
            {meta.mesesEstimados ?? "—"}
          </p>
        </div>
      </div>

      {meta.atingida && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-neon-green">
          <TrendingUp size={12} />
          Meta atingida!
        </div>
      )}
    </div>
  );
}
