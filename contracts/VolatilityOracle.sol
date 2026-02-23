// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title VolatilityOracle
 * @dev Serves as the "eyes" of the self-driving engine. 
 * Stores market volatility data to trigger autonomous decisions.
 */
contract VolatilityOracle is AccessControl {
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    // Volatility Index: 0 (Stable) to 100 (Extreme Panic)
    uint256 public volatility;
    uint256 public lastUpdate;

    event VolatilityUpdated(uint256 newValue, uint256 timestamp);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
        volatility = 50; // Start neutral
    }

    /**
     * @dev Update the volatility metric. In prod, this comes from Chainlink/API3.
     */
    function setVolatility(uint256 _volatility) external onlyRole(UPDATER_ROLE) {
        require(_volatility <= 100, "Invalid scale");
        volatility = _volatility;
        lastUpdate = block.timestamp;
        emit VolatilityUpdated(_volatility, block.timestamp);
    }
}
