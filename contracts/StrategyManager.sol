// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CitadelVault.sol";
import "./interfaces/IStrategy.sol";

/**
 * @title StrategyManager
 * @dev Manages strategy allocations for CitadelVault based on its current mode.
 */
contract StrategyManager is AccessControl {
    bytes32 public constant STRATEGIST_ROLE = keccak256("STRATEGIST_ROLE");

    CitadelVault public vault;

    // Mode -> Strategy -> Weight (in basis points, e.g. 5000 = 50%)
    mapping(CitadelVault.Mode => mapping(address => uint256))
        public targetAllocations;

    // Active strategies
    address[] public strategies;

    event AllocationUpdated(
        CitadelVault.Mode mode,
        address strategy,
        uint256 weight
    );
    event Rebalanced(CitadelVault.Mode mode);

    constructor(address _vault) {
        vault = CitadelVault(_vault);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(STRATEGIST_ROLE, msg.sender);
    }

    /**
     * @dev Add a new strategy to the system.
     */
    function addStrategy(
        address _strategy
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        strategies.push(_strategy);
    }

    /**
     * @dev Set target allocation for a strategy in a specific mode.
     */
    function setAllocation(
        CitadelVault.Mode _mode,
        address _strategy,
        uint256 _weight
    ) external onlyRole(STRATEGIST_ROLE) {
        targetAllocations[_mode][_strategy] = _weight;
        emit AllocationUpdated(_mode, _strategy, _weight);
    }

    /**
     * @dev Rebalance the vault's assets across strategies based on the current mode.
     * Note: This is a simplified version. Real rebalancing is complex.
     */
    function rebalance() external onlyRole(STRATEGIST_ROLE) {
        CitadelVault.Mode currentMode = vault.currentMode();

        // Logic would go here:
        // 1. Withdraw from strategies that are overweight
        // 2. Deposit into strategies that are underweight

        emit Rebalanced(currentMode);
    }

    /**
     * @dev View function to get the target weight for a strategy in the current mode.
     */
    function getTargetAllocation(
        address _strategy
    ) external view returns (uint256) {
        return targetAllocations[vault.currentMode()][_strategy];
    }

    /**
     * @dev Calculates the weighted average APY across all active strategies for the current mode.
     * Returns APY in basis points (e.g. 1250 = 12.5%).
     */
    function getNetAPY() external view returns (uint256) {
        CitadelVault.Mode currentMode = vault.currentMode();
        uint256 totalWeightedAPY = 0;

        for (uint256 i = 0; i < strategies.length; i++) {
            address strategyAddr = strategies[i];
            uint256 weight = targetAllocations[currentMode][strategyAddr]; // in bps
            uint256 rate = IStrategy(strategyAddr).yieldRate(); // in bps

            totalWeightedAPY += (weight * rate) / 10000;
        }

        return totalWeightedAPY;
    }
}
