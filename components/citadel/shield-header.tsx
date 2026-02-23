'use client';

import { Wallet, Home } from 'lucide-react';
import { CitadelLogo } from '@/components/ui/citadel-logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ShieldHeaderProps {
  mode: 'growth' | 'fortress';
  walletAddress?: string;
  onSentinelClick?: () => void;
}

export function ShieldHeader({ mode, walletAddress, onSentinelClick }: ShieldHeaderProps) {
  const isGrowth = mode === 'growth';
  const statusColor = isGrowth ? 'text-emerald-400' : 'text-red-400';
  const statusBg = isGrowth ? 'bg-emerald-500/10' : 'bg-red-500/10';
  const statusText = isGrowth ? 'SYSTEM: GROWTH' : 'SYSTEM: FORTRESS';

  return (
    <header className="border-b border-slate-700 bg-[#0F172A] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Citadel Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group cursor-pointer">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0 relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <CitadelLogo className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400 relative" />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-100 tracking-tight group-hover:text-indigo-300 transition-colors">
              CITADEL
            </h1>
          </Link>

          {/* Center: Status Shield */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border ${statusBg} border-slate-700 whitespace-nowrap`}>
              <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${statusColor} ${isGrowth ? 'animate-pulse' : ''}`} />
              <span className={`text-xs sm:text-sm font-mono font-semibold ${statusColor}`}>
                {statusText}
              </span>
            </div>

            {/* Global Sentinel Status */}
            <button
              onClick={onSentinelClick}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 whitespace-nowrap shadow-[0_0_10px_rgba(99,102,241,0.1)] hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all group"
              title="Open Sentinel Intelligence Console"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
              <span className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-widest font-bold group-hover:text-indigo-300">
                Sentinel: Active
              </span>
            </button>
          </div>

          {/* Right: Wallet & Navigation */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 h-6 px-2 text-[9px] font-mono font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all"
              >
                <Home className="w-3 h-3" />
                Back to Home
              </Button>
            </Link>

            <Button
              variant="outline"
              className="gap-1.5 sm:gap-2 text-xs font-mono bg-transparent border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 h-8 sm:h-9 px-2 sm:px-3"
            >
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">
                {walletAddress
                  ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
                  : 'Connect'}
              </span>
              <span className="sm:hidden">
                {walletAddress ? '...' : 'Connect'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
