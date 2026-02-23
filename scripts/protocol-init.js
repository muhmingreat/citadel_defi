const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🛠 Finalizing Protocol Setup...");

  // 1. Hardcoded addresses from your successful deployment
  const oracleAddress = "0xd841EA140c4c760C5aAAe90bE9992bD4292FD4aA";
  const vaultAddress = "0xa7685a21E0eEa0BCA20411aeFbdFDC6EeBdaf94a";
  const anchorAddress = "0x3187Af24212a43A6349Ce127331a5cac473dF4fE";
  const growthAddress = "0x3369A8f825EfAcE7ef31BbE1747EEF8dB10E7037";
  const assetAddress = "0xD1A48A48ebcd645c820270244111e29f87bff49d";

  // 2. Deploy Strategy Manager
  console.log("1. Deploying StrategyManager...");
  const StrategyManager = await hre.ethers.getContractFactory("StrategyManager");
  const manager = await StrategyManager.deploy(vaultAddress);
  await manager.waitForDeployment();
  const managerAddress = await manager.getAddress();
  console.log("✅ StrategyManager deployed to:", managerAddress);

  // 3. Link Strategies
  console.log("2. Linking Strategies to Manager...");
  const managerContract = await hre.ethers.getContractAt("StrategyManager", managerAddress);
  
  // Add to active strategy list
  const tx1 = await managerContract.addStrategy(anchorAddress);
  await tx1.wait();
  const tx2 = await managerContract.addStrategy(growthAddress);
  await tx2.wait();
  console.log("✅ Strategies added.");

  // 4. Set Allocations
  // GROWTH Mode (0): 60% Anchor, 40% Growth
  console.log("3. Setting Allocations for GROWTH mode...");
  const tx3 = await managerContract.setAllocation(0, anchorAddress, 6000);
  await tx3.wait();
  const tx4 = await managerContract.setAllocation(0, growthAddress, 4000);
  await tx4.wait();

  // FORTRESS Mode (1): 100% Anchor, 0% Growth
  console.log("4. Setting Allocations for FORTRESS mode...");
  const tx5 = await managerContract.setAllocation(1, anchorAddress, 10000);
  await tx5.wait();
  const tx6 = await managerContract.setAllocation(1, growthAddress, 0);
  await tx6.wait();
  console.log("✅ Allocations set.");

  // 5. Update Config File Cleanly
  const configPath = path.join(__dirname, "../config/contracts.ts");
  const cleanConfig = `import CitadelVaultArtifact from '../artifacts/contracts/CitadelVault.sol/CitadelVault.json';
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

  fs.writeFileSync(configPath, cleanConfig);
  console.log("✅ Config updated and saved to config/contracts.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
