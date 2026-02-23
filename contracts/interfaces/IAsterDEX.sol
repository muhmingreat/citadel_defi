// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAsterDEX {
    /**
     * @dev Deposit assets into AsterDEX Earn.
     * @param amount Amount of assets to deposit.
     * @param receiver Address to receive the yield-bearing tokens (or rights).
     */
    function deposit(uint256 amount, address receiver) external;

    /**
     * @dev Withdraw assets from AsterDEX Earn.
     * @param shares Amount of yield-bearing tokens (or shares) to burn/withdraw.
     * @param receiver Address to receive the underlying assets.
     */
    function withdraw(uint256 shares, address receiver) external;

    /**
     * @dev View the total assets managed by this strategy/vault.
     */
    function totalAssets() external view returns (uint256);
}
