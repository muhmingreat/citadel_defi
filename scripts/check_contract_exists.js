const { createPublicClient, http } = require('viem');
const { bscTestnet } = require('viem/chains');

const client = createPublicClient({
  chain: bscTestnet,
  transport: http('https://bsc-testnet.bnbchain.org'),
});

const address = "0xE81Dd2EB89d725e31AB8CD1be5beB0B164C07a1C";

async function check() {
  console.log(`Checking code at ${address}...`);
  const code = await client.getBytecode({ address });
  console.log("Code length:", code ? code.length : 0);
  if (!code || code === '0x') {
    console.log("❌ No contract found at this address on BSC Testnet.");
  } else {
    console.log("✅ Contract found!");
  }
}

check().catch(console.error);
