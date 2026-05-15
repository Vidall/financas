import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { EntradaDTO, CriarEntradaDTO } from '@financas/core';

export function useEntradas(planoMensalId: string) {
  return useQuery<EntradaDTO[]>({
    queryKey: ['entradas', planoMensalId],
    queryFn: async () => {
      const { data } = await api.get(`/entradas/${planoMensalId}`);
      return data;
    },
    enabled: !!planoMensalId,
  });
}

export function useCriarEntrada() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CriarEntradaDTO) => api.post('/entradas', dto).then(r => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['entradas', vars.planoMensalId] }),
  });
}

export function useRemoverEntrada() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/entradas/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['entradas'] }),
  });
}
