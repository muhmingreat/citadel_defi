require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Localhost (default)
    hardhat: {
    },
    // BNB Smart Chain Testnet
    bscTestnet: {
      url: "https://rpc.ankr.com/bsc_testnet_chapel",
      chainId: 97,
      timeout: 200000,
      accounts: process.env.PRIVATE_KEY ? (process.env.PRIVATE_KEY.startsWith('0x') ? [process.env.PRIVATE_KEY] : [`0x${process.env.PRIVATE_KEY}`]) : [],
    },
    // BNB Smart Chain Mainnet
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: process.env.PRIVATE_KEY ? (process.env.PRIVATE_KEY.startsWith('0x') ? [process.env.PRIVATE_KEY] : [`0x${process.env.PRIVATE_KEY}`]) : [],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
