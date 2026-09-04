import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(({ type, title, message, durationMs }: Omit<ToastItem, 'id'>) => {
    // Default success toasts to 6 seconds (6000ms) for clear user comprehension; others to 5000ms
    const effectiveDuration = durationMs ?? (type === 'success' ? 6000 : 5000);
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, type, title, message, durationMs: effectiveDuration };
    
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, effectiveDuration);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string, durationMs: number = 6000) => {
    showToast({ type: 'success', title, message, durationMs });
  }, [showToast]);

  const error = useCallback((title: string, message?: string, durationMs: number = 5500) => {
    showToast({ type: 'error', title, message, durationMs });
  }, [showToast]);

  const info = useCallback((title: string, message?: string, durationMs: number = 5000) => {
    showToast({ type: 'info', title, message, durationMs });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string, durationMs: number = 5000) => {
    showToast({ type: 'warning', title, message, durationMs });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto flex items-start gap-3.5 p-4 bg-white rounded-xl shadow-editorial border border-[#E4E4DF] text-[#242424]"
            >
              {t.type === 'success' && (
                <div className="w-7 h-7 rounded-lg bg-[#EEF2ED] text-[#242424] flex items-center justify-center shrink-0 border border-[#242424]/15">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              {t.type === 'error' && (
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
              {t.type === 'warning' && (
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-[#91482D] flex items-center justify-center shrink-0 border border-amber-200">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
              {t.type === 'info' && (
                <div className="w-7 h-7 rounded-lg bg-[#F7F7F4] text-[#242424] flex items-center justify-center shrink-0 border border-[#E4E4DF]">
                  <Info className="w-4 h-4" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-bold text-sm text-[#242424] leading-tight">{t.title}</h4>
                {t.message && <p className="font-prose text-xs text-[#6B6B67] mt-1 leading-relaxed whitespace-pre-line">{t.message}</p>}
              </div>

              <button
                onClick={() => removeToast(t.id)}
                className="text-[#6B6B67] hover:text-[#242424] p-1 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
