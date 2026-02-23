const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying Full System with account:", deployer.address);

  // 1. Deploy Volatility Oracle
  console.log("1. Deploying Volatility Oracle...");
  const VolatilityOracle = await hre.ethers.getContractFactory("VolatilityOracle");
  const oracle = await VolatilityOracle.deploy();
  console.log("   Transaction hash:", oracle.deploymentTransaction()?.hash);
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("✅ VolatilityOracle:", oracleAddress);

  // 2. Deploy Mock Asset (mUSDC)
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const asset = await MockERC20.deploy("Mock USDC", "mUSDC");
  await asset.waitForDeployment();
  const assetAddress = await asset.getAddress();
  console.log("✅ MockUSDC:", assetAddress);

  // 3. Deploy Citadel Vault
  const CitadelVault = await hre.ethers.getContractFactory("CitadelVault");
  const vault = await CitadelVault.deploy(assetAddress, oracleAddress, "Citadel Vault", "CTDL");
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ CitadelVault:", vaultAddress);

  // 4. Deploy StrategyManager
  const StrategyManager = await hre.ethers.getContractFactory("StrategyManager");
  const strategyManager = await StrategyManager.deploy(vaultAddress);
  await strategyManager.waitForDeployment();
  const strategyManagerAddress = await strategyManager.getAddress();
  console.log("✅ StrategyManager:", strategyManagerAddress);

  // 5. Deploy Strategies
  const AsterDEXStrategy = await hre.ethers.getContractFactory("AsterDEXStrategy");
  const strategyAnchor = await AsterDEXStrategy.deploy(assetAddress);
  await strategyAnchor.waitForDeployment();
  const anchorAddress = await strategyAnchor.getAddress();
  console.log("✅ AsterDEXStrategy:", anchorAddress);

  const PancakeStrategy = await hre.ethers.getContractFactory("PancakeStrategy");
  const strategyGrowth = await PancakeStrategy.deploy(assetAddress);
  await strategyGrowth.waitForDeployment();
  const growthAddress = await strategyGrowth.getAddress();
  console.log("✅ PancakeStrategy:", growthAddress);

  // 6. Generate Config File
  const configContent = `import CitadelVaultArtifact from '../artifacts/contracts/CitadelVault.sol/CitadelVault.json';
import VolatilityOracleArtifact from '../artifacts/contracts/VolatilityOracle.sol/VolatilityOracle.json';
import AsterDEXStrategyArtifact from '../artifacts/contracts/strategies/AsterDEXStrategy.sol/AsterDEXStrategy.json';
import PancakeStrategyArtifact from '../artifacts/contracts/strategies/PancakeStrategy.sol/PancakeStrategy.json';
import MockERC20Artifact from '../artifacts/contracts/MockERC20.sol/MockERC20.json';
import StrategyManagerArtifact from '../artifacts/contracts/StrategyManager.sol/StrategyManager.json';

export const CONTRACT_ADDRESSES = {
  VolatilityOracle: "${oracleAddress}", 
  CitadelVault: "${vaultAddress}",
  StrategyManager: "${strategyManagerAddress}",
  AsterDEXStrategy: "${anchorAddress}",
  PancakeStrategy: "${growthAddress}",
  MockUSDC: "${assetAddress}",
};

export const CONTRACTS = {
  VolatilityOracle: {
    address: CONTRACT_ADDRESSES.VolatilityOracle as \`0x\${string}\`,
    abi: VolatilityOracleArtifact.abi,
  },
  CitadelVault: {
    address: CONTRACT_ADDRESSES.CitadelVault as \`0x\${string}\`,
    abi: CitadelVaultArtifact.abi,
  },
  StrategyManager: {
    address: CONTRACT_ADDRESSES.StrategyManager as \`0x\${string}\`,
    abi: StrategyManagerArtifact.abi,
  },
  AsterDEXStrategy: {
    address: CONTRACT_ADDRESSES.AsterDEXStrategy as \`0x\${string}\`,
    abi: AsterDEXStrategyArtifact.abi,
  },
  PancakeStrategy: {
    address: CONTRACT_ADDRESSES.PancakeStrategy as \`0x\${string}\`,
    abi: PancakeStrategyArtifact.abi,
  },
  MockUSDC: {
    address: CONTRACT_ADDRESSES.MockUSDC as \`0x\${string}\`,
    abi: MockERC20Artifact.abi,
  },
} as const;
`;

  const configPath = path.join(__dirname, "../config/contracts.ts");
  fs.writeFileSync(configPath, configContent);
  console.log("\n🎉 Configuration saved to config/contracts.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
