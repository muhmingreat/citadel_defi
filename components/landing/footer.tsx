'use client';

import { motion } from 'framer-motion';
import { CitadelLogo } from '@/components/ui/citadel-logo';
import { Twitter, Github, MessageSquare, ExternalLink, Shield } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-indigo-500/5 blur-[120px] -z-10" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">

          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <CitadelLogo className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-black tracking-tighter text-white uppercase">
                Citadel
              </span>
            </Link>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
              The world&apos;s most advanced autonomous yield engine. Protecting capital with on-chain risk intelligence since 2024.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, MessageSquare].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl glass-panel border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links: Protocol */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Protocol</h4>
            <ul className="space-y-4">
              {['Intelligence', 'Strategies', 'Governance', 'Security'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    {link}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Resources */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'Brand Assets', 'Audit Report', 'Risk Paper'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Badge */}
          <div className="lg:col-span-3">
            <div className="glass-card p-6 rounded-2xl border-emerald-500/20 shadow-[0_0_30px_-10px_rgba(16,185,129,0.1)] group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:glow-emerald transition-all">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-tight">Vulnerability Immune</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Citadel is built on an immutable core, with formal verification of all rebalancing logic.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs font-mono text-slate-600 font-bold uppercase tracking-widest">
            © {currentYear} Citadel Autonomous Protocol
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-mono font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">Privacy</Link>
            <Link href="#" className="text-[10px] font-mono font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">Terms</Link>
            <Link href="#" className="text-[10px] font-mono font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
