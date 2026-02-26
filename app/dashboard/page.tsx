'use client';

import { useEffect, useState, useRef } from 'react';
import { useAccount, useWatchContractEvent } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ShieldHeader } from '@/components/citadel/shield-header';
import { VaultCard } from '@/components/citadel/vault-card';
import { RiskMeter } from '@/components/citadel/risk-meter';
import { FaucetButton } from '@/components/citadel/faucet-button';
import { ActivityLog } from '@/components/citadel/activity-log';
import { useCitadelData } from '@/hooks/useCitadelData';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatUnits } from 'viem';

// Simplified Alert System for Overview
interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'info';
}

export default function DashboardPage() {
  const router = useRouter();
  const { address, isConnected, status } = useAccount();
  const {
    tvl,
    mode,
    volatility,
    userVaultBalance,
    userAssetBalance,
    anchorYield,
    boosterYield,
    isLoading,
    refetch,
    CONTRACTS,
    netAPY,
    historicalLogs
  } = useCitadelData();

  const [alerts] = useState<Alert[]>([]);
  const [logEntries, setLogEntries] = useState<any[]>(() => {
    // Load from localStorage on initial mount
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('citadel_formatted_logs');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Ensure timestamps are proper Date objects
          return parsed.map((entry: any) => ({
            ...entry,
            timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date()
          }));
        }
      } catch (e) {
        console.warn('Failed to load formatted logs:', e);
        // Clear corrupted data
        localStorage.removeItem('citadel_formatted_logs');
      }
    }
    return [];
  });

  // Use ref to track last processed logs to prevent infinite loops
  const lastProcessedLogsRef = useRef<string>('');

  // Sync historical logs locally
  useEffect(() => {
    if (historicalLogs && historicalLogs.length > 0) {
      // Create a hash of the logs to detect actual changes
      const logsHash = JSON.stringify(historicalLogs.map(l => l.transactionHash + l.logIndex));
      
      // Only process if logs have actually changed
      if (logsHash === lastProcessedLogsRef.current) {
        return;
      }
      
      lastProcessedLogsRef.current = logsHash;
      const formatted = historicalLogs.map((log: any) => {
        const type = log.type;
        let msg = '';
        let details = 'Blockchain Event';
        let logType: 'success' | 'warning' | 'info' | 'alert' = 'info';

        if (type === 'volatility') {
          msg = `Market Alert: Volatility shifted to ${log.args.newValue?.toString()}%`;
          logType = 'warning';
          details = 'Oracle telemetry sync';
        } else if (type === 'mode') {
          msg = `PROTOCOL ADAPT: ${Number(log.args.newMode) === 0 ? 'GROWTH' : 'FORTRESS'} MODE`;
          logType = 'alert';
          details = `Trigger: ${log.args.triggerVolatility?.toString()}% Vol confirmed`;
        } else if (type === 'deposit') {
          const val = formatUnits(log.args.assets || BigInt(0), 18);
          msg = `Inbound Flow: $${parseFloat(val).toLocaleString()} mUSDC`;
          logType = 'success';
          details = `Verification: Success (Block ${log.blockNumber?.toString()})`;
        } else if (type === 'withdraw') {
          const val = formatUnits(log.args.assets || BigInt(0), 18);
          msg = `Outbound Flow: $${parseFloat(val).toLocaleString()} mUSDC`;
          logType = 'info';
          details = `Strategic exit confirmed (Block ${log.blockNumber?.toString()})`;
        }

        return {
          id: `${log.transactionHash}-${log.logIndex}`,
          timestamp: log.blockDate || new Date(),
          type: logType,
          message: msg,
          details: details,
        };
      });
      
      setLogEntries(formatted);
      
      // Save formatted logs to localStorage for persistence
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('citadel_formatted_logs', JSON.stringify(formatted));
        } catch (e) {
          console.warn('Failed to save formatted logs:', e);
        }
      }
    }
  }, [historicalLogs]);

  // Redirect if wallet connected status is definitive and false
  useEffect(() => {
    if (status !== 'connecting' && status !== 'reconnecting' && !isConnected) {
      router.push('/');
    }
  }, [isConnected, status, router]);

  if (!isConnected && (status === 'connecting' || status === 'reconnecting')) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!isConnected) return null;

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 font-mono tracking-tight">Mission Control</h1>
          <p className="text-slate-400 text-sm mt-1">System status and asset performance overview.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-800/80 border border-slate-700/50 rounded-lg backdrop-blur-sm">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">Wallet Balance</span>
            <span className="text-sm font-mono font-bold text-slate-100">
              ${userAssetBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })} mUSDC
            </span>
          </div>

          <FaucetButton assetAddress={CONTRACTS.MockUSDC.address} userAddress={address} />

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:text-white"
          >
            <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <ShieldHeader
        mode={mode}
        walletAddress={address}
        onSentinelClick={() => router.push('/dashboard/intelligence')}
      />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Vault Card */}
        <div className="lg:col-span-2">
          <VaultCard
            tvl={tvl}
            netAPY={netAPY}
            anchorYield={anchorYield}
            boosterYield={mode === 'growth' ? boosterYield : 0}
            userBalance={userVaultBalance}
            onDeposit={() => { }}
            onWithdraw={() => { }}
          />
        </div>

        {/* Risk Meter Side */}
        <div className="flex flex-col gap-6">
          <RiskMeter volatility={volatility} onAction={() => refetch()} />

          {/* Quick Actions / Shortcuts */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-5">
            <h3 className="text-indigo-400 font-bold mb-3 text-sm uppercase tracking-wider">Quick Jump</h3>
            <div className="space-y-2">
              <Link href="/dashboard/strategy" className="block p-3 rounded-lg bg-slate-900/50 hover:bg-indigo-500/20 border border-transparent hover:border-indigo-500/30 transition-all group">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300 group-hover:text-white">Adjust Strategy</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                </div>
              </Link>
              <Link href="/dashboard/intelligence" className="block p-3 rounded-lg bg-slate-900/50 hover:bg-emerald-500/20 border border-transparent hover:border-emerald-500/30 transition-all group">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300 group-hover:text-white">Ask Sentinel AI</span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="mt-8">
        <ActivityLog entries={logEntries} />
      </div>

      {/* Recent Alerts Ticker */}
      {alerts.length > 0 && (
        <div className="bg-slate-900/40 border-t border-b border-slate-800 p-2 flex items-center justify-center gap-4">
          <span className="text-[10px] font-mono text-slate-500 uppercase">LATEST SYSTEM EVENT:</span>
          <span className="text-xs font-mono text-yellow-400 animate-pulse">{alerts[0].message}</span>
        </div>
      )}
    </div>
  );
}
