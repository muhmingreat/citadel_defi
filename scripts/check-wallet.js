const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const address = signer.address;
  console.log("----------------------------------------------------");
  console.log("Wallet Address:", address);
  
  const balance = await hre.ethers.provider.getBalance(address);
  console.log("Balance:", hre.ethers.formatEther(balance), "BNB");
  console.log("----------------------------------------------------");

  if (balance === 0n) {
    console.warn("⚠️  WARNING: Balance is 0.0 BNB. Deployment will fail.");
    console.warn("Please fund this address at: https://www.bnbchain.org/en/testnet-faucet");
  } else {
    console.log("✅ Wallet has funds. Ready to deploy.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
