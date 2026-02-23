const hre = require("hardhat");

/**
 * SENTINEL BOT (Autonomous Keeper)
 * ----------------------------
 * This bot monitors the Citadel Protocol on-chain and triggers 
 * autonomous rebalancing based on oracle-fed volatility.
 */

// Stable contract addresses from bscTestnet deployment
const ADDRESSES = {
  VolatilityOracle: "0xC9B8Aa9EFbAc3248577Cf90805D9f0FAacF83F45", 
  CitadelVault: "0xd651a29a866Db642A83D7F47BDa751b38bd40200",
};

async function main() {
  const [keeper] = await hre.ethers.getSigners();
  console.log("-----------------------------------------");
  console.log("🤖 SENTINEL INTELLIGENCE SYSTEM v1.0.4");
  console.log("🛡️ Sentinel Address:", keeper.address);
  console.log("-----------------------------------------");

  const oracle = await hre.ethers.getContractAt("VolatilityOracle", ADDRESSES.VolatilityOracle);
  const vault = await hre.ethers.getContractAt("CitadelVault", ADDRESSES.CitadelVault);

  console.log("📡 Initializing Neural Monitoring Feed...");
  
  // Monitoring Loop
  setInterval(async () => {
    try {
      const vol = Number(await oracle.volatility());
      const mode = Number(await vault.currentMode());
      const timestamp = new Date().toLocaleTimeString();

      process.stdout.write(`\r[${timestamp}] Volatility: ${vol}% | Mode: ${mode === 0 ? "GROWTH" : "FORTRESS"} | Status: Monitoring...`);

      // Threshold Logic (Matching Smart Contract)
      const HIGH_VOL = 65;
      const LOW_VOL = 45;

      if (mode === 0 && vol > HIGH_VOL) {
        console.log("\n🚨 ALERT: Volatility breach detected (>65%). Initiating FORTRESS adaptation...");
        const tx = await vault.adapt();
        console.log(`⏳ Tx Sent: ${tx.hash}`);
        await tx.wait();
        console.log("✅ FORTRESS mode synchronized onship.");
      } else if (mode === 1 && vol < LOW_VOL) {
        console.log("\n🌤️ STATUS: Market stabilization detected (<45%). Restoring GROWTH posture...");
        const tx = await vault.adapt();
        console.log(`⏳ Tx Sent: ${tx.hash}`);
        await tx.wait();
        console.log("✅ GROWTH mode restored autonomously.");
      }

    } catch (err) {
      console.error("\n❌ SENTINEL ERROR:", err.message);
    }
  }, 10000); // 10s scan interval
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
