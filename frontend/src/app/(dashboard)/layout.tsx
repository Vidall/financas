'use client';

import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { AuthGuard } from '../../components/ui/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar — oculta em mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
