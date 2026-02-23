const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy Volatility Oracle (The Brain)
  const VolatilityOracle = await hre.ethers.getContractFactory("VolatilityOracle");
  const oracle = await VolatilityOracle.deploy();
  await oracle.waitForDeployment();
  console.log("VolatilityOracle deployed to:", await oracle.getAddress());

  // 2. Deploy Mock Asset (USDC) verification
  // For Hackathon demo, we deploy our own clean USDC
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const asset = await MockERC20.deploy("Mock USDC", "mUSDC");
  await asset.waitForDeployment();
  console.log("Mock Asset (mUSDC) deployed to:", await asset.getAddress());

  // 3. Deploy Citadel Vault (The Autonomous Core)
  const CitadelVault = await hre.ethers.getContractFactory("CitadelVault");
  // Constructor: asset, oracle, name, symbol
  const vault = await CitadelVault.deploy(await asset.getAddress(), await oracle.getAddress(), "Citadel Vault", "CTDL");
  await vault.waitForDeployment();
  console.log("CitadelVault (Self-Driving) deployed to:", await vault.getAddress());

  // 4. Deploy Strategies (The Execution)
  // AsterDEX Strategy (Anchor)
  const AsterDEXStrategy = await hre.ethers.getContractFactory("AsterDEXStrategy");
  const strategyAnchor = await AsterDEXStrategy.deploy(await asset.getAddress());
  await strategyAnchor.waitForDeployment();
  console.log("AsterDEXStrategy (Anchor) deployed to:", await strategyAnchor.getAddress());

  // Pancake Strategy (Growth)
  const PancakeStrategy = await hre.ethers.getContractFactory("PancakeStrategy");
  const strategyGrowth = await PancakeStrategy.deploy(await asset.getAddress());
  await strategyGrowth.waitForDeployment();
  console.log("PancakeStrategy (Growth) deployed to:", await strategyGrowth.getAddress());

  console.log("\nDeployment Complete! Copied addresses to dashboard configuration.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
