import CitadelVaultArtifact from '../artifacts/contracts/CitadelVault.sol/CitadelVault.json';
import VolatilityOracleArtifact from '../artifacts/contracts/VolatilityOracle.sol/VolatilityOracle.json';
import AsterDEXStrategyArtifact from '../artifacts/contracts/strategies/AsterDEXStrategy.sol/AsterDEXStrategy.json';
import PancakeStrategyArtifact from '../artifacts/contracts/strategies/PancakeStrategy.sol/PancakeStrategy.json';
import MockERC20Artifact from '../artifacts/contracts/MockERC20.sol/MockERC20.json';
import StrategyManagerArtifact from '../artifacts/contracts/StrategyManager.sol/StrategyManager.json';

export const CONTRACT_ADDRESSES = {
  VolatilityOracle: "0xF87A84Be11A52ef74B9C4d372Ff0aeC78f568191", 
  CitadelVault: "0xe842E29Da4a0739EECF5088710CC82ab9029C5C4",
  StrategyManager: "0xBA692354C8Da286689110BCfC9c9223aCCD7Eb08",
  AsterDEXStrategy: "0x6e4bF8Da9cdE440e56E8235ECd1a6500a4d0d72e",
  PancakeStrategy: "0xD187F78d5194643D7561efFd08FcfD44EB6245Ec",
  MockUSDC: "0xc5Fa30A09C80c4DF6eDb3c23e268549bB3F73256",
};

export const CONTRACTS = {
  VolatilityOracle: {
    address: CONTRACT_ADDRESSES.VolatilityOracle as `0x${string}`,
    abi: VolatilityOracleArtifact.abi,
  },
  CitadelVault: {
    address: CONTRACT_ADDRESSES.CitadelVault as `0x${string}`,
    abi: CitadelVaultArtifact.abi,
  },
  StrategyManager: {
    address: CONTRACT_ADDRESSES.StrategyManager as `0x${string}`,
    abi: StrategyManagerArtifact.abi,
  },
  AsterDEXStrategy: {
    address: CONTRACT_ADDRESSES.AsterDEXStrategy as `0x${string}`,
    abi: AsterDEXStrategyArtifact.abi,
  },
  PancakeStrategy: {
    address: CONTRACT_ADDRESSES.PancakeStrategy as `0x${string}`,
    abi: PancakeStrategyArtifact.abi,
  },
  MockUSDC: {
    address: CONTRACT_ADDRESSES.MockUSDC as `0x${string}`,
    abi: MockERC20Artifact.abi,
  },
} as const;
