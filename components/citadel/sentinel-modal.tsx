'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, BrainCircuit, Activity, Zap, X, Terminal, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SentinelModalProps {
    isOpen: boolean;
    onClose: () => void;
    volatility: number;
    mode: 'growth' | 'fortress';
    briefing?: string;
    rationale?: string;
    telemetry?: { sync: string; logic: string; response: string };
}

export function SentinelModal({ isOpen, onClose, volatility, mode, briefing, rationale, telemetry }: SentinelModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-4xl bg-slate-900 border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)] flex flex-col md:flex-row min-h-[500px]"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors z-10"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Left Column: Visual & Status (40%) */}
                    <div className="w-full md:w-[40%] bg-indigo-600/5 p-8 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col items-center justify-center relative">
                        <div className="absolute inset-0 pointer-events-none opacity-10">
                            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--citadel-indigo)_0%,_transparent_70%)]" />
                        </div>

                        <div className="relative mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                className="w-32 h-32 rounded-full border-2 border-indigo-500/20 border-t-indigo-500/60"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BrainCircuit className="w-12 h-12 text-indigo-400 animate-pulse" />
                            </div>
                        </div>

                        <h2 className="text-xl font-mono font-bold text-white uppercase tracking-wider text-center mb-2">
                            Sentinel Prime
                        </h2>
                        <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-[0.3em] mb-8">
                            AI Diagnostic Core
                        </p>

                        <div className="space-y-3 w-full">
                            <StatusItem label="Neutral Status" value="Healthy" icon={<HeartPulse className="w-3 h-3 text-emerald-400" />} />
                            <StatusItem label="Market Sync" value={telemetry?.sync || "Real-time"} icon={<Activity className="w-3 h-3 text-indigo-400" />} />
                            <StatusItem label="Logic Sync" value={telemetry?.logic || "Verified"} icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />} />
                        </div>
                    </div>

                    {/* Right Column: Deep Intel & Logic (60%) */}
                    <div className="flex-1 p-8 overflow-y-auto max-h-[80vh] md:max-h-none">
                        <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">
                            Intelligence Stream
                        </h3>

                        <div className="space-y-8">
                            {/* Protocol Explanation */}
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-3 text-sm font-mono text-indigo-300 font-bold uppercase">
                                    <Terminal className="w-4 h-4" /> Autonomous Logic Trace
                                </h4>
                                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 font-mono text-xs leading-relaxed">
                                    <p className="text-slate-400 mb-4 italic">{"// Current state analysis"}</p>
                                    <p className="text-emerald-500 uppercase">{"Vol Index: " + volatility + "%"}</p>
                                    <p className={`mt-1 uppercase ${mode === 'growth' ? 'text-indigo-400' : 'text-red-400'}`}>
                                        {"Status: " + mode.toUpperCase()}
                                    </p>
                                    <p className="mt-4 text-slate-300">
                                        {briefing || (volatility > 65
                                            ? "> CRITICAL RISK DETECTED. The Sentinel has neutralized yield stacking to prioritize capital preservation in the AsterDEX Anchor."
                                            : "> OPTIMAL CONDITIONS. The Sentinel is currently compounding yields across AsterDEX and PancakeSwap.")}
                                    </p>
                                    {rationale && (
                                        <div className="mt-4 pt-4 border-t border-slate-900">
                                            <p className="text-indigo-400/80 leading-relaxed italic">
                                                {"Rationale: " + rationale}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Educational Section */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-mono text-indigo-300 font-bold uppercase flex items-center gap-3">
                                    <Zap className="w-4 h-4" /> Tactical Walkthrough
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <StepItem
                                        title="Phase 1: Ingestion"
                                        desc="The Sentinel reads real-time volatility from our on-chain VolatilityOracle."
                                    />
                                    <StepItem
                                        title="Phase 2: Decision"
                                        desc="If volatility > 65%, the bot triggers an emergency 'adapt()' call to fortress mode."
                                    />
                                    <StepItem
                                        title="Phase 3: Allocation"
                                        desc="Funds are re-routed between safety anchors and high-yield stackers."
                                    />
                                    <StepItem
                                        title="Phase 4: Recovery"
                                        desc="When volatility drops < 45%, the bot restores the Growth posture."
                                    />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-800 flex justify-between items-center">
                                <p className="text-[10px] font-mono text-slate-500 italic uppercase">
                                    Sentinel Bot v1.0.4 | 100% Autonomous
                                </p>
                                <Button onClick={onClose} variant="ghost" className="text-indigo-400 font-mono text-xs">
                                    CLOSE CONSOLE <ArrowRight className="w-3 h-3 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function StatusItem({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <div className="flex items-center gap-2">
                {icon}
                <span className="text-[10px] font-mono text-slate-500 uppercase">{label}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-200 uppercase">{value}</span>
        </div>
    );
}

function StepItem({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-900">
            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">{title}</p>
            <p className="text-[11px] text-slate-500 leading-snug">{desc}</p>
        </div>
    )
}
