// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/IStrategy.sol";

/**
 * @title MockStrategy
 * @dev A strategy that simulates yield by minting mock tokens (for testnet/dev).
 */
contract MockStrategy is IStrategy, Ownable {
    IERC20 public immutable underlying;
    uint256 public totalAssets;
    uint256 public currentYieldRate; // in basis points

    constructor(address _asset) Ownable(msg.sender) {
        underlying = IERC20(_asset);
        currentYieldRate = 500; // Default 5%
    }

    function asset() external view override returns (IERC20) {
        return underlying;
    }

    function balanceOf() external view override returns (uint256) {
        return totalAssets;
    }

    function deposit(uint256 amount) external override {
        require(amount > 0, "Amount must be > 0");
        // Transfer from Vault to Strategy
        underlying.transferFrom(msg.sender, address(this), amount);
        totalAssets += amount;
    }

    function withdraw(
        uint256 amount
    ) external override onlyOwner returns (uint256) {
        require(amount <= totalAssets, "Insufficient balance");
        totalAssets -= amount;
        underlying.transfer(msg.sender, amount);
        return amount;
    }

    function harvest() external override {
        // Simulate yield based on currentYieldRate
        uint256 yield = (totalAssets * currentYieldRate) / 10000;
        totalAssets += yield;
    }

    function yieldRate() external view override returns (uint256) {
        return currentYieldRate;
    }

    function setYieldRate(uint256 _newRate) external onlyOwner {
        currentYieldRate = _newRate;
    }
}
