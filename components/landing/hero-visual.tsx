'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { CitadelLogo } from '@/components/ui/citadel-logo';

export function HeroVisual() {
    const ref = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth mouse movement for parallax
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = clientX / innerWidth - 0.5;
        const y = clientY / innerHeight - 0.5;
        mouseX.set(x * 40); // Max tilt X
        mouseY.set(y * 40); // Max tilt Y
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            className="relative w-full aspect-square max-w-[650px] mx-auto flex items-center justify-center perspective-1000 group sm:pointer-events-auto"
        >
            {/* 
                Ambient Atmosphere 
                Deep, layered glows that breath with the UI
            */}
            <motion.div
                className="absolute inset-0 bg-indigo-600/5 rounded-full"
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute inset-0 bg-emerald-500/5 rounded-full translate-x-1/4 translate-y-1/4"
                animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            {/* 
                Parallax Container
                All internal elements respond to mouse movement
            */}
            <motion.div
                style={{ rotateX: springY, rotateY: springX }}
                className="relative w-full h-full flex items-center justify-center transform-style-3d"
            >
                {/* 
                    Kinetic SVG Core
                */}
                <svg
                    viewBox="0 0 600 600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full p-4 lg:p-0 overflow-visible"
                >
                    <defs>
                        <filter id="glow-intense" x="-50%" y="-50%" width="200%" height="200%">
                            <feComposite in="SourceGraphic" in2="SourceGraphic" operator="over" />
                        </filter>

                        <radialGradient id="grad-radar" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(300 300) rotate(90) scale(300)">
                            <stop stopColor="#6366f1" stopOpacity="0.2" />
                            <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
                        </radialGradient>

                        <linearGradient id="trace-line" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                            <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Outer Defense Grid (Slow Rotation) */}
                    <motion.g
                        animate={{ rotate: 360 }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                        className="origin-[300px_300px]"
                    >
                        <circle cx="300" cy="300" r="280" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                        <circle cx="300" cy="300" r="260" stroke="#334155" strokeWidth="0.5" strokeDasharray="20 40" opacity="0.5" />
                    </motion.g>

                    {/* Scanning Radar Sector */}
                    <motion.path
                        d="M300,300 L300,20 A280,280 0 0,1 542.4,160 Z"
                        fill="url(#grad-radar)"
                        className="origin-[300px_300px]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Tactical Rings (Counter-Rotating) */}
                    <motion.circle
                        cx="300"
                        cy="300"
                        r="220"
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeDasharray="100 400"
                        strokeLinecap="round"
                        className="origin-[300px_300px]"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />

                    {/* High-Frequency Data Streams */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <motion.line
                            key={`stream-${i}`}
                            x1="300"
                            y1="300"
                            x2="300"
                            y2="100"
                            stroke="url(#trace-line)"
                            strokeWidth="2"
                            className="origin-[300px_300px]"
                            transform={`rotate(${angle} 300 300)`}
                            initial={{ strokeDasharray: "0 200", strokeDashoffset: 0 }}
                            animate={{ strokeDasharray: ["0 200", "50 150", "0 200"], strokeDashoffset: [-200, 0] }}
                            transition={{ duration: 3, delay: i * 0.2, repeat: Infinity, ease: "linear" }}
                        />
                    ))}

                    {/* Inner Core Shield */}
                    <motion.circle
                        cx="300"
                        cy="300"
                        r="140"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="2 10"
                        strokeLinecap="round"
                        className="origin-[300px_300px]"
                        animate={{ rotate: 360, scale: [1, 1.02, 1] }}
                        transition={{
                            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />

                    {/* Orbital Satellites */}
                    {[0, 1, 2].map((i) => (
                        <motion.g
                            key={`sat-${i}`}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                            className="origin-[300px_300px]"
                        >
                            <motion.circle
                                cx={300 + 180 + i * 40}
                                cy="300"
                                r="4"
                                fill={i === 1 ? "#10b981" : "#6366f1"}
                            />
                            <circle
                                cx={300 + 180 + i * 40}
                                cy="300"
                                r="12"
                                stroke={i === 1 ? "#10b981" : "#6366f1"}
                                strokeWidth="0.5"
                                opacity="0.3"
                            />
                        </motion.g>
                    ))}
                </svg>

                {/* 
                    Central Bastion (Glass Core) 
                */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ translateZ: 50 }}
                >
                    <div className="relative group">
                        {/* Core Pulse */}
                        <div className="absolute -inset-10 bg-indigo-500/10 rounded-full animate-pulse-slow group-hover:bg-indigo-500/20 transition-colors duration-500" />

                        {/* Glass Container */}
                        <div className="relative p-8 sm:p-12 rounded-[3rem] glass-card border-white/10 group-hover:border-indigo-500/60 transition-all duration-500 shadow-[0_0_80px_-20px_rgba(99,102,241,0.5)]">
                            <motion.div
                                animate={{
                                    y: [0, -6, 0],
                                    rotateZ: [0, 2, 0]
                                }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <CitadelLogo className="w-28 h-28 sm:w-40 sm:h-40 text-white" />
                            </motion.div>
                        </div>

                        {/* Floating Status Indicators with 3D Transform */}
                        <motion.div
                            className="absolute -top-14 -right-12 px-4 py-2 glass-panel rounded-full flex items-center gap-2 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            style={{ translateZ: 80 }}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-300">SYSTEM_OPTIMAL</span>
                        </motion.div>

                        <motion.div
                            className="absolute -bottom-10 -left-16 px-4 py-2 glass-panel rounded-full flex items-center gap-2 border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            style={{ translateZ: 60 }}
                        >
                            <span className="text-[10px] font-mono font-bold text-indigo-300">YIELD: 12.3% APY</span>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Particle Field Foreground */}
                <ParticleSystem />
            </motion.div>
        </div>
    );
}

function ParticleSystem() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ transform: "translateZ(100px)" }}>
            {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-white rounded-full"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        scale: Math.random(),
                        opacity: 0
                    }}
                    animate={{
                        y: [null, "-20%"],
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    );
}
