// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Bounty is Ownable {
    error Bounty__InvalidStartTime();
    error Bounty__InvalidEndTime();
    error Bounty__UnauthorizedAccess();

    enum State {
        Active,
        Completed,
        WinnerDeclared
    }
    enum Level {
        Beginner,
        Intermediate,
        Advanced
    }

    uint256 private constant MIN_INTERMEDIATE_REPUTATION = 200;
    uint256 private constant MIN_ADVANCE_REPUTATION = 500;
    /// @dev - Resolves disputes in case of Bounty winneer declaration
    address private immutable _resolver;
    uint256 private immutable _requiredReputation;
    bool private immutable _requiredKYH;
    State private _state;
    Level private _level;
    /// @dev - MetaData IPFS hash of the bounty
    string private _metaData;
    uint256 private _startTime;
    uint256 private _endTime;

    constructor(
        address creator,
        uint256 requiredReputation,
        bool requiredKYH,
        string memory metadata,
        uint256 startTime,
        uint256 endTime
    ) Ownable(creator) {
        if (startTime < block.timestamp) {
            revert Bounty__InvalidStartTime();
        }
        if (endTime < startTime) {
            revert Bounty__InvalidEndTime();
        }
        // TODO : Check if creator has enough reputation to create bounty AND KYH NFT if required

        _resolver = msg.sender;
        _requiredReputation = requiredReputation;
        _requiredKYH = requiredKYH;
        _metaData = metadata;
        _startTime = startTime;
        _endTime = endTime;
        _state = State.Active;
        _decideBountyLevel();
    }

    function _decideBountyLevel() private {
        if (_requiredReputation <= MIN_INTERMEDIATE_REPUTATION) {
            _level = Level.Beginner;
        } else if (_requiredReputation <= MIN_ADVANCE_REPUTATION) {
            _level = Level.Intermediate;
        } else {
            _level = Level.Advanced;
        }
    }

    function addSubmission(address hacker, string memory submissionLink) external {
        // TODO : Add submission
    }

    /**
     * GETTERS
     */

    function getBountyState() external view returns (State) {
        return _state;
    }

    function getBountyLevel() external view returns (Level) {
        return _level;
    }

    function getBountyMetaData() external view returns (string memory) {
        return _metaData;
    }

    function getBountyStartTime() external view returns (uint256) {
        return _startTime;
    }

    function getBountyEndTime() external view returns (uint256) {
        return _endTime;
    }

    function getBountyRequiredReputation() external view returns (uint256) {
        return _requiredReputation;
    }

    function getBountyRequiredKYH() external view returns (bool) {
        return _requiredKYH;
    }

    function getBountyRewardPrice() external view returns (uint256) {
        return address(this).balance;
    }
}
