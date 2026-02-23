'use client';

import { motion } from 'framer-motion';
import { BarChart3, Zap, Lock, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';
import { CitadelLogo } from '@/components/ui/citadel-logo';

const features = [
  {
    icon: CitadelLogo,
    title: 'Autonomous Defense',
    description: 'Real-time risk assessment and automatic rebalancing to protect your capital during market volatility.',
    color: 'emerald',
    delay: 0.1
  },
  {
    icon: BarChart3,
    title: 'Multi-Strategy Allocation',
    description: 'Intelligent capital deployment across AsterDEX and PancakeSwap for optimal risk-adjusted returns.',
    color: 'indigo',
    delay: 0.2
  },
  {
    icon: Zap,
    title: 'Lightning Execution',
    description: 'Sub-second rebalancing and execution on automated triggers with zero slippage optimization.',
    color: 'amber',
    delay: 0.3
  },
  {
    icon: Lock,
    title: 'Enhanced Security',
    description: 'Non-custodial, smart contract audited, with multi-signature vault protection and insurance coverage.',
    color: 'indigo',
    delay: 0.4
  },
  {
    icon: TrendingUp,
    title: 'Yield Optimization',
    description: 'Growth mode maximizes yields across strategies, Fortress mode prioritizes capital preservation.',
    color: 'emerald',
    delay: 0.5
  },
  {
    icon: ShieldCheck,
    title: 'Risk Intelligence',
    description: 'Advanced volatility metrics, oracle integration, and predictive risk modeling in real-time.',
    color: 'indigo',
    delay: 0.6
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-indigo-500/5 blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-white tracking-tight">
              ADVANCED <span className="text-indigo-500">INTELLIGENCE</span>
            </h2>
            <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full mb-8 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Purpose-built for mission-critical DeFi operations with institutional-grade risk management.
            </p>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: feature.delay, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className="card-citadel p-8 group border-slate-800/40"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${feature.color}-500/5 blur-3xl -z-10 group-hover:bg-${feature.color}-500/10 transition-all`} />

                {/* Icon Container with Glow */}
                <div className="relative mb-8">
                  <div className={`absolute inset-0 bg-${feature.color}-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center glass-panel border-${feature.color}-500/20 group-hover:border-${feature.color}-500/50 transition-all duration-300`}>
                    <Icon className={`w-7 h-7 ${feature.color === 'emerald' ? 'text-emerald-400' : feature.color === 'amber' ? 'text-amber-400' : 'text-indigo-400'}`} />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-glow transition-all">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed font-medium">
                  {feature.description}
                </p>

                {/* Learn More link (aesthetic) */}
                <div className="mt-8 flex items-center gap-2 text-slate-500 group-hover:text-indigo-400 transition-colors text-xs font-mono font-bold uppercase tracking-widest">
                  EXPLORE INTERFACE
                  <Zap className="w-3 h-3 fill-current" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
