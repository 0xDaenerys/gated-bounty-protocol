// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Reputation} from "./Reputation.sol";
import {KnowYourHacker} from "./KnowYourHacker.sol";
import {Bounty} from "./Bounty.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title - Bounty contract
/// @notice - Bounty contract for the bounty platform
contract BountyFactory is Ownable {
    error BountyFactory__UserAlreadyVerified();

    Reputation private immutable i_token;
    KnowYourHacker private immutable i_nft;
    address[] private _bounties;

    constructor() Ownable(msg.sender) {
        /// @dev Bounty contract is owner of reputation erc20 token and KYH erc721 token
        i_token = new Reputation();
        i_nft = new KnowYourHacker();
    }

    function verifyUser(string memory userName) external {
        if(i_nft.balanceOf(msg.sender) > 0){
            revert BountyFactory__UserAlreadyVerified();
        }
        i_nft.mint(msg.sender, userName);
        i_token.mint(msg.sender, 200);
    }

    function createBounty(
        uint256 requiredReputation,
        bool requiredKYH,
        string memory metadata,
        uint256 startTime,
        uint256 endTime
    ) external {
        Bounty bounty =
        new Bounty(msg.sender, requiredReputation,  requiredKYH, metadata, startTime, endTime, address(i_token), address(i_nft));
        _bounties.push(address(bounty));
    }

    function declareBountyWinner(address BountyAddress, address payable winner) external onlyOwner(){
        Bounty bounty = Bounty(BountyAddress);
        bounty.declareWinner(winner);
    }

    /**
     * Getters
     */
    function getReputationTokenAddress() external view returns (address) {
        return address(i_token);
    }

    function getKYHTokenAddress() external view returns (address) {
        return address(i_nft);
    }

    function getAllBounties() external view returns (address[] memory) {
        return _bounties;
    }
}