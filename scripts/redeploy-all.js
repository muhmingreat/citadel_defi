const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 REDEPLOYING FULL SYSTEM with account:", deployer.address);

  // 1. Deploy Volatility Oracle
  console.log("1. Deploying Volatility Oracle...");
  const VolatilityOracle = await hre.ethers.getContractFactory("VolatilityOracle");
  const oracle = await VolatilityOracle.deploy();
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();
  console.log("✅ VolatilityOracle:", oracleAddress);

  // 2. Deploy Mock Asset (mUSDC)
  console.log("2. Deploying Mock USDC...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const asset = await MockERC20.deploy("Mock USDC", "mUSDC");
  await asset.waitForDeployment();
  const assetAddress = await asset.getAddress();
  console.log("✅ MockUSDC:", assetAddress);

  // 3. Deploy Citadel Vault
  console.log("3. Deploying Citadel Vault...");
  const CitadelVault = await hre.ethers.getContractFactory("CitadelVault");
  const vault = await CitadelVault.deploy(assetAddress, oracleAddress, "Citadel Vault", "CTDL");
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log("✅ CitadelVault:", vaultAddress);

  // 4. Deploy Strategies
  console.log("4. Deploying Strategies...");
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

  // 5. Deploy Strategy Manager
  console.log("5. Deploying StrategyManager...");
  const StrategyManager = await hre.ethers.getContractFactory("StrategyManager");
  const manager = await StrategyManager.deploy(vaultAddress);
  await manager.waitForDeployment();
  const managerAddress = await manager.getAddress();
  console.log("✅ StrategyManager:", managerAddress);

  // 6. Initialize Protocol
  console.log("6. Finalizing Protocol Setup...");
  const managerContract = await hre.ethers.getContractAt("StrategyManager", managerAddress);
  
  // Add active strategies
  await (await managerContract.addStrategy(anchorAddress)).wait();
  await (await managerContract.addStrategy(growthAddress)).wait();
  
  // Set default yields for Mocks (Basis Points)
  const anchorContract = await hre.ethers.getContractAt("AsterDEXStrategy", anchorAddress);
  const growthContract = await hre.ethers.getContractAt("PancakeStrategy", growthAddress);
  
  await (await anchorContract.setYieldRate(520)).wait(); // 5.2%
  await (await growthContract.setYieldRate(1250)).wait(); // 12.5%
  console.log("✅ Mock Yields Initialized.");

  // Set Allocations
  console.log("7. Setting Mode Allocations...");
  // GROWTH Mode (0): 60% Anchor, 40% Growth
  await (await managerContract.setAllocation(0, anchorAddress, 6000)).wait();
  await (await managerContract.setAllocation(0, growthAddress, 4000)).wait();

  // FORTRESS Mode (1): 100% Anchor, 0% Growth
  await (await managerContract.setAllocation(1, anchorAddress, 10000)).wait();
  await (await managerContract.setAllocation(1, growthAddress, 0)).wait();
  console.log("✅ Allocations set.");

  // 8. Update Frontend Config
  const configPath = path.join(__dirname, "../config/contracts.ts");
  const configContent = `import CitadelVaultArtifact from '../artifacts/contracts/CitadelVault.sol/CitadelVault.json';
import VolatilityOracleArtifact from '../artifacts/contracts/VolatilityOracle.sol/VolatilityOracle.json';
import AsterDEXStrategyArtifact from '../artifacts/contracts/strategies/AsterDEXStrategy.sol/AsterDEXStrategy.json';
import PancakeStrategyArtifact from '../artifacts/contracts/strategies/PancakeStrategy.sol/PancakeStrategy.json';
import MockERC20Artifact from '../artifacts/contracts/MockERC20.sol/MockERC20.json';
import StrategyManagerArtifact from '../artifacts/contracts/StrategyManager.sol/StrategyManager.json';

export const CONTRACT_ADDRESSES = {
  VolatilityOracle: "${oracleAddress}", 
  CitadelVault: "${vaultAddress}",
  AsterDEXStrategy: "${anchorAddress}",
  PancakeStrategy: "${growthAddress}",
  MockUSDC: "${assetAddress}",
  StrategyManager: "${managerAddress}",
};

export const CONTRACTS = {
  StrategyManager: {
    address: CONTRACT_ADDRESSES.StrategyManager as \`0x\${string}\`,
    abi: StrategyManagerArtifact.abi,
  },
  VolatilityOracle: {
    address: CONTRACT_ADDRESSES.VolatilityOracle as \`0x\${string}\`,
    abi: VolatilityOracleArtifact.abi,
  },
  CitadelVault: {
    address: CONTRACT_ADDRESSES.CitadelVault as \`0x\${string}\`,
    abi: CitadelVaultArtifact.abi,
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

  fs.writeFileSync(configPath, configContent);
  console.log("\n🎉 ALL CONTRACTS REDEPLOYED & CONFIG UPDATED!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
