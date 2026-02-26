"use client";

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroVisual } from '@/components/landing/hero-visual';
import { ArrowRight, ShieldCheck, Zap, BarChart3, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const y2 = useTransform(scrollY, [0, 500], [0, -100]); // Parallax for visual

  const handleLaunch = () => {
    router.push('/dashboard');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] }
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-20 px-4 sm:px-6 lg:px-8"
    >
      {/* 
        Dynamic Living Background 
      */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Atmospheric Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(15,23,42,0)_0%,_#0F172A_80%)] z-10" />

        {/* Animated Aurora - Much smaller and subtle */}
        <motion.div
          className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Grid Texture */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] bg-center z-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full py-10 lg:py-20 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center h-full">

          {/* 
            Left Content: The Narrative 
          */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center 
            lg:text-left space-y-8 lg:space-y-10"
            style={{ willChange: 'auto' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Status Indicator */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-1.5 glass-panel rounded-full border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] group hover:border-indigo-500/40 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-400 font-bold uppercase group-hover:text-emerald-300 transition-colors">
                Autonomous Engine Online
              </span>
            </motion.div>

            {/* Headline with Complex Gradient & Texture */}
            <motion.div variants={itemVariants} className="space-y-6 max-w-4xl">
              <h1 className="text-2xl sm:text-3xl lg:text-6xl font-bold leading-[0.9] tracking-tight text-white">
                DEFEND YOUR <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-emerald-200 to-indigo-300 bg-[length:200%_auto] animate-gradient-text">
                  DEFI CAPITAL
                </span>
              </h1>
              <p className="text-base sm:text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The world&apos;s first <span className="text-indigo-400 font-semibold">self-driving yield engine</span>. Powered by on chain volatility oracles. Always defensive, always optimizing.
              </p>
            </motion.div>

            {/* Kinetic CTA Controls */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
              {isConnected ? (
                <button
                  onClick={handleLaunch}
                  className="group relative px-8 py-4 bg-white text-slate-950 font-semibold text-lg rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 opacity-20 group-hover:opacity-40 blur-lg transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    Enter Command Center
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
                      className="group relative px-8 py-4 bg-white text-slate-950 font-semibold text-lg rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] min-w-[220px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500 opacity-20 group-hover:opacity-40 blur-lg transition-opacity" />
                      <span className="relative flex items-center justify-center gap-2">
                        Get Started
                        <Zap className="w-5 h-5 fill-current" />
                      </span>
                    </button>
                  )}
                </ConnectButton.Custom>
              )}

              <Link 
                href="/docs"
                className="px-8 py-4 text-slate-400 font-semibold hover:text-white rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-900/50 transition-all duration-300 flex items-center gap-2 group"
              >
                Documentation
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
              </Link>
            </motion.div>

            {/* Micro-Metrics Grid */}
            <motion.div
              variants={itemVariants}
              className="pt-10 border-t border-slate-800/50 flex flex-wrap justify-center lg:justify-start gap-12 sm:gap-16 w-full"
            >
              {[
                { label: 'TVL SECURED', value: '$25.4M', icon: ShieldCheck, color: 'text-indigo-400', glow: 'shadow-indigo-500/20' },
                { label: 'TARGET APY', value: '12.3%', icon: BarChart3, color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
                { label: 'BLOCK LATENCY', value: '<2.0s', icon: Zap, color: 'text-amber-400', glow: 'shadow-amber-500/20' },
              ].map((stat, i) => (
                <div key={i} className="group cursor-default relative">
                  <div className={`absolute -inset-4 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 ${stat.glow}`} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                      <p className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 uppercase tracking-widest leading-none group-hover:text-slate-300 transition-colors">
                        {stat.label}
                      </p>
                    </div>
                    <p className="text-2xl sm:text-4xl font-mono font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* 
            Right Content: The Kinetic Visual 
          */}
          <motion.div
            style={{ y: y2 }}
            className="lg:col-span-5 relative w-full flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className="relative z-10 w-full max-w-[500px] lg:max-w-none">
              <HeroVisual />
            </div>

            {/* Ambient Background Bloom behind visual */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-indigo-500/5 rounded-full -z-10" />
          </motion.div>
        </div>
      </div>

      {/* 
        Scroll Indicator Shadow 
      */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        style={{ opacity: useTransform(scrollY, [0, 100], [0.5, 0]) }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] font-bold">System Intelligence</span>
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-indigo-500 to-transparent"
          animate={{ height: [0, 64, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}



