// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title - Reputation token
/// @notice - Reputation token denotes the reputation of the user on the bounty platform on a specific chain
contract Reputation is ERC20, Ownable {
    error Reputation__TransferNotAllowed();

    constructor() ERC20("Reputation", "RP") Ownable(msg.sender) {}

    /// @notice - Mint reputation tokens
    /// @param to - Address of the user to mint tokens to
    /// @param amount - Amount of tokens to mint
    /// @dev - Events for minting - 1. User verified, 2. Bounty completion
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /// @notice - Burn reputation tokens
    /// @dev - Need for burning - Account deletion
    function burn() external {
        _burn(msg.sender, balanceOf(msg.sender));
    }

    /// @notice - Override _update function to prevent transfer of reputation tokens
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
            revert Reputation__TransferNotAllowed();
        }
        super._update(from, to, value);
    }
}
