'use client';

import { LucideIcon, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '../constants';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText?: string;
  linkUrl?: string;
  icon?: LucideIcon;
}

export default function EmptyState({
  title,
  message,
  buttonText = 'Tiếp tục mua sắm',
  linkUrl = ROUTES.PRODUCTS,
  icon: Icon = HelpCircle,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-border rounded-custom bg-zinc-950/20 max-w-md mx-auto my-8 space-y-4">
      <div className="p-4 bg-zinc-900 border border-border/80 rounded-full text-foreground-muted animate-pulse-glow">
        <Icon size={36} className="text-accent" />
      </div>
      <h3 className="text-lg font-extrabold text-foreground">{title}</h3>
      <p className="text-xs text-foreground-muted leading-relaxed">{message}</p>
      {buttonText && (
        <Link
          href={linkUrl}
          className="inline-flex bg-accent hover:bg-accent-hover text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-custom transition-all duration-200"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}
