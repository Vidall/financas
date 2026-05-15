'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/login');
    } else {
      setVerificado(true);
    }
  }, [router]);

  if (!verificado) return null;

  return <>{children}</>;
}
