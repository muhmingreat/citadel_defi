const hre = require("hardhat");
const { CONTRACT_ADDRESSES } = require("../config/contracts");

async function main() {
  console.log("🔍 Verifying MockUSDC at:", CONTRACT_ADDRESSES.MockUSDC);

  // 1. Get Contract Factory
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  
  // 2. Attach to Address
  const mockUSDC = MockERC20.attach(CONTRACT_ADDRESSES.MockUSDC);

  // 3. Check Basic Info (Read Operation)
  console.log("mockUSDC.symbol()...");
  try {
    const symbol = await mockUSDC.symbol();
    console.log("✅ Symbol:", symbol);
  } catch (e) {
    console.error("❌ Failed to read symbol:", e.message);
  }

  try {
    const decimals = await mockUSDC.decimals();
    console.log("✅ Decimals:", decimals);
  } catch (e) {
    console.error("❌ Failed to read decimals:", e.message);
  }

  // 4. Dry Run Mint (Estimate Gas)
  const [signer] = await hre.ethers.getSigners();
  console.log("👤 Signer:", signer.address);

  try {
    const amount = hre.ethers.parseUnits("1000", 18);
    console.log(`Simulating mint(${signer.address}, ${amount})...`);
    
    // Static Call (Simulation)
    await mockUSDC.mint.staticCall(signer.address, amount);
    console.log("✅ Mint simulation successful (no revert)");
    
    // Estimate Gas
    const gas = await mockUSDC.mint.estimateGas(signer.address, amount);
    console.log("✅ Gas Estimate:", gas.toString());

  } catch (e) {
    console.error("❌ Mint simulation failed:", e.message);
    if (e.data) console.error("   Error Data:", e.data);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
