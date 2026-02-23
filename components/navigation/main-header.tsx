'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CitadelLogo } from '@/components/ui/citadel-logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MainHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(15, 23, 42, 0)', 'rgba(2, 6, 23, 0.8)']
  );
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <motion.header
      style={{
        backgroundColor,
        backdropFilter: 'blur(12px)',
      }}
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all"
    >
      <motion.div
        className="absolute inset-0 border-b border-white/5 pointer-events-none"
        style={{ opacity: borderOpacity }}
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-2 bg-indigo-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <CitadelLogo className="w-8 h-8 sm:w-10 sm:h-10 text-white relative" />
          </div>
          <span className="text-lg sm:text-xl font-black tracking-tighter text-white uppercase group-hover:text-glow transition-all">
            Citadel
          </span>
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-10">
          <Link
            href={pathname === '/' ? '/dashboard' : '/'}
            className="text-xs font-mono font-bold text-slate-400 hover:text-white uppercase tracking-[0.15em] transition-colors relative group"
          >
            {pathname === '/' ? 'Dashboard' : 'Back to Home'}
            <motion.span
              className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 transition-all group-hover:w-full"
            />
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </motion.header>
  );
}
