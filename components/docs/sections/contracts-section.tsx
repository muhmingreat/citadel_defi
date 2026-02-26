import { CodeBlock, InfoCard } from '../doc-section';

export function ContractsSection() {
  const addresses = `VolatilityOracle:  0xF87A84Be11A52ef74B9C4d372Ff0aeC78f568191
CitadelVault:      0xe842E29Da4a0739EECF5088710CC82ab9029C5C4
StrategyManager:   0xBA692354C8Da286689110BCfC9c9223aCCD7Eb08
AsterDEXStrategy:  0x6e4bF8Da9cdE440e56E8235ECd1a6500a4d0d72e
PancakeStrategy:   0xD187F78d5194643D7561efFd08FcfD44EB6245Ec
MockUSDC:          0xc5Fa30A09C80c4DF6eDb3c23e268549bB3F73256`;

  const depositExample = `// Deposit assets to vault
const { writeContract } = useWriteContract();

writeContract({
  address: CONTRACTS.CitadelVault.address,
  abi: CONTRACTS.CitadelVault.abi,
  functionName: 'deposit',
  args: [parseUnits('100', 18), userAddress]
});`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4 font-mono">Smart Contracts</h2>
        <p className="text-slate-400 leading-relaxed">
          Citadel is built on a modular smart contract architecture implementing the ERC-4626 
          tokenized vault standard with autonomous risk management capabilities.
        </p>
      </div>

      {/* Contract Addresses */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4 font-mono">Contract Addresses</h3>
        <CodeBlock code={addresses} language="text" id="addresses" />
      </div>

      {/* CitadelVault */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4 font-mono flex items-center gap-2">
          <span className="text-indigo-400">01.</span> CitadelVault.sol
        </h3>
        <p className="text-slate-400 mb-4">
          Main vault contract implementing ERC-4626 standard with autonomous mode switching.
        </p>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2 font-mono">Key Functions</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <code className="text-emerald-400 font-mono">deposit()</code>
                <span>Deposit assets and receive vault shares</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-emerald-400 font-mono">withdraw()</code>
                <span>Withdraw assets by burning shares</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-emerald-400 font-mono">totalAssets()</code>
                <span>Get total assets under management</span>
              </li>
              <li className="flex items-start gap-2">
                <code className="text-emerald-400 font-mono">currentMode()</code>
                <span>Returns 0 (Growth) or 1 (Fortress)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-2 font-mono">Mode Logic</h4>
            <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 font-mono text-sm">
              <div className="text-emerald-400">if (volatility &lt; 45) → Growth Mode</div>
              <div className="text-amber-400">if (volatility &gt; 65) → Fortress Mode</div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Example */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-4 font-mono">Usage Example</h3>
        <CodeBlock code={depositExample} language="typescript" id="deposit-example" />
      </div>

      <InfoCard title="Security Note" type="warning">
        <p>
          This is a demonstration project. For production use, complete a professional security 
          audit, implement multi-sig governance, and add time-locks for critical functions.
        </p>
      </InfoCard>
    </div>
  );
}
