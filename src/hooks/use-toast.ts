import * as React from "react";
import { createContext, useContext, useState } from "react";

type ToastVariant = 'default' | 'destructive';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (props: { title?: string; description?: string; variant?: ToastVariant }) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = React.useCallback(({
    title,
    description,
    variant = 'default',
  }: {
    title?: string;
    description?: string;
    variant?: ToastVariant;
  }) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [
      ...prev,
      { id, title, description, variant },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = React.useMemo(() => ({
    toasts,
    toast,
    dismiss,
  }), [toasts, toast, dismiss]);

  return React.createElement(
    ToastContext.Provider,
    { value },
    React.createElement(
      React.Fragment,
      null,
      children,
      React.createElement(
        'div',
        {
          className: 'fixed bottom-0 right-0 p-4 space-y-2 z-50'
        },
        toasts.map((t) => 
          React.createElement(
            'div',
            {
              key: t.id,
              className: `p-4 rounded-lg shadow-lg ${
                t.variant === 'destructive'
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-900'
              }`
            },
            t.title && React.createElement(
              'div',
              { className: 'font-semibold' },
              t.title
            ),
            t.description && React.createElement(
              'div',
              null,
              t.description
            )
          )
        )
      )
    )
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
