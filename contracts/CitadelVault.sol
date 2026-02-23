// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IStrategy.sol";
import "./VolatilityOracle.sol";

/**
 * @title CitadelVault
 * @dev Autonomous ERC4626 Vault.
 * "Self-Driving": Switches modes automatically based on Oracle Volatility.
 */
contract CitadelVault is ERC4626, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");

    enum Mode { GROWTH, FORTRESS }

    Mode public currentMode;
    VolatilityOracle public oracle;
    
    // Config
    uint256 public constant VOLATILITY_THRESHOLD_HIGH = 65; // Above 65 -> Fortress
    uint256 public constant VOLATILITY_THRESHOLD_LOW = 45;  // Below 45 -> Growth
    
    // Events
    event ModeChanged(Mode newMode, uint256 triggerVolatility);
    event OracleUpdated(address indexed newOracle);

    constructor(IERC20 _asset, address _oracle, string memory _name, string memory _symbol) 
        ERC4626(_asset) 
        ERC20(_name, _symbol) 
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        oracle = VolatilityOracle(_oracle);
        currentMode = Mode.GROWTH;
    }

    /**
     * @dev The Self-Driving Trigger.
     * Publicly callable (or restricted to Keepers/Automation Bots) to adapt to market conditions.
     */
    function adapt() external nonReentrant {
        uint256 vol = oracle.volatility();
        
        if (currentMode == Mode.GROWTH && vol > VOLATILITY_THRESHOLD_HIGH) {
            currentMode = Mode.FORTRESS;
            emit ModeChanged(Mode.FORTRESS, vol);
            // In full implementation: trigger immediate rebalance to AsterDEX
        } else if (currentMode == Mode.FORTRESS && vol < VOLATILITY_THRESHOLD_LOW) {
            currentMode = Mode.GROWTH;
            emit ModeChanged(Mode.GROWTH, vol);
            // In full implementation: trigger rebalance to PancakeSwap
        }
    }

    // Admin functions
    function setOracle(address _oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        oracle = VolatilityOracle(_oracle);
        emit OracleUpdated(_oracle);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

    // ERC4626 Overrides
    function deposit(uint256 assets, address receiver) public override nonReentrant whenNotPaused returns (uint256) {
        return super.deposit(assets, receiver);
    }
    function withdraw(uint256 assets, address receiver, address owner) public override nonReentrant returns (uint256) {
        return super.withdraw(assets, receiver, owner);
    }
    function mint(uint256 shares, address receiver) public override nonReentrant whenNotPaused returns (uint256) {
        return super.mint(shares, receiver);
    }
    function redeem(uint256 shares, address receiver, address owner) public override nonReentrant returns (uint256) {
        return super.redeem(shares, receiver, owner);
    }
}
