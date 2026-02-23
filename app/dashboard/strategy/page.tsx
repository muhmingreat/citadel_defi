'use client';

import { useCitadelData } from '@/hooks/useCitadelData';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { StrategyEngine } from '@/components/citadel/strategy-engine';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {useEffect   } from 'react'

export default function StrategyPage() {
    const router = useRouter();
    const { isConnected, status } = useAccount();
    const {
        mode,
        anchorAllocation,
        growthAllocation,
        refetch,
        isLoading
    } = useCitadelData();

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 font-mono tracking-tight">Strategy Command</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage vault allocations and yield generation engines.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => refetch()}
                        className="h-9 w-9 text-slate-500 hover:text-slate-300"
                    >
                        <Loader2 className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <StrategyEngine
                        mode={mode}
                        asterDexAllocation={anchorAllocation}
                        pancakeSwapAllocation={growthAllocation}
                        onAction={() => refetch()}
                    />

                    {/* Future: Yield History Chart Placeholders */}
                    <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50">
                        <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Yield Performance</h3>
                        <div className="h-48 flex items-center justify-center text-slate-600 font-mono text-xs border-2 border-dashed border-slate-800 rounded-lg">
                            [Yield Chart Visualization]
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                        <h3 className="text-emerald-400 font-bold mb-2">Active Protocols</h3>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex justify-between">
                                <span>AsterDEX (Starknet)</span>
                                <span className="font-mono text-emerald-400">Active</span>
                            </li>
                            <li className="flex justify-between">
                                <span>PancakeSwap (BSC)</span>
                                <span className="font-mono text-emerald-400">Active</span>
                            </li>
                            <li className="flex justify-between opacity-50">
                                <span>Venus (Lending)</span>
                                <span className="font-mono">Standby</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-5 rounded-xl border border-slate-700 bg-slate-800/30">
                        <h3 className="text-slate-200 font-bold mb-2">Strategy Details</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            The underlying Cross-Chain Asset Manager (CCAM) automatically rebalances liquidity between stable growth pools on Starknet and high-yield farms on BSC based on the Volatility Oracle's risk score.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
