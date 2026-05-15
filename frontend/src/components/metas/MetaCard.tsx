"use client";

import { TrendingUp } from "lucide-react";
import type { MetaDTO } from "@financas/core";

interface Props {
  meta: MetaDTO;
  onAtualizar: (id: string) => void;
}

export function MetaCard({ meta, onAtualizar }: Props) {
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

        <button
          onClick={() => onAtualizar(meta.id)}
          className="btn-primary text-xs py-1 px-2.5"
        >
          Atualizar
        </button>
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

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-xs text-muted">Mensal</p>

          <p className="text-sm font-medium text-text">
            R$ {Number(meta.valorMensal ?? 0).toFixed(2)}
          </p>
        </div>

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
