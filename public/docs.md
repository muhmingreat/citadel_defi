# Citadel DeFi - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Smart Contracts](#smart-contracts)
4. [Frontend Application](#frontend-application)
5. [Getting Started](#getting-started)
6. [User Guide](#user-guide)
7. [Developer Guide](#developer-guide)
8. [Security & Audits](#security--audits)
9. [API Reference](#api-reference)
10. [Troubleshooting](#troubleshooting)

---

## Overview

**Citadel** is an autonomous defensive DeFi yield vault that dynamically adjusts investment strategies based on real-time market volatility. The protocol automatically switches between aggressive growth and defensive fortress modes to protect user assets while maximizing returns.

### Key Features

- **Autonomous Risk Management**: Automatic mode switching based on volatility thresholds
- **Dual Strategy System**: AsterDEX (stable) + PancakeSwap (volatile) yield optimization
- **Real-time Monitoring**: Live dashboard with volatility tracking and activity logs
- **ERC-4626 Compliant**: Standard vault interface for maximum compatibility
- **Web3 Integration**: Full wallet connectivity via RainbowKit and Wagmi

### Core Metrics

- **TVL (Total Value Locked)**: Real-time tracking of all deposited assets
- **Net APY**: Combined yield from both strategies
- **Volatility Index**: 0-100% market risk indicator
- **Mode Status**: Growth (< 45% volatility) or Fortress (> 65% volatility)

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │   Modals     │  │  Components  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Web3 Layer (Wagmi/Viem)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Smart Contracts Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │CitadelVault  │  │StrategyMgr   │  │VolatOracle   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │AsterDEX Strat│  │Pancake Strat │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Blockchain (Hardhat Local)                  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend**
- Next.js 14.2.0 (React 18)
- TypeScript
- Tailwind CSS + tailwindcss-animate
- Framer Motion (animations)
- Lucide React (icons)

**Web3**
- Wagmi 2.19.5 (React hooks)
- Viem 2.45.1 (Ethereum interactions)
- RainbowKit 2.2.10 (wallet connection)
- TanStack Query 5.90.20 (data fetching)

**Smart Contracts**
- Solidity ^0.8.20
- Hardhat 2.22.3
- OpenZeppelin Contracts 5.0.2
- ERC-4626 Tokenized Vault Standard

---

## Smart Contracts

### Contract Addresses

```typescript
VolatilityOracle:  0xF87A84Be11A52ef74B9C4d372Ff0aeC78f568191
CitadelVault:      0xe842E29Da4a0739EECF5088710CC82ab9029C5C4
StrategyManager:   0xBA692354C8Da286689110BCfC9c9223aCCD7Eb08
AsterDEXStrategy:  0x6e4bF8Da9cdE440e56E8235ECd1a6500a4d0d72e
PancakeStrategy:   0xD187F78d5194643D7561efFd08FcfD44EB6245Ec
MockUSDC:          0xc5Fa30A09C80c4DF6eDb3c23e268549bB3F73256
```

For complete documentation including user guides, developer guides, API reference, and troubleshooting, please visit the full documentation file.

---

**Last Updated**: February 26, 2026  
**Version**: 0.1.0  
**Status**: Development/Demo
