'use client';

import { useState, useEffect } from 'react';
import { useCitadelData } from '@/hooks/useCitadelData';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { SentinelPanel } from '@/components/citadel/sentinel-panel';
import { ActivityLog } from '@/components/citadel/activity-log';
import { Button } from '@/components/ui/button';
import { Loader2, Terminal, ArrowRight } from 'lucide-react';
import { formatUnits } from 'viem';
import Link from 'next/link';

interface LogEntry {
    id: string;
    timestamp: Date;
    type: 'success' | 'warning' | 'info' | 'alert';
    message: string;
    details?: string;
}

export default function IntelligencePage() {
    const router = useRouter();
    const { isConnected, status } = useAccount();
    const {
        volatility,
        mode,
        isLoading,
        refetch,
        CONTRACTS,
        historicalLogs,
        writeContract: write
    } = useCitadelData(); // We know writeContract isn't returned by hook but available via wagmi, simplified access for now

    // Re-implementing log logic locally for this page as it's the main view for logs
    // ideally this should be in a global context but for this refactor we keep it here
    const [logEntries, setLogEntries] = useState<LogEntry[]>(() => {
        // Load from localStorage on initial mount
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('citadel_intelligence_logs');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Ensure timestamps are proper Date objects
                    return parsed.map((entry: any) => ({
                        ...entry,
                        timestamp: entry.timestamp ? new Date(entry.timestamp) : new Date()
                    }));
                }
            } catch (e) {
                console.warn('Failed to load intelligence logs:', e);
                // Clear corrupted data
                localStorage.removeItem('citadel_intelligence_logs');
            }
        }
        return [];
    });
    const [aiBriefing, setAiBriefing] = useState<string>("Initializing Neural Core...");
    const [aiRationale, setAiRationale] = useState<string>("");
    const [aiTelemetry, setAiTelemetry] = useState({ sync: "...", logic: "...", response: "...", neuralWeight: "..." });
    const [isAiThinking, setIsAiThinking] = useState(false);

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

    // Sync historical logs (Duplicate logic from old dashboard - in real app move to Context)
    useEffect(() => {
        if (historicalLogs.length > 0) {
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

            setLogEntries(prev => {
                const existingIds = new Set(prev.map(l => l.id));
                const newLogs = formatted.filter(l => !existingIds.has(l.id));
                if (newLogs.length === 0) return prev;
                const updated = [...newLogs, ...prev].slice(0, 50); // Keep more logs here
                
                // Save to localStorage for persistence
                if (typeof window !== 'undefined') {
                    try {
                        localStorage.setItem('citadel_intelligence_logs', JSON.stringify(updated));
                    } catch (e) {
                        console.warn('Failed to save intelligence logs:', e);
                    }
                }
                
                return updated;
            });
        }
    }, [historicalLogs]);

    const fetchAiBriefing = async (query?: string) => {
        setIsAiThinking(true);
        try {
            const res = await fetch('/api/sentinel/briefing', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volatility, mode, query })
            });
            const data = await res.json();
            if (data.briefing) {
                setAiBriefing(data.briefing);
                setAiRationale(data.rationale);
                setAiTelemetry(data.telemetry);
            }
        } catch (e) {
            console.error("AI Core Error:", e);
        } finally {
            setIsAiThinking(false);
        }
    };

    useEffect(() => {
        fetchAiBriefing();
    }, [volatility, mode]);


    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 font-mono tracking-tight flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-indigo-500" />
                        Citadel Intelligence
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Real-time neural monitoring and event log.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
                {/* Left: AI Panel */}
                <div className="flex flex-col h-full">
                    <SentinelPanel
                        volatility={volatility}
                        mode={mode}
                        // @ts-ignore - simplified for this view
                        onSimulateVol={() => { }}
                        // @ts-ignore
                        onTriggerAdapt={() => { }}
                        onOpenIntelligence={() => { }}
                        onQuery={fetchAiBriefing}
                        briefing={aiBriefing}
                        telemetry={aiTelemetry}
                        isThinking={isAiThinking}
                        isUpdating={isLoading}
                    />
                </div>

                {/* Right: Full Logs */}
                <div className="h-full overflow-hidden flex flex-col bg-slate-900/40 border border-slate-800 rounded-xl">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/60 font-mono text-sm text-slate-400">
                        System Event Stream
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <ActivityLog entries={logEntries} />
                    </div>
                </div>
            </div>
        </div>
    );
}
