'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { CriarGastoVariavelDTO } from '@financas/core';

const CATEGORIAS = [
  { nome: 'Gasolina', icone: '⛽' },
  { nome: 'Plano Telefônico', icone: '📱' },
  { nome: 'Saúde e Bem-estar', icone: '🏃' },
  { nome: 'Lazer', icone: '🎉' },
  { nome: 'Restaurante', icone: '🍽️' },
  { nome: 'Casa', icone: '🏠' },
  { nome: 'Outros', icone: '💰' },
];

const FORMAS = ['Débito', 'Crédito', 'Pix', 'Dinheiro'];

interface Props {
  planoMensalId: string;
  onSalvar: (dto: CriarGastoVariavelDTO) => Promise<void>;
  onFechar: () => void;
}

export function NovoGastoModal({ planoMensalId, onSalvar, onFechar }: Props) {
  const [nome, setNome] = useState('');
  const [categoriaNome, setCategoriaNome] = useState('Outros');
  const [categoriaIcone, setCategoriaIcone] = useState('💰');
  const [formaPagamento, setFormaPagamento] = useState('Débito');
  const [valorPlanejado, setValorPlanejado] = useState('');
  const [valorReal, setValorReal] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  function handleCategoria(nome: string) {
    setCategoriaNome(nome);
    setCategoriaIcone(CATEGORIAS.find(c => c.nome === nome)?.icone ?? '💰');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSalvar({
        planoMensalId, nome, categoriaNome, categoriaIcone, formaPagamento,
        valorPlanejado: Number(valorPlanejado),
        valorReal: valorReal ? Number(valorReal) : undefined,
        data: data || undefined,
      });
      onFechar();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md border-neon-cyan/20 shadow-glow-cyan animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Novo Gasto Variável</h2>
          <button onClick={onFechar} className="text-muted hover:text-text transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted mb-1.5">Nome</label>
            <input className="input" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Gasolina" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Categoria</label>
              <select className="input" value={categoriaNome} onChange={e => handleCategoria(e.target.value)}>
                {CATEGORIAS.map(c => <option key={c.nome} value={c.nome}>{c.icone} {c.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Forma de pagamento</label>
              <select className="input" value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
                {FORMAS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1.5">Valor planejado (R$)</label>
              <input className="input" type="number" step="0.01" min="0" value={valorPlanejado}
                onChange={e => setValorPlanejado(e.target.value)} required placeholder="0,00" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1.5">Valor real (R$)</label>
              <input className="input" type="number" step="0.01" min="0" value={valorReal}
                onChange={e => setValorReal(e.target.value)} placeholder="0,00" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1.5">Data</label>
            <input className="input" type="date" value={data} onChange={e => setData(e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onFechar} className="btn-danger flex-1">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
