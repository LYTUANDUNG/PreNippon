'use client';

import { useToastStore } from '../store/toastStore';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-lg border shadow-lg ${
              toast.type === 'success'
                ? 'bg-zinc-950 border-green-500/30 text-green-400'
                : toast.type === 'error'
                ? 'bg-zinc-950 border-accent/30 text-accent'
                : 'bg-zinc-950 border-blue-500/30 text-blue-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'error' && <XCircle size={18} />}
              {toast.type === 'info' && <AlertCircle size={18} />}
              <span className="text-sm font-medium text-foreground">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-foreground-muted hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
