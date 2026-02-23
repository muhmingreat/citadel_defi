const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying missing strategies with account:", deployer.address);

  const assetAddress = "0xEB00C23B54A9eDD053Cdbf45095B4E834f9C754E"; // From your previous output

  // 1. Deploy AsterDEX Strategy
  const AsterDEXStrategy = await hre.ethers.getContractFactory("AsterDEXStrategy");
  const strategyAnchor = await AsterDEXStrategy.deploy(assetAddress);
  await strategyAnchor.waitForDeployment();
  console.log("AsterDEXStrategy deployed to:", await strategyAnchor.getAddress());

  // 2. Deploy Pancake Strategy
  const PancakeStrategy = await hre.ethers.getContractFactory("PancakeStrategy");
  const strategyGrowth = await PancakeStrategy.deploy(assetAddress);
  await strategyGrowth.waitForDeployment();
  console.log("PancakeStrategy deployed to:", await strategyGrowth.getAddress());

  console.log("------------------------------------------------");
  console.log("Please copy these addresses to config/contracts.ts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
