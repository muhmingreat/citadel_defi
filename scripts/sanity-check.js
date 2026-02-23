const hre = require("hardhat");
const { CONTRACT_ADDRESSES } = require("./config/contracts");

async function main() {
  console.log("🔍 Checking Contract Status...");
  
  for (const [name, address] of Object.entries(CONTRACT_ADDRESSES)) {
    console.log(`Checking ${name} at ${address}...`);
    const code = await hre.ethers.provider.getCode(address);
    if (code === "0x") {
      console.log(`❌ ${name}: NO CODE FOUND at this address!`);
    } else {
      console.log(`✅ ${name}: Code verified.`);
    }
  }

  // Check Volatility directly
  try {
    const vo = await hre.ethers.getContractAt("VolatilityOracle", CONTRACT_ADDRESSES.VolatilityOracle);
    const vol = await vo.volatility();
    console.log(`\n📈 Current Volatility: ${vol.toString()}%`);
  } catch (e) {
    console.log("❌ Failed to read volatility:", e.message);
  }
}

main().catch(console.error);
