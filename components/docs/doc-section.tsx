import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface DocSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  active: boolean;
}

export function DocSection({ id, title, children, active }: DocSectionProps) {
  if (!active) return null;

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="border-l-4 border-indigo-500 pl-6 py-2">
        <h1 className="text-4xl font-bold text-white font-mono">{title}</h1>
      </div>
      
      <div className="prose prose-invert prose-slate max-w-none">
        {children}
      </div>
    </motion.div>
  );
}

export function CodeBlock({ code, language = 'typescript', id }: { code: string; language?: string; id: string }) {
  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
        >
          <span className="sr-only">Copy code</span>
          📋
        </button>
      </div>
      <pre className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto">
        <code className="text-sm font-mono text-slate-300">{code}</code>
      </pre>
    </div>
  );
}

export function InfoCard({ title, children, type = 'info' }: { title: string; children: ReactNode; type?: 'info' | 'warning' | 'success' }) {
  const colors = {
    info: 'border-indigo-500/30 bg-indigo-500/5',
    warning: 'border-amber-500/30 bg-amber-500/5',
    success: 'border-emerald-500/30 bg-emerald-500/5',
  };

  return (
    <div className={`border rounded-xl p-6 ${colors[type]}`}>
      <h3 className="text-lg font-bold text-white mb-3 font-mono">{title}</h3>
      <div className="text-slate-300 text-sm space-y-2">{children}</div>
    </div>
  );
}
