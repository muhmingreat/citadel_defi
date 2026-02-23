const hre = require("hardhat");
const { CONTRACT_ADDRESSES } = require("../config/contracts");

async function main() {
  console.log("🔍 Checking MockUSDC at:", CONTRACT_ADDRESSES.MockUSDC);
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  const mockUSDC = MockERC20.attach(CONTRACT_ADDRESSES.MockUSDC);

  try {
    const symbol = await mockUSDC.symbol();
    console.log("✅ Check Passed! Symbol:", symbol);
  } catch (e) {
    console.error("❌ Check Failed:", e.message);
  }
}

main().catch(console.error);
