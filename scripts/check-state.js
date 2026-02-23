const { ethers } = require("hardhat");

async function main() {
  const SM_ADDRESS = "0x3976D8533fA246DCaE3D06B894043E0F61BDf812";
  const VO_ADDRESS = "0xd841EA140c4c760C5aAAe90bE9992bD4292FD4aA";
  const ASTER = "0x3187Af24212a43A6349Ce127331a5cac473dF4fE";
  const PANCAKE = "0x3369A8f825EfAcE7ef31BbE1747EEF8dB10E7037";

  console.log("Checking Strategy Manager...");
  const sm = await ethers.getContractAt("StrategyManager", SM_ADDRESS);
  const asterAlloc = await sm.getTargetAllocation(ASTER);
  const pancakeAlloc = await sm.getTargetAllocation(PANCAKE);
  
  console.log("Aster Allocation:", asterAlloc.toString());
  console.log("Pancake Allocation:", pancakeAlloc.toString());

  console.log("\nChecking Volatility Oracle...");
  const vo = await ethers.getContractAt("VolatilityOracle", VO_ADDRESS);
  const vol = await vo.volatility();
  console.log("Current Volatility:", vol.toString());

  const block = await ethers.provider.getBlockNumber();
  console.log("\nCurrent Block:", block);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
