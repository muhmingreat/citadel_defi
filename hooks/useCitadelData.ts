import { useReadContract, useAccount, usePublicClient } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { formatUnits, parseAbiItem } from 'viem';
import { useState, useEffect, useRef, useCallback } from 'react';

// Hard deadline helper
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
    Promise.race([
        promise,
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
        ),
    ]);

export function useCitadelData() {
    const { address } = useAccount();
    const zeroAddr = (address || '0x0000000000000000000000000000000000000000') as `0x${string}`;

    // Common query config: 30s polling, long cache
    const queryConfig = {
        refetchInterval: 30_000,
        staleTime: 10_000,
        retry: 2,
    };

    // 1. Core State
    const { data: totalAssets, status: s0, refetch: r0 } = useReadContract({
        ...CONTRACTS.CitadelVault, functionName: 'totalAssets', query: queryConfig
    });
    const { data: currentMode, status: s1, refetch: r1 } = useReadContract({
        ...CONTRACTS.CitadelVault, functionName: 'currentMode', query: queryConfig
    });
    const { data: volatilityVal, status: s2, refetch: r2 } = useReadContract({
        ...CONTRACTS.VolatilityOracle, functionName: 'volatility', query: queryConfig
    });

    // 2. Balances
    const { data: vaultBalance, status: s3, refetch: r3 } = useReadContract({
        ...CONTRACTS.CitadelVault, functionName: 'balanceOf', args: [zeroAddr], query: queryConfig
    });
    const { data: walletBalance, status: s4, refetch: r4 } = useReadContract({
        ...CONTRACTS.MockUSDC, functionName: 'balanceOf', args: [zeroAddr], query: queryConfig
    });

    // 3. APY & Strategy
    const { data: netAPYRaw, status: s5, refetch: r5 } = useReadContract({
        ...CONTRACTS.StrategyManager, functionName: 'getNetAPY', query: queryConfig
    });
    const { data: anchorYieldRaw, status: s6, refetch: r6 } = useReadContract({
        ...CONTRACTS.AsterDEXStrategy, functionName: 'yieldRate', query: queryConfig
    });
    const { data: growthYieldRaw, status: s7, refetch: r7 } = useReadContract({
        ...CONTRACTS.PancakeStrategy, functionName: 'yieldRate', query: queryConfig
    });

    // ─── Data Extraction ───
    const val = (d: any) => (d !== undefined && d !== null ? d : undefined);

    const tvl = val(totalAssets) !== undefined ? parseFloat(formatUnits(totalAssets as bigint, 18)) : 0;
    const mode: 'growth' | 'fortress' = val(currentMode) !== undefined ? (Number(currentMode) === 0 ? 'growth' : 'fortress') : 'fortress';
    const volatility = val(volatilityVal) !== undefined ? Number(volatilityVal) : 50;
    const userVaultBalance = val(vaultBalance) !== undefined ? parseFloat(formatUnits(vaultBalance as bigint, 18)) : 0;
    const userAssetBalance = val(walletBalance) !== undefined ? parseFloat(formatUnits(walletBalance as bigint, 18)) : 0;

    // Strategy defaults
    const anchorAllocation = 60;
    const growthAllocation = 40;

    const netAPY = val(netAPYRaw) !== undefined ? Number(netAPYRaw) / 100 : 17.7;
    const anchorYield = val(anchorYieldRaw) !== undefined ? Number(anchorYieldRaw) / 100 : 5.2;
    const boosterYield = val(growthYieldRaw) !== undefined ? Number(growthYieldRaw) / 100 : 12.5;

    const isLoading = [s0, s1, s2, s3, s4].some(s => s === 'pending');
    const isError = [s0, s1, s2, s3, s4].some(s => s === 'error');

    // ─── History (non-critical) ───
    const publicClient = usePublicClient();
    const [historicalLogs, setHistoricalLogs] = useState<any[]>(() => {
        // Load from localStorage on initial mount
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('citadel_activity_logs');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Ensure timestamps are properly converted
                    return parsed.map((log: any) => ({
                        ...log,
                        timestamp: typeof log.timestamp === 'number' ? log.timestamp : Math.floor(Date.now() / 1000)
                    }));
                }
            } catch (e) {
                console.warn('Failed to load saved logs:', e);
                // Clear corrupted data
                localStorage.removeItem('citadel_activity_logs');
            }
        }
        return [];
    });
    const hasFetched = useRef(false);

    const fetchHistory = useCallback(async () => {
        if (!publicClient || hasFetched.current) return;
        hasFetched.current = true;
        try {
            await withTimeout((async () => {
                const currentBlock = await publicClient.getBlockNumber();
                const fromBlock = currentBlock - BigInt(10000);
                const safeGetLogs = (p: any) => publicClient.getLogs(p).catch(() => []);

                const [modeLogs, volLogs, depositLogs, withdrawLogs] = await Promise.all([
                    safeGetLogs({ address: CONTRACTS.CitadelVault.address, event: parseAbiItem('event ModeChanged(uint8 newMode, uint256 triggerVolatility)'), fromBlock, toBlock: 'latest' }),
                    safeGetLogs({ address: CONTRACTS.VolatilityOracle.address, event: parseAbiItem('event VolatilityUpdated(uint256 newValue, uint256 timestamp)'), fromBlock, toBlock: 'latest' }),
                    safeGetLogs({ address: CONTRACTS.CitadelVault.address, event: parseAbiItem('event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)'), fromBlock, toBlock: 'latest' }),
                    safeGetLogs({ address: CONTRACTS.CitadelVault.address, event: parseAbiItem('event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)'), fromBlock, toBlock: 'latest' }),
                ]);

                const newLogs = [...modeLogs.map(l => ({ ...l, type: 'mode' })), ...volLogs.map(l => ({ ...l, type: 'volatility' })), ...depositLogs.map(l => ({ ...l, type: 'deposit' })), ...withdrawLogs.map(l => ({ ...l, type: 'withdraw' }))]
                    .sort((a, b) => Number(BigInt(b.blockNumber || 0) - BigInt(a.blockNumber || 0)))
                    .map(l => ({ ...l, timestamp: Math.floor(Date.now() / 1000 - Number(currentBlock - (l.blockNumber || currentBlock)) * 3) }));

                setHistoricalLogs(prev => {
                    // Merge with existing logs, avoiding duplicates
                    const existingIds = new Set(prev.map(l => `${l.transactionHash}-${l.logIndex}`));
                    const uniqueNewLogs = newLogs.filter(l => !existingIds.has(`${l.transactionHash}-${l.logIndex}`));
                    
                    // If no new logs, don't update state
                    if (uniqueNewLogs.length === 0) return prev;
                    
                    const merged = [...uniqueNewLogs, ...prev]
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, 50); // Keep last 50 logs
                    
                    // Save to localStorage
                    if (typeof window !== 'undefined') {
                        try {
                            localStorage.setItem('citadel_activity_logs', JSON.stringify(merged));
                        } catch (e) {
                            console.warn('Failed to save logs:', e);
                        }
                    }
                    
                    return merged;
                });
            })(), 30_000);
        } catch (e: any) {
            console.warn('⚠️ History fetch skipped:', e.message);
        }
    }, [publicClient]);

    // Debug sync
    useEffect(() => {
        if (totalAssets !== undefined || walletBalance !== undefined) {
            console.log("📝 Citadel Data Sync:", {
                tvl: tvl.toString(),
                userAsset: userAssetBalance.toString(),
                mode,
                address: zeroAddr
            });
        }
    }, [totalAssets, walletBalance, tvl, userAssetBalance, mode, zeroAddr]);

    useEffect(() => {
        if (publicClient && !hasFetched.current) {
            fetchHistory();
        }
    }, [publicClient, fetchHistory]);

    // Memoize refetch to prevent infinite loops in components using this hook
    const refetch = useCallback(() => {
        console.log("🔄 Refetching Citadel data...");
        r0(); r1(); r2(); r3(); r4(); r5(); r6(); r7();
        hasFetched.current = false;
    }, [r0, r1, r2, r3, r4, r5, r6, r7]);

    return {
        tvl, mode, volatility, userVaultBalance, userAssetBalance,
        anchorAllocation, growthAllocation, netAPY, anchorYield, boosterYield,
        historicalLogs: historicalLogs.map(l => ({ ...l, blockDate: new Date(l.timestamp * 1000) })),
        isLoading, isError,
        refetch,
        CONTRACTS,
    };
}
