'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Shuffle, BrainCircuit, Activity, Settings, LogOut, ShieldCheck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useDisconnect } from 'wagmi';

const navItems = [
    {
        name: 'Overview',
        href: '/dashboard',
        icon: LayoutDashboard,
        color: 'text-sky-400',
        activeBg: 'bg-sky-500/10',
        activeBorder: 'border-sky-500/50'
    },
    {
        name: 'Strategy Engine',
        href: '/dashboard/strategy',
        icon: Shuffle,
        color: 'text-emerald-400',
        activeBg: 'bg-emerald-500/10',
        activeBorder: 'border-emerald-500/50'
    },
    {
        name: 'Intelligence',
        href: '/dashboard/intelligence',
        icon: BrainCircuit,
        color: 'text-indigo-400',
        activeBg: 'bg-indigo-500/10',
        activeBorder: 'border-indigo-500/50'
    },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const { disconnect } = useDisconnect();

    return (
        <div className="flex flex-col h-full w-72 md:flex hidden relative group">
            {/* Glassmorphic Background Layer */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/60 transition-all duration-500" />

            {/* Content */}
            <div className="relative flex flex-col h-full z-10">

                {/* Header Logo Area */}
                <div className="p-8 pb-10">
                    <Link href="/" className="flex items-center gap-3 group/logo cursor-pointer">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover/logo:shadow-indigo-500/40 transition-all duration-300 group-hover/logo:scale-105">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-mono font-bold text-xl text-slate-100 tracking-wider leading-none group-hover/logo:text-white transition-colors">CITADEL</span>
                            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-1 group-hover/logo:text-indigo-400 transition-colors">Protocol v1.0</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 px-4 space-y-2">
                    <p className="px-4 text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">Command Center</p>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                        isActive
                                            ? cn("border", item.activeBg, item.activeBorder)
                                            : "hover:bg-slate-800/30 hover:text-slate-200 text-slate-400 border border-transparent hover:border-slate-700/50"
                                    )}
                                >
                                    {/* Active Glow Indicator */}
                                    {isActive && (
                                        <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-current to-transparent opacity-50", item.color)} />
                                    )}

                                    <item.icon className={cn("w-5 h-5 transition-all duration-300",
                                        isActive ? cn(item.color, "drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]") : "group-hover:scale-110"
                                    )} />

                                    <span className={cn("font-medium text-sm tracking-wide", isActive ? "text-slate-100" : "")}>
                                        {item.name}
                                    </span>

                                    {isActive && (
                                        <div className={cn("ml-auto w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] animate-pulse", item.color.replace('text-', 'bg-'))} />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer actions */}
                <div className="p-6 mt-auto">
                    <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-slate-400 font-mono">System Status</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500/50 w-[98%] rounded-full" />
                        </div>
                    </div>

                    <Link href="/" className="block w-full mb-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50 transition-all gap-3"
                        >
                            <Home className="w-4 h-4" />
                            <span className="font-mono text-xs uppercase tracking-wider">Back to Home</span>
                        </Button>
                    </Link>

                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 border border-transparent transition-all gap-3"
                        onClick={() => disconnect()}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="font-mono text-xs uppercase tracking-wider">Disconnect</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Mobile Bottom Nav
export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/60 p-2 md:hidden flex justify-around z-50 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link key={item.href} href={item.href} className="flex-1">
                        <div className={cn(
                            "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                            isActive ? "bg-slate-800/50" : ""
                        )}>
                            <div className={cn("relative p-1.5 rounded-lg transition-all", isActive ? item.activeBg : "")}>
                                <item.icon className={cn("w-5 h-5", isActive ? item.color : "text-slate-500")} />
                                {isActive && <div className={cn("absolute inset-0 blur-lg opacity-20", item.activeBg)} />}
                            </div>
                            <span className={cn("text-[10px] font-medium transition-colors", isActive ? "text-slate-200" : "text-slate-600")}>
                                {item.name}
                            </span>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

