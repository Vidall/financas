import { useRouter } from 'next/navigation';
import { api } from '../services/api';

export function useAuth() {
  const router = useRouter();

  async function login(email: string, senha: string): Promise<void> {
    const { data } = await api.post('/auth/login', { email, senha });
    localStorage.setItem('access_token', data.accessToken);
    router.push('/');
  }

  async function register(nome: string, email: string, senha: string): Promise<void> {
    const { data } = await api.post('/auth/register', { nome, email, senha });
    localStorage.setItem('access_token', data.accessToken);
    router.push('/');
  }

  async function logout(): Promise<void> {
    await api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('access_token');
    router.push('/login');
  }

  function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
  }

  return { login, register, logout, isAuthenticated };
}
