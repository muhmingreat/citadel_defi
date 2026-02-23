import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { Loader2, Edit2, Check, X } from 'lucide-react';

interface RiskMeterProps {
  volatility: number; // 0-100
  onAction?: () => void;
}

export function RiskMeter({ volatility: onChainVolatility, onAction }: RiskMeterProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localVol, setLocalVol] = useState(onChainVolatility);

  const { data: hash, writeContract: updateVol, isPending: isUpdating } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      setIsEditing(false);
      onAction?.();
    }
  }, [isSuccess, onAction]);

  useEffect(() => {
    if (!isEditing) {
      setLocalVol(onChainVolatility);
    }
  }, [onChainVolatility, isEditing]);

  const handleUpdate = () => {
    updateVol({
      address: CONTRACTS.VolatilityOracle.address,
      abi: CONTRACTS.VolatilityOracle.abi,
      functionName: 'setVolatility',
      args: [BigInt(Math.round(localVol))],
    });
  };

  // Determine risk level
  const getRiskLevel = (vol: number) => {
    if (vol < 33) return { level: 'LOW', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
    if (vol < 66) return { level: 'MEDIUM', color: 'text-amber-400', bg: 'bg-amber-500/20' };
    return { level: 'HIGH', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  const risk = getRiskLevel(localVol);

  // Segments for the meter
  const segments = Array.from({ length: 10 }, (_, i) => {
    const threshold = (i + 1) * 10;
    const isActive = localVol >= threshold;
    const segmentIndex = i;

    let segmentColor = 'bg-slate-700';
    if (isActive) {
      if (segmentIndex < 3) segmentColor = 'bg-emerald-500';
      else if (segmentIndex < 6) segmentColor = 'bg-amber-500';
      else segmentColor = 'bg-red-500';
    }

    return { threshold, isActive, segmentColor };
  });

  return (
    <div className="card-citadel p-6 sm:p-8 relative group">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-1">
            Risk Engine: Online
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            Market volatility assessment
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-indigo-500/20 text-slate-500 hover:text-indigo-400 transition-colors"
            title="Manual Override"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={() => { setIsEditing(false); setLocalVol(onChainVolatility); }}
              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Meter Background */}
      <div className="mb-6">
        {/* Segments */}
        <div className="flex gap-1.5 mb-4">
          {segments.map((segment, i) => (
            <div
              key={i}
              className={`flex-1 h-3 rounded-sm transition-all duration-300 ${segment.segmentColor}`}
            />
          ))}
        </div>

        {/* Interaction Layer */}
        {isEditing ? (
          <div className="px-2 mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={localVol}
              onChange={(e) => setLocalVol(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ) : (
          <div className="relative h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
            <div
              className="absolute top-1/2 -translate-y-1/2 h-4 w-0.5 bg-slate-300 transition-all duration-500 shadow-lg"
              style={{ left: `${localVol}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-300 bg-slate-900" />
            </div>
          </div>
        )}

        {/* Scale Labels */}
        <div className="flex justify-between text-xs font-mono text-slate-500 mb-4">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Current Reading */}
      <div className={`p-4 rounded-lg border ${risk.bg} border-slate-700 flex items-center justify-between transition-colors duration-500`}>
        <div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            {isEditing ? "Manual Assessment" : "Current Volatility"}
          </p>
          <p className={`text-3xl font-mono font-bold ${risk.color}`}>
            {localVol.toFixed(1)}%
          </p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-mono font-bold ${risk.color}`}>
            {risk.level}
          </p>
          <p className="text-xs text-slate-500 mt-1">Risk Level</p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-3 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-500" />
          <span className="text-slate-400">0-33% Safe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <span className="text-slate-400">33-66% Caution</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-500" />
          <span className="text-slate-400">66-100% Alert</span>
        </div>
      </div>

      {isEditing && (
        <div className="absolute inset-0 border-2 border-indigo-500/50 rounded-lg pointer-events-none animate-pulse" />
      )}
    </div>
  );
}
