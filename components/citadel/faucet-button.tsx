'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { Button } from '@/components/ui/button';
import { Droplets, Loader2 } from 'lucide-react';
import { parseUnits } from 'viem';
import { useEffect } from 'react';

interface FaucetButtonProps {
    assetAddress: `0x${string}`;
    userAddress?: `0x${string}`;
}

export function FaucetButton({ assetAddress, userAddress }: FaucetButtonProps) {
    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const handleMint = () => {
        console.log("💧 Faucet Request:", { assetAddress, userAddress });
        if (!userAddress) return;

        writeContract({
            address: assetAddress,
            abi: CONTRACTS.MockUSDC.abi,
            functionName: 'mint',
            args: [userAddress, parseUnits('1000', 18)], // Mint 1000 mUSDC
        }, {
            onError: (err) => console.error("Mint Error Details:", err)
        });
    };

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({ hash });

    return (
        <div className="flex flex-col gap-1">
            <Button
                onClick={handleMint}
                disabled={isPending || isConfirming || !userAddress}
                className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono text-xs h-9 px-3 gap-2"
            >
                {isPending || isConfirming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Droplets className="w-4 h-4" />
                )}
                MINT $1,000
            </Button>
            {isConfirmed && <p className="text-[10px] text-emerald-400 font-mono text-center animate-pulse">Tokens Received!</p>}
            {error && <p className="text-[10px] text-red-400 font-mono text-center">Error: {error.message.slice(0, 20)}...</p>}
        </div>
    );
}
