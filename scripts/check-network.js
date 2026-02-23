const hre = require("hardhat");

async function main() {
  console.log("Testing connection to", hre.network.name);
  const blockNumber = await hre.ethers.provider.getBlockNumber();
  console.log("Current block number:", blockNumber);
  const [signer] = await hre.ethers.getSigners();
  console.log("Signer:", signer.address);
  const balance = await hre.ethers.provider.getBalance(signer.address);
  console.log("Balance:", hre.ethers.formatEther(balance));
}

main().catch(console.error);
