// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Reputation} from "./Reputation.sol";
import {KnowYourHacker} from "./KnowYourHacker.sol";
import {Bounty} from "./Bounty.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title - Bounty contract
/// @notice - Bounty contract for the bounty platform
contract BountyFactory is Ownable {
    Reputation private immutable i_token;
    KnowYourHacker private immutable i_nft;
    address[] private _bounties;

    constructor() Ownable(msg.sender) {
        /// @dev Bounty contract is owner of reputation erc20 token and KYH erc721 token
        i_token = new Reputation();
        i_nft = new KnowYourHacker();
    }

    function createBounty() external {
        // TODO : Create a Bounty
        // 1. Deploy new contract
        // 2. Should have a bounty price, bounty level ( will use to fix reputation tokens to be given out )
        // 3. Should have a bounty metaData
        // 4. Should have details related to gating related to tokens ( Note :- Bounty created can have gating upto max reputation points that he/she holds and also KYH if he/she has KYH NFT )
        // 5. Maintain states that bounty is open, completed, winner declared ( Note :- Winner declared can be done by bounty creator or by bounty factory contract )
    }

    function declareBountyWinner(address BountyAddress, address winner) external {
        // TODO : Declare bounty winner of the specified bounty address
        // Can be called by bounty creator or this contract only
        // also transfers the reputation points to the winner
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
