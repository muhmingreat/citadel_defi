'use client';

import { useState, useCallback } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DepositModal } from '@/components/modals/deposit-modal';
import { WithdrawModal } from '@/components/modals/withdraw-modal';

interface VaultCardProps {
  tvl: number;
  netAPY: number; // Added for real on-chain APY
  anchorYield: number;
  boosterYield: number;
  userBalance?: number;
  onDeposit?: () => void;
  onWithdraw?: () => void;
}

export function VaultCard({
  tvl,
  netAPY,
  anchorYield,
  boosterYield,
  userBalance,
  onDeposit,
  onWithdraw,
}: VaultCardProps) {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const totalApy = netAPY; // Use the on-chain calculated APY

  // Memoize callbacks to prevent infinite re-renders in Dialog components
  const handleDepositOpenChange = useCallback((open: boolean) => {
    setDepositOpen(open);
  }, []);

  const handleWithdrawOpenChange = useCallback((open: boolean) => {
    setWithdrawOpen(open);
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatPercent = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  const handleDepositClick = () => {
    setDepositOpen(true);
    onDeposit?.();
  };

  const handleWithdrawClick = () => {
    setWithdrawOpen(true);
    onWithdraw?.();
  };

  return (
    <div className="card-citadel p-6 sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-sm font-mono text-slate-400 uppercase tracking-wider mb-2">
          Citadel Vault
        </h2>
        <p className="text-slate-300 text-sm">
          Autonomous defensive yield optimization
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {/* TVL */}
        <div className="border-l-2 border-indigo-500 pl-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Total Value Locked
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-slate-100 break-words">
            {formatNumber(tvl)}
          </p>
        </div>

        {/* Total APY */}
        <div className="border-l-2 border-emerald-500 pl-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Net APY
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-emerald-400">
            {formatPercent(totalApy)}
          </p>
        </div>

        {/* Anchor Yield (Stable) */}
        <div className="border-l-2 border-blue-500 pl-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Anchor Yield
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl font-mono font-bold text-blue-400">
            {formatPercent(anchorYield)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Stable</p>
        </div>

        {/* Booster Yield (Volatile) */}
        <div className="border-l-2 border-orange-500 pl-4">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            Booster Yield
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl font-mono font-bold text-orange-400">
            {formatPercent(boosterYield)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Volatile</p>
        </div>
      </div>

      {/* User Balance (if connected) */}
      {userBalance !== undefined && (
        <div className="mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
            Your Balance
          </p>
          <p className="text-2xl font-mono font-bold text-slate-100">
            {formatNumber(userBalance)}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button
          onClick={handleDepositClick}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-11 font-semibold"
        >
          <ArrowDown className="w-4 h-4" />
          DEPOSIT
        </Button>
        <Button
          onClick={handleWithdrawClick}
          variant="outline"
          className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 h-11 gap-2 font-semibold bg-transparent"
        >
          <ArrowUp className="w-4 h-4" />
          WITHDRAW
        </Button>
      </div>

      {/* Modals - Only render when open to prevent ref loops */}
      {depositOpen && <DepositModal open={depositOpen} onOpenChange={handleDepositOpenChange} />}
      {withdrawOpen && <WithdrawModal open={withdrawOpen} onOpenChange={handleWithdrawOpenChange} />}
    </div>
  );
}
