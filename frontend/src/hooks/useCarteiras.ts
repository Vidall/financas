import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface CarteiraDTO {
  id: string;
  banco: string;
  saldo: number;
}

export function useCarteiras() {
  return useQuery<CarteiraDTO[]>({
    queryKey: ['carteiras'],
    queryFn: async () => {
      const { data } = await api.get('/carteiras');
      return data;
    },
  });
}

export function useCriarCarteira() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: { banco: string; saldo: number }) =>
      api.post('/carteiras', dto).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['carteiras'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useAtualizarCarteira() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, saldo }: { id: string; saldo: number }) =>
      api.patch(`/carteiras/${id}`, { saldo }).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['carteiras'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useRemoverCarteira() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/carteiras/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['carteiras'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
