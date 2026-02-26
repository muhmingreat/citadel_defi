'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/config/contracts';
import { useCitadelData } from '@/hooks/useCitadelData';

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawModal({ open, onOpenChange }: WithdrawModalProps) {
  const { address } = useAccount();
  const { userVaultBalance, refetch } = useCitadelData();
  const [amount, setAmount] = useState('');

  const { data: hash, writeContract: withdraw, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleWithdraw = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    withdraw({
      address: CONTRACTS.CitadelVault.address as `0x${string}`,
      abi: CONTRACTS.CitadelVault.abi,
      functionName: 'withdraw',
      args: [parseUnits(amount, 18), address as `0x${string}`, address as `0x${string}`],
    });
  };

  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => {
        refetch();
        setAmount('');
        onOpenChange(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  const handleMaxClick = () => {
    setAmount(userVaultBalance.toString());
  };

  if (isConfirmed) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#1E293B] border-slate-700 w-full max-w-md">
          <div className="text-center space-y-4 py-8">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-pulse" />
            <h3 className="text-2xl font-bold text-white">Withdrawal Successful</h3>
            <p className="text-slate-400">
              Your {amount} assets are returning to your wallet.
            </p>
            <div className="card-citadel p-4 space-y-2">
              <p className="text-xs text-slate-300 font-mono break-all">
                TX: {hash}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const isLoading = isPending || isConfirming;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E293B] border-slate-700 w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Withdraw from Citadel
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Enter the amount of assets you wish to withdraw from the vault back to your wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="withdraw-amount" className="text-slate-300">
              Amount (Assets)
            </Label>
            <div className="relative">
              <Input
                id="withdraw-amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-lg h-12"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-2 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 bg-transparent"
              >
                MAX
              </Button>
            </div>
            <p className="text-xs text-slate-500">Your balance: {userVaultBalance.toLocaleString()} CTDL</p>
          </div>

          {/* Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Withdrawal Amount</span>
              <span className="font-mono">{amount || '0'} assets</span>
            </div>
            <div className="border-t border-slate-700 pt-2 flex justify-between text-slate-200 font-semibold">
              <span>You Receive</span>
              <span className="font-mono">{amount || '0'} mUSDC</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={isLoading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > userVaultBalance}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-11 gap-2 font-semibold"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? 'Confirming...' : isConfirming ? 'Withdrawing...' : 'Confirm Withdrawal'}
              {!isLoading && <ArrowLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

