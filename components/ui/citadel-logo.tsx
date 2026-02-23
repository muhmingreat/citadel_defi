import React from 'react';
import { cn } from '@/lib/utils';

interface CitadelLogoProps {
  className?: string;
}

export function CitadelLogo({ className }: CitadelLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-8 h-8", className)}
    >
      {/* 
        Inner Keep: Solid Hexagon 
        Pulse animation: opacity/scale
      */}
      <path
        d="M50 25L71.65 37.5V62.5L50 75L28.35 62.5V37.5L50 25Z"
        fill="currentColor"
        className="animate-pulse origin-center"
      />

      {/* 
        Outer Wall: Segmented Hexagonal Ring 
        Rotate animation: slow spin
      */}
      <g className="animate-[spin_10s_linear_infinite] origin-center">
        {/* Top Right Segment */}
        <path
          d="M50 10L84.64 30"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-90"
        />
        {/* Right Segment */}
        <path
          d="M90 40V60"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-90"
        />
        {/* Bottom Right Segment */}
        <path
          d="M84.64 70L50 90"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-90"
        />
        {/* Bottom Left Segment */}
        <path
          d="M50 90L15.36 70"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-90"
        />
        {/* Left Segment */}
        <path
          d="M10 60V40"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-90"
        />
        {/* Top Left Segment */}
        <path
          d="M15.36 30L50 10"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          className="opacity-90"
        />
      </g>
    </svg>
  );
}
