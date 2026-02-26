import { Shield, Zap, BarChart3, Lock } from 'lucide-react';
import { InfoCard } from '../doc-section';

export function OverviewSection() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-4 font-mono">
          Welcome to Citadel DeFi
        </h2>
        <p className="text-lg text-slate-300 leading-relaxed">
          An autonomous defensive DeFi yield vault that dynamically adjusts investment strategies 
          based on real-time market volatility. The protocol automatically switches between 
          aggressive growth and defensive fortress modes to protect user assets while maximizing returns.
        </p>
      </div>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono">Autonomous Risk Management</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Automatic mode switching based on volatility thresholds. No manual intervention required.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <Zap className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono">Dual Strategy System</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            AsterDEX (stable) + PancakeSwap (volatile) yield optimization for balanced returns.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-amber-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
              <BarChart3 className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono">Real-time Monitoring</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Live dashboard with volatility tracking, activity logs, and performance metrics.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-purple-500/30 transition-colors group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-mono">ERC-4626 Compliant</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Standard vault interface for maximum compatibility with DeFi ecosystem.
          </p>
        </div>
      </div>

      {/* Core Metrics */}
      <InfoCard title="Core Metrics" type="info">
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 font-mono">•</span>
            <span><strong className="text-white">TVL (Total Value Locked):</strong> Real-time tracking of all deposited assets</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 font-mono">•</span>
            <span><strong className="text-white">Net APY:</strong> Combined yield from both strategies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 font-mono">•</span>
            <span><strong className="text-white">Volatility Index:</strong> 0-100% market risk indicator</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-400 font-mono">•</span>
            <span><strong className="text-white">Mode Status:</strong> Growth (&lt; 45% volatility) or Fortress (&gt; 65% volatility)</span>
          </li>
        </ul>
      </InfoCard>
    </div>
  );
}
