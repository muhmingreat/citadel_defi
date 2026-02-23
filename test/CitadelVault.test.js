const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Citadel Self-Driving Engine", function () {
  let CitadelVault, vault;
  let VolatilityOracle, oracle;
  let MockStrategy, asterDexStrategy, pancakeStrategy;
  let MockERC20, asset;
  let admin, keeper, user;

  beforeEach(async function () {
    [admin, keeper, user] = await ethers.getSigners();

    // 1. Deploy Asset
    MockERC20 = await ethers.getContractFactory("MockERC20");
    asset = await MockERC20.deploy("Mock USDC", "mUSDC");
    await asset.waitForDeployment();

    // 2. Deploy Oracle
    VolatilityOracle = await ethers.getContractFactory("VolatilityOracle");
    oracle = await VolatilityOracle.deploy();
    await oracle.waitForDeployment();

    // Grant UPDATER_ROLE to keeper for testing
    const UPDATER_ROLE = await oracle.UPDATER_ROLE();
    await oracle.grantRole(UPDATER_ROLE, keeper.address);

    // 3. Deploy Autonomous Vault
    // Note: Constructor now requires Oracle address
    CitadelVault = await ethers.getContractFactory("CitadelVault");
    vault = await CitadelVault.deploy(await asset.getAddress(), await oracle.getAddress(), "Citadel Vault", "CTDL");
    await vault.waitForDeployment();

    // 4. Deploy Strategies (Mocking AsterDEX and PancakeSwap)
    // In a real scenario, these would be linked to the StrategyManager
    MockStrategy = await ethers.getContractFactory("MockStrategy");
    asterDexStrategy = await MockStrategy.deploy(await asset.getAddress());
    pancakeStrategy = await MockStrategy.deploy(await asset.getAddress());
  });

  describe("Volatility Oracle", function () {
    it("Should start with neutral volatility (50)", async function () {
      expect(await oracle.volatility()).to.equal(50);
    });

    it("Should allow Keeper to update volatility from 'Chainlink'", async function () {
      await oracle.connect(keeper).setVolatility(80);
      expect(await oracle.volatility()).to.equal(80);
    });
  });

  describe("Self-Driving Logic (adapt)", function () {
    it("Should pass the 'Safe' check (Volatility < 45 -> Growth)", async function () {
      // 1. Set Volatility to LOW (Safe)
      await oracle.connect(keeper).setVolatility(30);

      // 2. Keeper calls adapt()
      // Even though we start in Growth, this verifies no error occurs
      await vault.adapt();
      expect(await vault.currentMode()).to.equal(0); // 0 = GROWTH
    });

    it("Should trigger 'Fortress Protocol' when Volatility > 65", async function () {
      // 1. Set Volatility to HIGH (Danger)
      await oracle.connect(keeper).setVolatility(75);

      // 2. Anyone calls adapt() (Public/Keeper function)
      await expect(vault.adapt())
        .to.emit(vault, "ModeChanged")
        .withArgs(1, 75); // 1 = FORTRESS

      // 3. Verify Mode Switch
      expect(await vault.currentMode()).to.equal(1);
    });

    it("Should switch back to Growth when Volatility drops", async function () {
      // 1. Force Fortress Mode first
      await oracle.connect(keeper).setVolatility(80);
      await vault.adapt();
      expect(await vault.currentMode()).to.equal(1);

      // 2. Markets recover (Volatility drops to 20)
      await oracle.connect(keeper).setVolatility(20);

      // 3. Adapt
      await vault.adapt();
      expect(await vault.currentMode()).to.equal(0); // Back to Growth
    });
  });

  describe("Hackathon Requirements", function () {
    it("Should be Non-Custodial (No Admin setMode)", async function () {
      // Verify that there is no 'setMode' function accessible to Admin
      // The old function was removed. We try to call it (if it existed) or rely on the pattern.
      // Since it's removed from ABI, we can't call it easily in JS without knowing the signature.
      // Instead, we verify that only adapt() changes the mode via the Oracle.
      
      // Attempt to change mode without Oracle (impossible by design now)
      // This is implicit in the contract structure.
      expect(vault.setMode).to.be.undefined;
    });
  });
});
