'use client';

import { motion } from 'framer-motion';
import { ArrowDown, CheckCircle2, Link2, LineChart, Shield, RefreshCw, Zap } from 'lucide-react';

const steps = [
  {
    icon: Link2,
    title: 'Initialize Link',
    description: 'Connect your Web3 credentials via our high-fidelity, non-custodial interface.',
    color: 'indigo'
  },
  {
    icon: LineChart,
    title: 'Deploy Assets',
    description: 'Transfer USDC into the protocol. Your capital instantly enters the defensive strategy engine.',
    color: 'emerald'
  },
  {
    icon: Shield,
    title: 'Activate Fortress',
    description: 'Our volatility oracle immediately begins monitoring market stress signals for your capital.',
    color: 'amber'
  },
  {
    icon: RefreshCw,
    title: 'Auto-Adapt',
    description: 'During market panic, the vault autonomously shifts into 100% AsterDEX defense mode.',
    color: 'indigo'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden border-y border-slate-900/50">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-slate-950/40 -z-10" />
      <div className="absolute -bottom-[20%] right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-white tracking-tighter"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            PROTOCOL <span className="bg-gradient-to-r from-emerald-400 to-indigo-500 bg-clip-text text-transparent">FLOW</span>
          </motion.h2>
          <div className="h-0.5 w-32 bg-slate-800 mx-auto rounded-full" />
        </div>

        {/* Steps: Detailed Kinetic Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[2.75rem] left-[15%] right-[15%] h-[1px] bg-slate-800 border-t border-dashed border-slate-700/50 -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="relative group text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
              >
                {/* Step Circle */}
                <div className="flex justify-center mb-8">
                  <div className={`relative w-24 h-24 rounded-3xl glass-card flex items-center justify-center border-slate-800 group-hover:border-${step.color}-500/50 transition-all duration-500 group-hover:scale-110 shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]`}>
                    <div className={`absolute inset-0 bg-${step.color}-500/5 blur-xl group-hover:bg-${step.color}-500/10 transition-all`} />
                    <Icon className={`w-10 h-10 ${step.color === 'emerald' ? 'text-emerald-400' : step.color === 'amber' ? 'text-amber-400' : 'text-indigo-400'}`} />

                    {/* Index Badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full glass-panel border-slate-700 flex items-center justify-center text-[10px] font-mono font-black text-slate-300">
                      0{index + 1}
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-glow transition-all">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed px-4 group-hover:text-slate-400 transition-colors">
                  {step.description}
                </p>

                {/* Arrow Decor (Mobile/Tablet) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center mt-8">
                    <ArrowDown className="w-5 h-5 text-slate-800 animate-bounce" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Final Affirmation */}
        <motion.div
          className="mt-32 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-10 sm:p-16 rounded-[3rem] text-center border-white/5 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-[100%] bg-gradient-to-tr from-emerald-500/10 via-indigo-500/5 to-purple-500/10 group-hover:rotate-12 transition-transform duration-[10000ms] -z-10" />

            <motion.div
              className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 glow-emerald border border-emerald-500/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </motion.div>

            <h3 className="text-2xl sm:text-4xl font-black text-white mb-6 leading-none">
              READY TO <span className="text-glow">INITIATE?</span>
            </h3>
            <p className="text-slate-400 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Join the future of autonomous capital defense. Your citadel is waiting for its high-command.
            </p>

            <button className="btn-premium group px-12 py-4 text-lg">
              Launch Interface
              <Zap className="w-5 h-5 ml-2 fill-current" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
