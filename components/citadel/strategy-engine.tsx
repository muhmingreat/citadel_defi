import { Anchor, Zap, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { useEffect } from 'react';

interface StrategyEngineProps {
  mode: 'growth' | 'fortress';
  asterDexAllocation: number;
  pancakeSwapAllocation: number;
  onAction?: () => void;
}

export function StrategyEngine({
  mode,
  asterDexAllocation,
  pancakeSwapAllocation,
  onAction,
}: StrategyEngineProps) {
  const { data: hash, writeContract: adapt, isPending: isAdapting } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      onAction?.();
    }
  }, [isSuccess, onAction]);

  const handleAdapt = () => {
    adapt({
      address: CONTRACTS.CitadelVault.address,
      abi: CONTRACTS.CitadelVault.abi,
      functionName: 'adapt',
    });
  };

  const isGrowth = mode === 'growth';

  return (
    <div className="card-citadel p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-1">
            Strategy Breakdown
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Deployment engine status
          </p>
        </div>
        <button
          onClick={handleAdapt}
          disabled={isAdapting}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 text-xs font-mono hover:bg-indigo-500/20 transition-all disabled:opacity-50"
        >
          {isAdapting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          TRIGGER ADAPT
        </button>
      </div>

      {/* Mode Badge */}
      <div className="mb-8">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${isGrowth
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-red-500/10 border-red-500/30'
            }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${isGrowth ? 'bg-emerald-400' : 'bg-red-400'
              }`}
          />
          <span
            className={`text-sm font-mono font-semibold ${isGrowth ? 'text-emerald-400' : 'text-red-400'
              }`}
          >
            {isGrowth ? 'GROWTH MODE' : 'FORTRESS MODE'}
          </span>
        </div>
      </div>

      {/* Strategy Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-stretch">
        {/* Bucket A: AsterDEX */}
        <div
          className={`border rounded-lg p-6 transition-all duration-300 ${isGrowth
            ? 'border-slate-700 bg-slate-800/30'
            : 'border-emerald-500/50 bg-emerald-500/10'
            }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                Bucket A
              </p>
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Anchor className="w-5 h-5 text-indigo-400" />
                AsterDEX Earn
              </h3>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-slate-400 mb-2">Strategy: Stable Yield</p>
            <p className="text-3xl font-mono font-bold text-indigo-400">
              {asterDexAllocation}%
            </p>
          </div>
          <p
            className={`text-xs font-mono ${isGrowth
              ? 'text-slate-500'
              : 'text-emerald-300 font-semibold'
              }`}
          >
            {isGrowth ? 'Primary deployment' : 'PRIMARY DEFENSE'}
          </p>
        </div>

        {/* Flow Indicator */}
        <div className="flex flex-col items-center justify-center">
          {isGrowth ? (
            <div className="flex gap-2">
              <ArrowRight className="w-5 h-5 text-slate-600 animate-pulse" />
              <ArrowRight className="w-5 h-5 text-slate-500 animate-pulse" />
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xs font-mono text-red-400 font-semibold mb-2">
                SEVERED
              </p>
              <div className="w-12 h-1 bg-red-500/30 rounded-full" />
            </div>
          )}
        </div>

        {/* Bucket B: PancakeSwap */}
        <div
          className={`border rounded-lg p-6 transition-all duration-300 ${isGrowth
            ? 'border-slate-700 bg-slate-800/30'
            : 'border-slate-700 bg-slate-900 opacity-50'
            }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
                Bucket B
              </p>
              <h3
                className={`text-lg font-semibold flex items-center gap-2 ${isGrowth ? 'text-slate-100' : 'text-slate-500'
                  }`}
              >
                <Zap className={isGrowth ? 'w-5 h-5 text-amber-400' : 'w-5 h-5 text-slate-600'} />
                PancakeSwap LP
              </h3>
            </div>
          </div>
          <div className="mb-4">
            <p className={`text-sm ${isGrowth ? 'text-slate-400' : 'text-slate-500'} mb-2`}>
              Strategy: {isGrowth ? 'Amplified Yield' : 'UNWOUND'}
            </p>
            <p
              className={`text-3xl font-mono font-bold ${isGrowth ? 'text-amber-400' : 'text-slate-600'
                }`}
            >
              {pancakeSwapAllocation}%
            </p>
          </div>
          <p className={`text-xs font-mono ${isGrowth ? 'text-slate-500' : 'text-slate-600'}`}>
            {isGrowth ? 'Booster capital' : 'POSITION CLOSED'}
          </p>
        </div>
      </div>

      {/* Flow Diagram Text */}
      <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg text-center">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
          Capital Flow
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-sm font-mono text-slate-400">Inbound → Treasury</span>
          <span className="text-slate-600">→</span>
          <span className="text-sm font-mono text-slate-400">
            {isGrowth ? 'Split Allocation' : 'Full Defense'}
          </span>
          <span className="text-slate-600">→</span>
          <span
            className={`text-sm font-mono font-semibold ${isGrowth ? 'text-emerald-400' : 'text-red-400'
              }`}
          >
            {isGrowth ? 'Yield Generation' : 'Volatility Protection'}
          </span>
        </div>
      </div>
    </div>
  );
}
