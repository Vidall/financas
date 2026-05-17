import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { ContaFixaDTO, CriarContaFixaDTO, PagarContaDTO } from '@financas/core';

export function useContasFixas(planoMensalId: string) {
  return useQuery<ContaFixaDTO[]>({
    queryKey: ['contas-fixas', planoMensalId],
    queryFn: async () => {
      const { data } = await api.get(`/contas-fixas/${planoMensalId}`);
      return data;
    },
    enabled: !!planoMensalId,
  });
}

export function useCriarContaFixa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CriarContaFixaDTO) => api.post('/contas-fixas', dto).then(r => r.data),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ['contas-fixas', vars.planoMensalId] }),
  });
}

export function usePagarConta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: PagarContaDTO }) =>
      api.patch(`/contas-fixas/${id}/pagar`, dto).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-fixas'] }),
  });
}

export function useRemoverContaFixa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/contas-fixas/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contas-fixas'] }),
  });
}
