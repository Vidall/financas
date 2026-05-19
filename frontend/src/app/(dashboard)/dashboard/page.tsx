'use client';

import { useState } from 'react';
import { usePeriodoStore } from '../../../store/periodoStore';
import { useDashboard, useMeses } from '../../../hooks/usePlanoMensal';
import { useEntradas } from '../../../hooks/useEntradas';
import { useContasFixas } from '../../../hooks/useContasFixas';
import { useGastosVariaveis } from '../../../hooks/useGastosVariaveis';
import { useMetas } from '../../../hooks/useMetas';
import { Target, Wallet } from 'lucide-react';

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className={`card ${color ?? ''}`}>
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-xl font-bold text-text">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

function SecaoDetalhes({ titulo, count, children }: { titulo: string; count: number; children: React.ReactNode }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="card">
      <button
        onClick={() => setAberto(v => !v)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-sm font-semibold text-text">{titulo}</h2>
        <span className="text-xs text-muted">{count} itens {aberto ? '▲' : '▼'}</span>
      </button>
      {aberto && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const { mes, ano } = usePeriodoStore();
  const { data: meses } = useMeses();
  const { data, isLoading, error } = useDashboard(mes, ano);

  const plano = meses?.find(p => p.mes === mes && p.ano === ano);
  const planoId = plano?.id ?? '';
  const { data: entradas = [] } = useEntradas(planoId);
  const { data: contas = [] } = useContasFixas(planoId);
  const { data: gastos = [] } = useGastosVariaveis(planoId);
  const { data: metasLista = [] } = useMetas(planoId);

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
          sub={`Inclui contas, gastos e metas · Plan: R$ ${data.planejamento.saidas.toFixed(2)}`}
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

      {/* A Receber / A Pagar */}
      {(data.aReceber > 0 || data.aPagar > 0) && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="A receber"
            value={`R$ ${data.aReceber.toFixed(2)}`}
            sub="Entradas aguardando"
            color="border-yellow-400/20"
          />
          <StatCard
            label="A pagar"
            value={`R$ ${data.aPagar.toFixed(2)}`}
            sub="Contas + gastos + metas pendentes"
            color="border-neon-orange/20"
          />
        </div>
      )}

      {/* Resumo Planejado × Real */}
      <div className="card">
        <h2 className="text-sm font-semibold text-text mb-3">Planejado × Real</h2>
        <div className="grid grid-cols-3 text-[10px] text-muted mb-1 px-1">
          <span></span>
          <span className="text-right">Planejado</span>
          <span className="text-right">Real</span>
        </div>
        {[
          { label: 'Entradas', plano: data.planejamento.entradas, real: data.real.entradas, cor: 'text-neon-green' },
          { label: 'Contas fixas', plano: (data.planejamento as any).saidasContas ?? 0, real: (data.real as any).saidasContas ?? 0, cor: 'text-neon-cyan' },
          { label: 'Gastos', plano: (data.planejamento as any).saidasGastos ?? 0, real: (data.real as any).saidasGastos ?? 0, cor: 'text-neon-orange' },
          { label: 'Sobra', plano: data.planejamento.sobra, real: data.real.sobra, cor: data.real.sobra < 0 ? 'text-neon-orange' : 'text-neon-green' },
        ].map(({ label, plano, real, cor }) => (
          <div key={label} className="grid grid-cols-3 text-xs gap-2 py-2 border-t border-border">
            <span className="text-muted">{label}</span>
            <span className="text-right text-text">R$ {plano.toFixed(2)}</span>
            <span className={`text-right font-medium ${cor}`}>R$ {real.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Saídas detalhadas */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Contas Fixas (real)"
          value={`R$ ${(data.real as any).saidasContas?.toFixed(2) ?? '0.00'}`}
          sub={`Planejado: R$ ${(data.planejamento as any).saidasContas?.toFixed(2) ?? '0.00'}`}
          color="border-neon-cyan/20"
        />
        <StatCard
          label="Gastos (real)"
          value={`R$ ${(data.real as any).saidasGastos?.toFixed(2) ?? '0.00'}`}
          sub={`Planejado: R$ ${(data.planejamento as any).saidasGastos?.toFixed(2) ?? '0.00'}`}
          color="border-neon-orange/20"
        />
      </div>

      {/* Carteira */}
      {(data as any).carteira && (
        <div className="card border-neon-purple/20">
          <div className="flex items-center gap-2 mb-3">
            <Wallet size={14} className="text-neon-purple" />
            <h2 className="text-sm font-semibold text-text">Carteira</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <p className="text-muted">Valor real</p>
              <p className="text-text font-medium mt-0.5">R$ {(data as any).carteira.valorReal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted">Deveria ter</p>
              <p className="text-text font-medium mt-0.5">R$ {(data as any).carteira.valorDeveria.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-muted">Diferença</p>
              <p className={`font-medium mt-0.5 ${(data as any).carteira.diferenca >= 0 ? 'text-neon-green' : 'text-neon-orange'}`}>
                {(data as any).carteira.diferenca >= 0 ? '+' : ''}R$ {(data as any).carteira.diferenca.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-neon-purple" />
            <h2 className="text-sm font-semibold text-text">Metas e Reservas</h2>
          </div>
          <p className="text-xs text-muted mb-3">
            {data.totalMetasAtingidas} de {data.totalMetas} metas atingidas este mês
          </p>

          {metasLista.length > 0 && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted">Total acumulado</p>
                <p className="text-neon-purple font-medium mt-0.5">
                  R$ {metasLista.reduce((s, m) => s + (m.totalGuardado ?? 0), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-muted">Guardado neste mês</p>
                <p className="text-neon-cyan font-medium mt-0.5">
                  R$ {metasLista.reduce((s, m) => s + (m.valorRealMes ?? 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Entradas detalhadas */}
      {entradas.length > 0 && (
        <SecaoDetalhes titulo="Entradas do mês" count={entradas.length}>
          {entradas.map(e => (
            <div key={e.id} className="flex items-center justify-between text-xs py-1.5 border-t border-border">
              <div>
                <span className="text-text">{e.nome}</span>
                {e.recebido && <span className="ml-2 text-[10px] text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded-full">Recebido</span>}
                {!e.recebido && <span className="ml-2 text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded-full">Pendente</span>}
              </div>
              <span className={e.recebido ? 'text-neon-green font-medium' : 'text-muted'}>
                R$ {e.valor.toFixed(2)}
              </span>
            </div>
          ))}
        </SecaoDetalhes>
      )}

      {/* Contas Fixas detalhadas */}
      {contas.length > 0 && (
        <SecaoDetalhes titulo="Contas Fixas do mês" count={contas.length}>
          {contas.map(c => (
            <div key={c.id} className="flex items-center justify-between text-xs py-1.5 border-t border-border">
              <div className="flex-1 min-w-0">
                <span className="text-text truncate block">{c.nome}</span>
                {c.valorReal !== undefined && (
                  <span className="text-muted">Real: <span className={c.valorReal > c.valorPlanejado ? 'text-neon-orange' : 'text-neon-cyan'}>R$ {c.valorReal.toFixed(2)}</span></span>
                )}
              </div>
              <div className="text-right ml-2 shrink-0">
                <div className="text-muted">R$ {c.valorPlanejado.toFixed(2)}</div>
                <div className={`text-[10px] ${c.status === 'Concluído' ? 'text-neon-green' : c.status === 'Atrasado' ? 'text-neon-orange' : 'text-yellow-400'}`}>
                  {c.status}
                </div>
              </div>
            </div>
          ))}
        </SecaoDetalhes>
      )}

      {/* Gastos detalhados */}
      {gastos.length > 0 && (
        <SecaoDetalhes titulo="Gastos do mês" count={gastos.length}>
          {gastos.map(g => (
            <div key={g.id} className="flex items-center justify-between text-xs py-1.5 border-t border-border">
              <div className="flex-1 min-w-0">
                <span className="text-text truncate block">{g.nome}</span>
                <span className="text-muted">{g.categoria.icone} {g.categoria.nome} · {g.formaPagamento}</span>
                {g.valorUtilizado !== undefined && (
                  <div className="text-muted">Utilizado: <span className="text-neon-cyan">R$ {g.valorUtilizado.toFixed(2)}</span></div>
                )}
              </div>
              <div className="text-right ml-2 shrink-0">
                <div className="text-muted">Plan: R$ {g.valorPlanejado.toFixed(2)}</div>
                {g.valorReal !== undefined && (
                  <div className={g.excedido ? 'text-neon-orange' : 'text-text'}>Real: R$ {g.valorReal.toFixed(2)}</div>
                )}
                <div className={`text-[10px] ${g.status === 'Concluído' ? 'text-neon-green' : 'text-yellow-400'}`}>{g.status}</div>
              </div>
            </div>
          ))}
        </SecaoDetalhes>
      )}

      {/* Metas / Reservas detalhadas */}
      {metasLista.length > 0 && (
        <SecaoDetalhes titulo="Metas e Reservas do mês" count={metasLista.length}>
          {metasLista.map(m => {
            const pctMeta = Math.min(m.percentualAtingido, 100);
            return (
              <div key={m.id} className="py-1.5 border-t border-border">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text">{m.nome}</span>
                  <span className="text-muted">{pctMeta.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Plan mês: <span className="text-text">R$ {m.valorMensal.toFixed(2)}</span></span>
                  {m.valorRealMes !== undefined
                    ? <span>Real mês: <span className={m.valorRealMes >= m.valorMensal ? 'text-neon-green' : 'text-neon-orange'}>R$ {m.valorRealMes.toFixed(2)}</span></span>
                    : <span className="text-muted/50">Real mês: —</span>
                  }
                </div>
                <div className="w-full bg-border rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-500 ${m.tipo === 'Reserva' ? 'bg-neon-cyan' : 'bg-neon-purple'}`}
                    style={{ width: `${pctMeta}%` }}
                  />
                </div>
              </div>
            );
          })}
        </SecaoDetalhes>
      )}

    </div>
  );
}
