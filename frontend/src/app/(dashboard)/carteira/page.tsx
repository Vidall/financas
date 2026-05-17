'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Wallet } from 'lucide-react';
import { useCarteiras, useCriarCarteira, useAtualizarCarteira, useRemoverCarteira, type CarteiraDTO } from '../../../hooks/useCarteiras';

export default function CarteiraPage() {
  const { data: carteiras = [], isLoading } = useCarteiras();
  const criarCarteira = useCriarCarteira();
  const atualizarCarteira = useAtualizarCarteira();
  const removerCarteira = useRemoverCarteira();

  const [novaModal, setNovaModal] = useState(false);
  const [editando, setEditando] = useState<CarteiraDTO | null>(null);
  const [banco, setBanco] = useState('');
  const [saldo, setSaldo] = useState('');
  const [saldoEdit, setSaldoEdit] = useState('');

  const totalSaldo = carteiras.reduce((s, c) => s + c.saldo, 0);

  async function handleCriar() {
    if (!banco.trim() || isNaN(parseFloat(saldo))) return;
    await criarCarteira.mutateAsync({ banco: banco.trim(), saldo: parseFloat(saldo) });
    setBanco('');
    setSaldo('');
    setNovaModal(false);
  }

  async function handleAtualizar() {
    if (!editando || isNaN(parseFloat(saldoEdit))) return;
    await atualizarCarteira.mutateAsync({ id: editando.id, saldo: parseFloat(saldoEdit) });
    setEditando(null);
    setSaldoEdit('');
  }

  function abrirEdicao(c: CarteiraDTO) {
    setEditando(c);
    setSaldoEdit(String(c.saldo));
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="card border-neon-purple/20">
          <p className="text-xs text-muted mb-1">Total em carteiras</p>
          <p className="text-xl font-bold text-neon-purple">R$ {totalSaldo.toFixed(2)}</p>
        </div>
        <div className="card">
          <p className="text-xs text-muted mb-1">Carteiras cadastradas</p>
          <p className="text-xl font-bold text-text">{carteiras.length}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet size={15} className="text-neon-purple" />
            <h2 className="text-sm font-semibold text-text">Minhas Carteiras</h2>
          </div>
          <button onClick={() => setNovaModal(true)} className="btn-primary flex items-center gap-1.5 text-xs py-1.5">
            <Plus size={14} /> Nova carteira
          </button>
        </div>

        {isLoading ? (
          <p className="text-muted text-sm text-center py-8">Carregando...</p>
        ) : carteiras.length === 0 ? (
          <p className="text-muted text-sm text-center py-8">Nenhuma carteira cadastrada</p>
        ) : (
          <div className="space-y-2">
            {carteiras.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-border">
                <div>
                  <p className="text-sm font-medium text-text">{c.banco}</p>
                  <p className="text-xs text-muted mt-0.5">Saldo: <span className="text-neon-green font-medium">R$ {c.saldo.toFixed(2)}</span></p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => abrirEdicao(c)}
                    className="p-1.5 text-muted hover:text-neon-cyan hover:bg-neon-cyan/10 rounded transition-colors"
                    title="Editar saldo"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => removerCarteira.mutateAsync(c.id)}
                    className="p-1.5 text-muted hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Remover"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Nova Carteira */}
      {novaModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0">
          <div className="bg-surface border border-border rounded-2xl p-5 w-full max-w-sm space-y-4">
            <h2 className="text-sm font-semibold text-text">Nova carteira</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted block mb-1">Nome / local</label>
                <input
                  type="text"
                  value={banco}
                  onChange={e => setBanco(e.target.value)}
                  className="input w-full"
                  placeholder="Ex: Mercado Pago, Santander..."
                />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Saldo atual (R$)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={saldo}
                  onChange={e => setSaldo(e.target.value)}
                  className="input w-full"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setNovaModal(false)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleCriar} className="btn-primary flex-1">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Saldo */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 px-4 pb-4 sm:pb-0">
          <div className="bg-surface border border-border rounded-2xl p-5 w-full max-w-sm space-y-4">
            <h2 className="text-sm font-semibold text-text">Atualizar saldo — {editando.banco}</h2>
            <div>
              <label className="text-xs text-muted block mb-1">Novo saldo (R$)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={saldoEdit}
                onChange={e => setSaldoEdit(e.target.value)}
                className="input w-full"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setEditando(null)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={handleAtualizar} className="btn-primary flex-1">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
