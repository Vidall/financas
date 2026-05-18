import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { MetaDTO, CriarMetaDTO } from '@financas/core';

export function useMetas(planoMensalId: string) {
  return useQuery<MetaDTO[]>({
    queryKey: ['metas', planoMensalId],
    queryFn: async () => {
      const { data } = await api.get(`/metas/${planoMensalId}`);
      return data;
    },
    enabled: !!planoMensalId,
  });
}

export function useCriarMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CriarMetaDTO) => api.post('/metas', dto).then(r => r.data),
    onSuccess: (_data, vars) => qc.invalidateQueries({ queryKey: ['metas', vars.planoMensalId] }),
  });
}

export function useAtualizarMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, novoTotalGuardado, valorRealMes }: { id: string; novoTotalGuardado: number; valorRealMes?: number }) =>
      api.patch(`/metas/${id}/atualizar`, { novoTotalGuardado, valorRealMes }).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['metas'] }),
  });
}

export function useRemoverMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/metas/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['metas'] }),
  });
}
