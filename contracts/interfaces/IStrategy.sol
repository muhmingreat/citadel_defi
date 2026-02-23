// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IStrategy {
    /**
     * @dev Returns the address of the underlying asset (e.g. USDC)
     */
    function asset() external view returns (IERC20);

    /**
     * @dev Returns the total amount of asset held by the strategy
     */
    function balanceOf() external view returns (uint256);

    /**
     * @dev Deposits amount of asset into the strategy
     */
    function deposit(uint256 amount) external;

    /**
     * @dev Withdraws amount of asset from the strategy
     */
    function withdraw(uint256 amount) external returns (uint256);

    /**
     * @dev Harvests yield and reinvests it
     */
    function harvest() external;

    /**
     * @dev Returns the current yield rate in basis points (e.g. 500 = 5%)
     */
    function yieldRate() external view returns (uint256);
}
