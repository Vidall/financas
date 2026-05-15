import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { ResumoDashboardDTO } from '@financas/core';

export function useDashboard(mes: number, ano: number) {
  return useQuery<ResumoDashboardDTO>({
    queryKey: ['dashboard', mes, ano],
    queryFn: async () => {
      const { data } = await api.get(`/plano/${mes}/${ano}`);
      return data;
    },
    enabled: mes > 0 && ano > 0,
  });
}

export function useMeses() {
  return useQuery<Array<{ id: string; mes: number; ano: number; descricao: string }>>({
    queryKey: ['meses'],
    queryFn: async () => {
      const { data } = await api.get('/plano/meses');
      return data;
    },
  });
}

export function useCriarPlano() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { mes: number; ano: number; salarioReferencia: number }) =>
      api.post('/plano', payload).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['meses'] }),
  });
}
