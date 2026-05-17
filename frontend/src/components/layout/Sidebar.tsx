'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  ArrowDownToLine,
  Receipt,
  ShoppingCart,
  Target,
  LogOut,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Dashboard',       icon: LayoutDashboard },
  { href: '/entradas',  label: 'Entradas',         icon: ArrowDownToLine },
  { href: '/contas',    label: 'Contas Fixas',      icon: Receipt },
  { href: '/gastos',    label: 'Gastos',            icon: ShoppingCart },
  { href: '/metas',     label: 'Metas',             icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="w-56 bg-surface border-r border-border flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border">
          <span className="text-xl font-bold text-neon-cyan tracking-tight">Finanças</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  active
                    ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20'
                    : 'text-muted hover:text-text hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-red-400 hover:bg-red-500/5 w-full transition-all duration-150"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border flex items-center justify-around px-2 py-1 safe-area-inset-bottom">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg transition-all duration-150 min-w-0 flex-1 ${
                active ? 'text-neon-cyan' : 'text-muted'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] leading-tight truncate">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => logout()}
          className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg text-muted hover:text-red-400 transition-all duration-150 flex-1"
        >
          <LogOut size={20} />
          <span className="text-[10px] leading-tight">Sair</span>
        </button>
      </nav>
    </>
  );
}
