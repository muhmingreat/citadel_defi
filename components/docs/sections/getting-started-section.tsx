import { CodeBlock, InfoCard } from '../doc-section';
import { Terminal, Wallet, Rocket } from 'lucide-react';

export function GettingStartedSection() {
  const installCmd = `# Clone the repository
git clone <repository-url>
cd citadel-defi

# Install dependencies
npm install`;

  const runCmd = `# Terminal 1: Start Hardhat Node
npx hardhat node

# Terminal 2: Deploy Contracts
npx hardhat run scripts/deploy-full-system.js --network localhost

# Terminal 3: Start Frontend
npm run dev`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4 font-mono">Getting Started</h2>
        <p className="text-slate-400 leading-relaxed">
          Get Citadel running on your local machine in minutes. Follow these steps to set up 
          your development environment.
        </p>
      </div>

      {/* Prerequisites */}
      <InfoCard title="Prerequisites" type="info">
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="text-indigo-400">✓</span>
            <span>Node.js 18+ and npm/yarn</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-indigo-400">✓</span>
            <span>MetaMask or compatible Web3 wallet</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-indigo-400">✓</span>
            <span>Hardhat for local blockchain</span>
          </li>
        </ul>
      </InfoCard>

      {/* Step 1: Installation */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-indigo-500/10 rounded-lg">
            <Terminal className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">Step 1: Installation</h3>
        </div>
        <CodeBlock code={installCmd} language="bash" id="install" />
      </div>

      {/* Step 2: Run Locally */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-emerald-500/10 rounded-lg">
            <Rocket className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">Step 2: Run Locally</h3>
        </div>
        <CodeBlock code={runCmd} language="bash" id="run" />
        <p className="mt-4 text-sm text-slate-400">
          Open <code className="text-indigo-400 bg-slate-950 px-2 py-1 rounded">http://localhost:3000</code> in your browser
        </p>
      </div>

      {/* Step 3: Connect Wallet */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-amber-500/10 rounded-lg">
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-2xl font-bold text-white font-mono">Step 3: Connect Wallet</h3>
        </div>
        <ol className="space-y-3 text-slate-300">
          <li className="flex gap-3">
            <span className="text-indigo-400 font-mono font-bold">1.</span>
            <span>Install MetaMask browser extension</span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-mono font-bold">2.</span>
            <div>
              <span className="block mb-2">Add BNB Smart Chain Testnet:</span>
              <ul className="ml-4 space-y-1 text-sm">
                <li>• Network Name: BNB Smart Chain Testnet</li>
                <li>• RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545</li>
                <li>• Chain ID: 97</li>
                <li>• Currency Symbol: tBNB</li>
                <li>• Block Explorer: https://testnet.bscscan.com</li>
              </ul>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-mono font-bold">3.</span>
            <span>Get testnet BNB from <a href="https://testnet.bnbchain.org/faucet-smart" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">BNB Testnet Faucet</a></span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-400 font-mono font-bold">4.</span>
            <span>Click "Connect Wallet" in the app</span>
          </li>
        </ol>
      </div>

      <InfoCard title="Next Steps" type="success">
        <p>
          You're all set! Start by depositing some test USDC into the vault and watch the 
          autonomous risk management system in action.
        </p>
      </InfoCard>
    </div>
  );
}
