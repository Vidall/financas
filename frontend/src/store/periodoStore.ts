import { create } from 'zustand';

interface PeriodoState {
  mes: number;
  ano: number;
  setMesAno: (mes: number, ano: number) => void;
}

const hoje = new Date();

export const usePeriodoStore = create<PeriodoState>(set => ({
  mes: hoje.getMonth() + 1,
  ano: hoje.getFullYear(),
  setMesAno: (mes, ano) => set({ mes, ano }),
}));
