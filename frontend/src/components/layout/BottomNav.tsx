'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';
import { NAV } from './Sidebar';

export function BottomNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border flex items-center justify-around px-1 safe-area-inset-bottom">
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg transition-all duration-150 flex-1 min-w-0 ${
              active ? 'text-neon-cyan' : 'text-muted'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] leading-tight truncate w-full text-center">{label}</span>
          </Link>
        );
      })}
      <button
        onClick={() => logout()}
        className="flex flex-col items-center gap-0.5 px-1 py-2 rounded-lg text-muted hover:text-red-400 transition-all duration-150 flex-1"
      >
        <LogOut size={20} />
        <span className="text-[10px] leading-tight">Sair</span>
      </button>
    </nav>
  );
}
