'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { Button } from '@/components/ui/button';
import { Zap, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export function MarketSimulator({ onAction }: { onAction?: () => void }) {
    const { data: volHash, writeContract: updateVol, isPending: isUpdatingVol } = useWriteContract();
    const { data: adaptHash, writeContract: adapt, isPending: isAdapting } = useWriteContract();

    // Auto-refetch when updates are confirmed
    const { isSuccess: volSuccess } = useWaitForTransactionReceipt({
        hash: volHash
    });

    const { isSuccess: adaptSuccess } = useWaitForTransactionReceipt({
        hash: adaptHash
    });

    useEffect(() => {
        if (volSuccess || adaptSuccess) {
            onAction?.();
        }
    }, [volSuccess, adaptSuccess, onAction]);

    const handleSimulate = async () => {
        // 1. Force Volatility to 80% (Crucial for Fortress mode)
        updateVol({
            address: CONTRACTS.VolatilityOracle.address,
            abi: CONTRACTS.VolatilityOracle.abi,
            functionName: 'setVolatility',
            args: [BigInt(80)],
        });
    };

    const handleAdapt = () => {
        // 2. Trigger Citadel to adapt
        adapt({
            address: CONTRACTS.CitadelVault.address,
            abi: CONTRACTS.CitadelVault.abi,
            functionName: 'adapt',
        });
    };

    return (
        <div className="card-citadel p-4 border-indigo-500/30 bg-indigo-500/5">
            <h3 className="text-xs font-mono font-bold text-indigo-400 mb-2 flex items-center gap-2">
                <Zap className="w-3 h-3" /> MARKET SIMULATOR (DEV)
            </h3>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    onClick={handleSimulate}
                    disabled={isUpdatingVol}
                    className="h-8 text-[10px] font-mono bg-indigo-600 hover:bg-indigo-700"
                >
                    {isUpdatingVol ? <Loader2 className="w-3 h-3 animate-spin" /> : 'SET VOLATILITY (80%)'}
                </Button>
                <Button
                    onClick={handleAdapt}
                    disabled={isAdapting}
                    className="h-8 text-[10px] font-mono bg-slate-700 hover:bg-slate-600"
                >
                    {isAdapting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'TRIGGER ADAPT()'}
                </Button>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 italic text-center">
                Set high volatility then trigger Adapt() to see FORTRESS mode activate!
            </p>
        </div>
    );
}
