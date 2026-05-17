'use client';

import { usePeriodoStore } from '../../../store/periodoStore';
import { useDashboard, useMeses } from '../../../hooks/usePlanoMensal';
import { Target } from 'lucide-react';

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className={`card ${color ?? ''}`}>
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-xl font-bold text-text">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { mes, ano } = usePeriodoStore();
  const { data: meses } = useMeses();
  const { data, isLoading, error } = useDashboard(mes, ano);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-muted text-sm">Carregando...</div>;
  }

  if (error || !data) {
    return (
      <div className="card border-neon-cyan/20 text-center py-12">
        <p className="text-muted text-sm mb-2">Nenhum plano cadastrado para este mês.</p>
        <p className="text-xs text-muted">Acesse Entradas, Contas ou Metas para criar dados e volte aqui.</p>
      </div>
    );
  }

  const pct = Math.min(data.comprometimento.percentualComprometido, 100);
  const corBarra = pct >= 90 ? 'bg-neon-orange' : pct >= 70 ? 'bg-yellow-400' : 'bg-neon-green';
  const corTexto = pct >= 90 ? 'text-neon-orange' : pct >= 70 ? 'text-yellow-400' : 'text-neon-green';

  return (
    <div className="space-y-5">

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Entradas (real)"
          value={`R$ ${data.real.entradas.toFixed(2)}`}
          sub={`Planejado: R$ ${data.planejamento.entradas.toFixed(2)}`}
          color="border-neon-green/20"
        />
        <StatCard
          label="Saídas (real)"
          value={`R$ ${data.real.saidas.toFixed(2)}`}
          sub={`Planejado: R$ ${data.planejamento.saidas.toFixed(2)}`}
          color="border-neon-cyan/20"
        />
        <StatCard
          label="Sobra do mês"
          value={`R$ ${data.real.sobra.toFixed(2)}`}
          sub={`Planejado: R$ ${data.planejamento.sobra.toFixed(2)}`}
          color={data.real.sobra < 0 ? 'border-red-500/20' : 'border-neon-green/20'}
        />
        <StatCard
          label="Saldo na carteira"
          value={`R$ ${data.saldoCarteira.toFixed(2)}`}
          color="border-neon-purple/20"
        />
      </div>

      {/* Comprometimento do salário */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text">Comprometimento do salário</h2>
          <span className={`text-sm font-bold ${corTexto}`}>
            {data.comprometimento.percentualComprometido.toFixed(1)}%
          </span>
        </div>

        <div className="w-full bg-border rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${corBarra}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-xs mb-5">
          <div>
            <p className="text-muted">Salário ref.</p>
            <p className="text-text font-medium mt-0.5">R$ {data.comprometimento.salarioReferencia.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted">Custo total</p>
            <p className="text-text font-medium mt-0.5">R$ {data.comprometimento.custoFixoTotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted">Sobra real</p>
            <p className="text-neon-green font-medium mt-0.5">R$ {data.comprometimento.sobraReal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted">% livre</p>
            <p className="text-neon-green font-medium mt-0.5">{data.comprometimento.percentualLivre.toFixed(1)}%</p>
          </div>
        </div>

        {/* Detalhamento por item */}
        <div className="space-y-2.5">
          {data.comprometimento.detalhamento.map((item, i) => (
            <div key={i} className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-muted truncate max-w-[60%]">{item.item}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-muted">{item.percentual}%</span>
                  <span className="text-text">R$ {item.valor.toFixed(2)}</span>
                </div>
              </div>
              <div className="w-full bg-border rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-neon-cyan transition-all duration-500"
                  style={{ width: `${Math.min(item.percentual, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metas resumo */}
      {data.totalMetas > 0 && (
        <div className="card border-neon-purple/20">
          <div className="flex items-center gap-2 mb-1">
            <Target size={14} className="text-neon-purple" />
            <h2 className="text-sm font-semibold text-text">Metas e Reservas</h2>
          </div>
          <p className="text-xs text-muted">
            {data.totalMetasAtingidas} de {data.totalMetas} metas atingidas este mês
          </p>
        </div>
      )}

    </div>
  );
}
