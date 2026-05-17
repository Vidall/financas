'use client';

import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePeriodoStore } from '../../store/periodoStore';

const MESES = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const TITULOS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/entradas':  'Entradas',
  '/contas':    'Contas Fixas',
  '/gastos':    'Gastos Variáveis',
  '/metas':     'Metas e Reservas',
};

export function Header() {
  const pathname = usePathname();
  const { mes, ano, setMesAno } = usePeriodoStore();

  function anterior() {
    if (mes === 1) setMesAno(12, ano - 1);
    else setMesAno(mes - 1, ano);
  }

  function proximo() {
    if (mes === 12) setMesAno(1, ano + 1);
    else setMesAno(mes + 1, ano);
  }

  return (
    <header className="bg-surface border-b border-border px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-sm md:text-base font-semibold text-text">
        {TITULOS[pathname] ?? 'Finanças'}
      </h1>

      {/* Seletor mês/ano */}
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={anterior}
          className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-xs md:text-sm font-medium text-neon-cyan min-w-[100px] md:min-w-[130px] text-center">
          <span className="hidden sm:inline">{MESES[mes]} </span>
          <span className="sm:hidden">{MESES[mes].slice(0, 3)} </span>
          {ano}
        </span>

        <button
          onClick={proximo}
          className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-white/5 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </header>
  );
}
