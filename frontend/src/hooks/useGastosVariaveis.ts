import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { GastoVariavelDTO, CriarGastoVariavelDTO } from '@financas/core';

export function useGastosVariaveis(planoMensalId: string) {
  return useQuery<GastoVariavelDTO[]>({
    queryKey: ['gastos-variaveis', planoMensalId],
    queryFn: async () => {
      const { data } = await api.get(`/gastos-variaveis/${planoMensalId}`);
      return data;
    },
    enabled: !!planoMensalId,
  });
}

export function useCriarGasto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CriarGastoVariavelDTO) =>
      api.post('/gastos-variaveis', dto).then(r => r.data),
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ['gastos-variaveis', vars.planoMensalId] }),
  });
}

export function useAtualizarGasto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, valorReal, data }: { id: string; valorReal: number; data: string }) =>
      api.patch(`/gastos-variaveis/${id}`, { valorReal, data }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gastos-variaveis'] }),
  });
}

export function useRemoverGasto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/gastos-variaveis/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gastos-variaveis'] }),
  });
}
