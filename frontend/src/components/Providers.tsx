'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import ToastContainer from './ToastContainer';
import QuickViewModal from './QuickViewModal';
import FloatingContact from './FloatingContact';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer />
      <QuickViewModal />
      <FloatingContact />
    </QueryClientProvider>
  );
}
