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

### CitadelVault.sol

**Purpose**: Main vault contract implementing ERC-4626 standard with autonomous mode switching.

**Key Functions**:
- `deposit(uint256 assets, address receiver)`: Deposit assets and receive vault shares
- `withdraw(uint256 assets, address receiver, address owner)`: Withdraw assets by burning shares
- `totalAssets()`: Get total assets under management
- `currentMode()`: Returns 0 (Growth) or 1 (Fortress)

**Events**:
- `Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)`
- `Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)`
- `ModeChanged(uint8 newMode, uint256 triggerVolatility)`

**Mode Logic**:
```solidity
if (volatility < 45) → Growth Mode (both strategies active)
if (volatility > 65) → Fortress Mode (defensive positioning)
```

### VolatilityOracle.sol

**Purpose**: Provides real-time market volatility data to trigger mode changes.

**Key Functions**:
- `updateVolatility(uint256 newValue)`: Update volatility (0-100)
- `volatility()`: Get current volatility percentage

**Events**:
- `VolatilityUpdated(uint256 newValue, uint256 timestamp)`

### StrategyManager.sol

**Purpose**: Manages allocation between multiple yield strategies.

**Key Functions**:
- `getNetAPY()`: Calculate combined APY from all strategies
- `rebalance()`: Redistribute assets based on current mode

### AsterDEXStrategy.sol

**Purpose**: Stable yield strategy (Anchor).

**Key Functions**:
- `yieldRate()`: Returns current yield rate (basis points)
- `harvest()`: Collect and compound yields

**Characteristics**:
- Lower risk, stable returns (~5-8% APY)
- Always active in both modes
- Primary strategy in Fortress mode

### PancakeStrategy.sol

**Purpose**: Volatile yield strategy (Booster).

**Key Functions**:
- `yieldRate()`: Returns current yield rate (basis points)
- `harvest()`: Collect and compound yields

**Characteristics**:
- Higher risk, higher returns (~10-15% APY)
- Active only in Growth mode
- Disabled in Fortress mode

---

## Frontend Application

### Page Structure

```
app/
├── layout.tsx              # Root layout with Web3Provider
├── page.tsx                # Landing page
├── globals.css             # Global styles and design tokens
└── dashboard/
    ├── layout.tsx          # Dashboard layout
    ├── page.tsx            # Main dashboard
    ├── intelligence/
    │   └── page.tsx        # Sentinel AI page
    └── strategy/
        └── page.tsx        # Strategy configuration
```

### Key Components

#### ShieldHeader
**Location**: `components/citadel/shield-header.tsx`

Displays current mode status and wallet connection.

```tsx
<ShieldHeader
  mode="growth" | "fortress"
  walletAddress="0x..."
  onSentinelClick={() => {}}
/>
```

#### VaultCard
**Location**: `components/citadel/vault-card.tsx`

Main metrics display with deposit/withdraw actions.

```tsx
<VaultCard
  tvl={2450000}
  netAPY={17.7}
  anchorYield={5.2}
  boosterYield={12.5}
  userBalance={50000}
  onDeposit={() => {}}
  onWithdraw={() => {}}
/>
```

#### RiskMeter
**Location**: `components/citadel/risk-meter.tsx`

Visual volatility gauge with 10-segment bar.

```tsx
<RiskMeter
  volatility={35}
  onAction={() => {}}
/>
```

#### ActivityLog
**Location**: `components/citadel/activity-log.tsx`

Terminal-style event log with real-time updates.

```tsx
<ActivityLog
  entries={[
    {
      id: "1",
      timestamp: new Date(),
      type: "success",
      message: "Deposit confirmed",
      details: "Block #12345"
    }
  ]}
/>
```

### Custom Hooks

#### useCitadelData
**Location**: `hooks/useCitadelData.ts`

Central hook for fetching all vault data.

```typescript
const {
  tvl,                  // Total value locked
  mode,                 // 'growth' | 'fortress'
  volatility,           // 0-100
  userVaultBalance,     // User's vault shares
  userAssetBalance,     // User's wallet balance
  netAPY,               // Combined APY
  anchorYield,          // Stable strategy yield
  boosterYield,         // Volatile strategy yield
  historicalLogs,       // Event history
  isLoading,            // Loading state
  isError,              // Error state
  refetch,              // Manual refetch function
  CONTRACTS             // Contract addresses & ABIs
} = useCitadelData();
```

**Features**:
- Automatic 30-second polling
- Local storage caching
- Historical event fetching
- Error handling with retries

### Modals

#### DepositModal
**Location**: `components/modals/deposit-modal.tsx`

Two-step deposit process:
1. Approve USDC spending
2. Deposit to vault

```tsx
<DepositModal
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

#### WithdrawModal
**Location**: `components/modals/withdraw-modal.tsx`

Single-step withdrawal process.

```tsx
<WithdrawModal
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Hardhat for local blockchain

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd citadel-defi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create `.env` file:

```bash
# Hardhat Network
HARDHAT_RPC_URL=http://127.0.0.1:8545
HARDHAT_CHAIN_ID=31337

# Contract Addresses (auto-populated after deployment)
NEXT_PUBLIC_CITADEL_VAULT=0x...
NEXT_PUBLIC_VOLATILITY_ORACLE=0x...
NEXT_PUBLIC_STRATEGY_MANAGER=0x...
```

### Running Locally

**Terminal 1: Start Hardhat Node**
```bash
npx hardhat node
```

**Terminal 2: Deploy Contracts**
```bash
npx hardhat run scripts/deploy-full-system.js --network localhost
```

**Terminal 3: Start Frontend**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Connecting Wallet

1. Install MetaMask browser extension
2. Add BNB Smart Chain Testnet:
   - Network Name: BNB Smart Chain Testnet
   - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545
   - Chain ID: 97
   - Currency Symbol: tBNB
   - Block Explorer: https://testnet.bscscan.com
3. Get testnet BNB from [BNB Testnet Faucet](https://testnet.bnbchain.org/faucet-smart)
4. Click "Connect Wallet" in app

---

## User Guide

### Depositing Assets

1. Navigate to Dashboard
2. Click "DEPOSIT" button on Vault Card
3. Enter amount or click "MAX"
4. Click "STEP 1: APPROVE USDC"
5. Confirm in wallet
6. Wait for confirmation
7. Click "STEP 2: CONFIRM DEPOSIT"
8. Confirm in wallet
9. Receive vault shares (CTDL tokens)

### Withdrawing Assets

1. Navigate to Dashboard
2. Click "WITHDRAW" button on Vault Card
3. Enter amount or click "MAX"
4. Click "Confirm Withdrawal"
5. Confirm in wallet
6. Receive USDC back to wallet

### Understanding Modes

**Growth Mode** (Green Shield)
- Volatility < 45%
- Both strategies active
- Higher potential returns
- Moderate risk

**Fortress Mode** (Red Shield)
- Volatility > 65%
- Defensive positioning
- 100% stable yields
- Lower risk

### Reading the Risk Meter

- **0-30%**: Low Risk (Green)
- **31-50%**: Moderate Risk (Yellow)
- **51-70%**: High Risk (Orange)
- **71-100%**: Critical Risk (Red)

### Activity Log

Monitor real-time events:
- **Success** (Green): Deposits, harvests
- **Info** (Blue): Withdrawals, updates
- **Warning** (Yellow): Volatility changes
- **Alert** (Red): Mode switches

---

## Developer Guide

### Project Structure

```
citadel-defi/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── citadel/          # Custom components
│   ├── landing/          # Landing page components
│   ├── modals/           # Modal dialogs
│   ├── navigation/       # Navigation components
│   └── ui/               # shadcn/ui components
├── config/               # Configuration files
│   └── contracts.ts      # Contract addresses & ABIs
├── context/              # React context providers
│   └── wallet-context.tsx
├── contracts/            # Solidity contracts
│   ├── CitadelVault.sol
│   ├── VolatilityOracle.sol
│   ├── StrategyManager.sol
│   ├── MockERC20.sol
│   ├── interfaces/
│   └── strategies/
├── hooks/                # Custom React hooks
│   └── useCitadelData.ts
├── lib/                  # Utility functions
│   └── utils.ts
├── public/               # Static assets
├── scripts/              # Deployment scripts
│   ├── deploy-full-system.js
│   ├── protocol-init.js
│   └── sentinel-bot.js
├── styles/               # Global styles
├── test/                 # Contract tests
└── artifacts/            # Compiled contracts
```

### Adding New Features

#### 1. Add New Contract Function

```solidity
// contracts/CitadelVault.sol
function newFeature() external {
    // Implementation
}
```

#### 2. Update Contract Config

```typescript
// config/contracts.ts
// Redeploy and update addresses
```

#### 3. Create Hook

```typescript
// hooks/useNewFeature.ts
export function useNewFeature() {
  const { data } = useReadContract({
    ...CONTRACTS.CitadelVault,
    functionName: 'newFeature'
  });
  return data;
}
```

#### 4. Add UI Component

```tsx
// components/citadel/new-feature.tsx
export function NewFeature() {
  const data = useNewFeature();
  return <div>{data}</div>;
}
```

### Testing

#### Contract Tests

```bash
npx hardhat test
```

#### Frontend Testing

```bash
npm run lint
npm run build
```

### Deployment

#### Deploy to Testnet

```bash
# Update hardhat.config.js with testnet RPC
npx hardhat run scripts/deploy-full-system.js --network sepolia
```

#### Deploy Frontend

```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel deploy
```

---

## Security & Audits

### Security Features

1. **ERC-4626 Standard**: Industry-standard vault interface
2. **OpenZeppelin Contracts**: Battle-tested base contracts
3. **Reentrancy Guards**: Protection against reentrancy attacks
4. **Access Control**: Role-based permissions
5. **Pausable**: Emergency stop mechanism

### Audit Status

⚠️ **This is a demonstration project**

For production use:
- [ ] Complete professional security audit
- [ ] Implement multi-sig governance
- [ ] Add time-locks for critical functions
- [ ] Set up monitoring and alerts
- [ ] Establish bug bounty program

### Known Limitations

- Mock USDC token (not real USDC)
- Simulated yield strategies
- Local blockchain only
- No governance mechanism
- No insurance fund

### Best Practices

1. **Never deploy to mainnet without audit**
2. **Start with small deposits on testnet**
3. **Verify all contract addresses**
4. **Use hardware wallet for large amounts**
5. **Monitor activity logs regularly**

---

## API Reference

### Contract ABIs

All ABIs are available in `artifacts/contracts/` after compilation.

### Web3 Hooks

#### useAccount
```typescript
const { address, isConnected } = useAccount();
```

#### useReadContract
```typescript
const { data, isLoading } = useReadContract({
  address: CONTRACTS.CitadelVault.address,
  abi: CONTRACTS.CitadelVault.abi,
  functionName: 'totalAssets'
});
```

#### useWriteContract
```typescript
const { writeContract, isPending } = useWriteContract();

writeContract({
  address: CONTRACTS.CitadelVault.address,
  abi: CONTRACTS.CitadelVault.abi,
  functionName: 'deposit',
  args: [amount, receiver]
});
```

### REST API Endpoints

#### GET /api/rpc
Health check for RPC connection.

#### POST /api/sentinel/briefing
Get AI-generated market briefing.

---

## Troubleshooting

### Common Issues

#### "Cannot connect to wallet"
- Ensure MetaMask is installed
- Check network is set to Hardhat Local
- Verify RPC URL: http://127.0.0.1:8545

#### "Transaction failed"
- Check you have enough ETH for gas
- Verify contract addresses are correct
- Ensure Hardhat node is running

#### "Infinite loop error"
- Clear browser cache
- Check useEffect dependencies
- Verify no circular state updates

#### "Contract not deployed"
- Run deployment script
- Check contract addresses in config
- Verify network matches

### Debug Mode

Enable debug logging:

```typescript
// Add to useCitadelData.ts
console.log("Debug:", { tvl, mode, volatility });
```

### Getting Help

1. Check browser console for errors
2. Review Hardhat node output
3. Verify contract deployment
4. Check wallet connection
5. Review transaction history

---

## Appendix

### Glossary

- **TVL**: Total Value Locked - total assets in vault
- **APY**: Annual Percentage Yield - yearly return rate
- **Volatility**: Market risk indicator (0-100%)
- **Shares**: Vault tokens representing ownership
- **Assets**: Underlying tokens (USDC)
- **Harvest**: Collect and compound yields
- **Rebalance**: Redistribute assets between strategies

### Resources

- [ERC-4626 Standard](https://eips.ethereum.org/EIPS/eip-4626)
- [OpenZeppelin Docs](https://docs.openzeppelin.com/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)

### Version History

- **v0.1.0** (2026-02-26): Initial release
  - Core vault functionality
  - Dual strategy system
  - Dashboard interface
  - Wallet integration

---

**Last Updated**: February 26, 2026  
**Version**: 0.1.0  
**Status**: Development/Demo

For questions or contributions, please refer to the project repository.
