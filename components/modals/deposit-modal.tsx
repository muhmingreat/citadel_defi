'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, AlertCircle, Loader2, Check } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS } from '@/config/contracts';
import { useCitadelData } from '@/hooks/useCitadelData';

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositModal({ open, onOpenChange }: DepositModalProps) {
  const { address } = useAccount();
  const { userAssetBalance, refetch } = useCitadelData();
  const [amount, setAmount] = useState('');

  // Reset amount when modal closes
  useEffect(() => {
    if (!open) {
      setAmount('');
    }
  }, [open]);

  // 1. Approval Logic
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.MockUSDC.address as `0x${string}`,
    abi: CONTRACTS.MockUSDC.abi,
    functionName: 'allowance',
    args: [address as `0x${string}`, CONTRACTS.CitadelVault.address as `0x${string}`],
  });

  const { data: approveHash, writeContract: approve, isPending: isApproving } = useWriteContract();
  const { isLoading: isConfirmingApprove, isSuccess: isApproveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveHash });

  // 2. Deposit Logic
  const { data: depositHash, writeContract: deposit, isPending: isDepositing } = useWriteContract();
  const { isLoading: isConfirmingDeposit, isSuccess: isDepositConfirmed } =
    useWaitForTransactionReceipt({ hash: depositHash });

  const needsApproval = allowance !== undefined && amount ? (allowance as bigint) < parseUnits(amount, 18) : true;

  const handleAction = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const parsedAmount = parseUnits(amount, 18);

    if (needsApproval) {
      approve({
        address: CONTRACTS.MockUSDC.address as `0x${string}`,
        abi: CONTRACTS.MockUSDC.abi,
        functionName: 'approve',
        args: [CONTRACTS.CitadelVault.address as `0x${string}`, parsedAmount],
      });
    } else {
      deposit({
        address: CONTRACTS.CitadelVault.address as `0x${string}`,
        abi: CONTRACTS.CitadelVault.abi,
        functionName: 'deposit',
        args: [parsedAmount, address as `0x${string}`],
      });
    }
  };

  // Simple effects - no complex dependencies
  useEffect(() => {
    if (isApproveConfirmed) {
      refetchAllowance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveConfirmed]);

  useEffect(() => {
    if (isDepositConfirmed) {
      // Wait a bit for blockchain state to update, then refetch
      const refetchTimer = setTimeout(() => {
        console.log('🔄 Deposit confirmed, refetching data...');
        refetch();
      }, 1000);
      
      // Close modal after showing success message
      const closeTimer = setTimeout(() => {
        setAmount('');
        onOpenChange(false);
      }, 1200);
      
      return () => {
        clearTimeout(refetchTimer);
        clearTimeout(closeTimer);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDepositConfirmed]);

  const handleMaxClick = () => {
    setAmount(userAssetBalance.toString());
  };

  const isPending = isApproving || isConfirmingApprove || isDepositing || isConfirmingDeposit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1E293B] border-slate-700 w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Deposit to Citadel
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Confirm your deposit amount. You may need to approve the transaction in your wallet.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-slate-300">
              Amount (mUSDC)
            </Label>
            <div className="relative">
              <Input
                id="amount"
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
            <p className="text-xs text-slate-500">Available: {userAssetBalance.toLocaleString()} mUSDC</p>
          </div>

          {/* Status Indicators */}
          {(isApproveConfirmed || isDepositConfirmed) && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-mono animate-pulse">
              <Check className="w-4 h-4" />
              {isDepositConfirmed ? 'Deposit Successful! Updating balances...' : 
               'Approval Confirmed! Click button again to deposit.'}
            </div>
          )}

          {/* Action Button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isPending || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > userAssetBalance}
              className={`flex-1 gap-2 h-11 font-bold text-white transition-all ${needsApproval
                ? 'bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-900/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-900/20'
                }`}
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {!isPending && (needsApproval ? <AlertCircle className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
              {isApproving ? 'Sign Approval...' :
                isConfirmingApprove ? 'Confirming Approval...' :
                  isDepositing ? 'Sign Deposit...' :
                    isConfirmingDeposit ? 'Finalizing Deposit...' :
                      needsApproval ? 'STEP 1: APPROVE USDC' : 'STEP 2: CONFIRM DEPOSIT'}
            </Button>
          </div>

          <p className="text-[10px] text-slate-500 text-center font-mono">
            Secured by Citadel Autonomous Risk Engine
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}