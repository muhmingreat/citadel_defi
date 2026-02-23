import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, TrendingUp, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'success' | 'warning' | 'info' | 'alert';
  message: string;
  details?: string;
}

interface ActivityLogProps {
  entries: LogEntry[];
}

export function ActivityLog({ entries }: ActivityLogProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(entries.length / itemsPerPage);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400';
      case 'warning':
        return 'text-amber-400';
      case 'alert':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const currentEntries = entries.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="card-citadel p-6 sm:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-1">
          Activity Log
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm">
          Real-time system events and rebalancing actions
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden min-h-[300px]">
        {entries.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {currentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] font-mono text-slate-500">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    {getIcon(entry.type)}
                  </div>

                  <div className="flex-1">
                    <p className={`${getTypeColor(entry.type)} text-xs font-mono leading-relaxed mb-1`}>
                      {entry.message}
                    </p>
                    {entry.details && (
                      <p className="text-slate-500 text-[10px] italic">
                        {entry.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Fillers for layout consistency */}
              {currentEntries.length < itemsPerPage &&
                Array.from({ length: itemsPerPage - currentEntries.length }).map((_, i) => (
                  <div key={`filler-${i}`} className="border border-slate-800/20 rounded-xl p-4 opacity-10 hidden md:block" />
                ))
              }
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
            <TrendingUp className="w-10 h-10 mb-3 opacity-20 animate-pulse" />
            <p className="text-sm font-mono uppercase tracking-widest opacity-50">Monitoring Network...</p>
            <p className="text-[10px] mt-2 italic">Historical events take a moment to sync from the blockchain.</p>
          </div>
        )}
      </div>

      {/* Log Stats Footer */}
      <div className="flex flex-wrap gap-4 mt-8 text-[10px] font-mono uppercase tracking-widest">
        <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-400">
            Success: {entries.filter((e) => e.type === 'success').length}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/5 px-3 py-1.5 rounded-full border border-amber-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-slate-400">
            Warnings: {entries.filter((e) => e.type === 'warning').length}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-red-500/5 px-3 py-1.5 rounded-full border border-red-500/10">
          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
          <span className="text-slate-400">
            Alerts: {entries.filter((e) => e.type === 'alert').length}
          </span>
        </div>
        <div className="text-slate-600 flex items-center gap-2">
          <span>Total Logs: {entries.length}</span>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-lg border border-slate-800 ml-auto">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-1.5 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">
              Page {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="p-1.5 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
