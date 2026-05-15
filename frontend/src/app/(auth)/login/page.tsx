'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await login(email, senha);
    } catch (err: any) {
      setErro(err?.response?.data?.message ?? 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neon-cyan tracking-tight">Finanças</h1>
          <p className="text-muted text-sm mt-1">Controle financeiro pessoal</p>
        </div>

        <div className="card border-neon-cyan/20 shadow-glow-cyan">
          <h2 className="text-lg font-semibold text-text mb-6">Acessar conta</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-muted mb-1.5">E-mail</label>
              <input
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs text-muted mb-1.5">Senha</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-2.5"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : null}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-muted mt-5">
            Não tem conta?{' '}
            <Link href="/register" className="text-neon-cyan hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
