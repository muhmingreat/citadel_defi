'use client';

import { Shield, Activity, Zap, Cpu, Info, AlertTriangle, Terminal, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface SentinelPanelProps {
    volatility: number;
    mode: 'growth' | 'fortress';
    onSimulateVol?: (value: number) => void;
    onTriggerAdapt?: () => void;
    onOpenIntelligence?: () => void;
    onQuery?: (query: string) => void;
    briefing?: string;
    telemetry?: { sync: string, logic: string, response: string, neuralWeight?: string };
    isThinking?: boolean;
    isUpdating?: boolean;
}

export function SentinelPanel({
    volatility,
    mode,
    onSimulateVol,
    onTriggerAdapt,
    onOpenIntelligence,
    onQuery,
    briefing,
    telemetry: propTelemetry,
    isThinking,
    isUpdating
}: SentinelPanelProps) {
    const [showAIHelp, setShowAIHelp] = useState(false);
    const [typedBriefing, setTypedBriefing] = useState<string>("Initializing Neural Core...");
    const [isTyping, setIsTyping] = useState(false);
    const [query, setQuery] = useState("");
    const briefingInterval = useRef<NodeJS.Timeout | null>(null);

    const typeEffect = (text: string) => {
        setIsTyping(true);
        let i = 0;
        setTypedBriefing("");
        if (briefingInterval.current) clearInterval(briefingInterval.current);

        briefingInterval.current = setInterval(() => {
            setTypedBriefing((prev) => prev + text.charAt(i));
            i++;
            if (i >= text.length) {
                if (briefingInterval.current) clearInterval(briefingInterval.current);
                setIsTyping(false);
            }
        }, 30);
    };

    useEffect(() => {
        if (briefing) {
            typeEffect(briefing);
        }
        return () => { if (briefingInterval.current) clearInterval(briefingInterval.current); };
    }, [briefing]);

    const handleQuery = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || !onQuery) return;
        onQuery(query);
        setQuery("");
    };

    return (
        <div className="card-citadel p-0 border-indigo-500/30 bg-slate-900/40 relative flex flex-col h-full min-h-[350px]">
            {/* Neural Background Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden rounded-2xl">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <pattern id="neural-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" className="text-indigo-500" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#neural-grid)" />
                </svg>
                <motion.div
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10"
                />
            </div>

            {/* Left Column: Sentinel Monitoring */}
            <div className="w-full p-6 sm:p-8 relative border-b border-slate-800/50 flex flex-col justify-between z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                                <BrainCircuit className="w-6 h-6 text-indigo-400" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-mono font-bold text-white tracking-tight uppercase">
                                Sentinel AI Command
                            </h3>
                            <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.2em] font-medium">
                                High-Frequency Protocol Guardian
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onOpenIntelligence}
                            className="text-slate-500 hover:text-indigo-400 group relative z-10"
                        >
                            <BrainCircuit className="w-4 h-4 mr-2" />
                            <span className="text-[10px] uppercase font-mono tracking-wider">AI Console</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAIHelp(!showAIHelp)}
                            className="text-slate-500 hover:text-white group relative z-10"
                        >
                            <Info className="w-4 h-4 mr-2" />
                            <span className="text-[10px] uppercase font-mono tracking-wider">Help</span>
                        </Button>
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    {/* AI Output Terminal */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 font-mono text-xs leading-relaxed relative group min-h-[140px]">
                        <div className="absolute top-3 right-3 flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                        </div>
                        <p className="text-indigo-400/60 mb-2 select-none flex items-center gap-2">
                            <Terminal className="w-3 h-3" /> SENTINEL_DIAGNOSTIC_v1.0.4
                        </p>
                        <motion.div
                            key={typedBriefing}
                            className="text-indigo-100 min-h-[60px]"
                        >
                            {typedBriefing}
                            {isTyping && <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1 align-middle" />}
                        </motion.div>

                        <div className="mt-4 pt-4 border-t border-slate-800/50 flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest text-slate-500">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                <span>Sync: {propTelemetry?.sync || "..."}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-3 h-3 text-indigo-400" />
                                <span>Logic: {propTelemetry?.logic || "..."}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-amber-400" />
                                <span>Response: {propTelemetry?.response || "..."}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu className="w-3 h-3 text-purple-400" />
                                <span>Weight: {propTelemetry?.neuralWeight || "0.90"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Query Input */}
                    <form onSubmit={handleQuery} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Query Sentinel Neural Core..."
                            disabled={isThinking}
                            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 pl-10 text-xs font-mono text-indigo-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
                        />
                        <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        {isThinking && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                            </div>
                        )}
                    </form>

                    <AnimatePresence>
                        {showAIHelp && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[11px] leading-relaxed text-slate-400">
                                    <p className="mb-2 font-bold text-indigo-300">SYSTEM OVERVIEW:</p>
                                    <ul className="space-y-2 list-disc pl-4">
                                        <li><span className="text-white">VOLATILITY ORACLE:</span> Monitoring global market turbulence. Values {">"}65 indicate high risk.</li>
                                        <li><span className="text-white">AUTONOMOUS ADAPT:</span> When risk is high, the Sentinel Bot automatically moves your funds into the safety of the AsterDEX Anchor.</li>
                                        <li><span className="text-white">GROWTH OPTIMIZATION:</span> In stable markets, we "Stack" yield across PancakeSwap and AsterDEX for max APY.</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Column: Testing Parameters */}
            <div className="w-full p-6 sm:p-8 bg-slate-900/60 relative flex flex-col z-10">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-indigo-500" />
                        Laboratory
                    </h4>
                    <div className="flex gap-1.5 opacity-50">
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    </div>
                </div>

                <div className="space-y-6 flex-1 flex flex-col">
                    <div className="p-5 rounded-xl bg-slate-950/40 border border-slate-800/60 shadow-inner">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <label className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">Stress Simulation</label>
                            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${volatility > 65 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                {volatility}% VOL
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={() => onSimulateVol?.(25)}
                                variant="outline"
                                className="h-9 font-mono text-[10px] sm:text-xs border-slate-700 bg-slate-800/40 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-400 transition-all uppercase tracking-wider justify-start px-4"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500/50 " />
                                Stable (25%)
                            </Button>
                            <Button
                                onClick={() => onSimulateVol?.(80)}
                                variant="outline"
                                className="h-9 font-mono text-[10px] sm:text-xs border-slate-700 bg-slate-800/40 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all uppercase tracking-wider justify-start px-4"
                            >
                                <span className="w-2 h-2 rounded-full bg-red-500/50 mr-2" />
                                Panic (80%)
                            </Button>
                        </div>
                    </div>

                    <div className="">
                        <div className="group relative">
                            {/* Connecting Line Effect */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-slate-800 to-transparent opacity-50"></div>

                            <div className="p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 relative overflow-hidden transition-colors hover:bg-indigo-500/10 hover:border-indigo-500/20">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-xs font-mono font-medium text-indigo-300 uppercase tracking-wider">Manual Override</label>
                                    {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
                                </div>
                                <Button
                                    onClick={onTriggerAdapt}
                                    disabled={isUpdating}
                                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 font-mono text-xs font-bold tracking-widest shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/30 group-hover:scale-[1.02] transition-all duration-300 border border-indigo-400/20 truncate"
                                >
                                    <Zap className="w-3.5 h-3.5 mr-2 inline-block" />
                                    TRIGGER ADAPT()
                                </Button>
                                <div className="flex items-center justify-center gap-2 mt-4 opacity-50 group-hover:opacity-80 transition-opacity">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                    <p className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest overflow-hidden text-ellipsis whitespace-nowrap">
                                        Auto-Scan: 15s INT
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
