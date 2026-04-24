import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  defaultValue,
  className,
  children,
}: {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('inline-flex rounded-md bg-slate-100 p-1', className)} role="tablist" {...props} />;
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const context = React.useContext(TabsContext);
  if (!context) return null;

  const selected = context.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={cn(
        'focus-ring rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
        selected ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900',
        className,
      )}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const context = React.useContext(TabsContext);
  if (!context || context.value !== value) return null;
  return <div className={cn('mt-4', className)}>{children}</div>;
}
