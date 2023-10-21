// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Reputation} from "./Reputation.sol";
import {KnowYourHacker} from "./KnowYourHacker.sol";

contract Bounty is Ownable {
    error Bounty__InvalidStartTime();
    error Bounty__InvalidEndTime();
    error Bounty__UnauthorizedAccess();
    error Bounty__InvalidGating();
    error Bounty__NotStarted();
    error Bounty__NotEnded();
    error Bounty__Ended();
    error Bounty__AlreadyCompleted();
    error Bounty__InvalidWinner();

    enum State {
        Active,
        Completed
    }
    enum Level {
        Beginner,
        Intermediate,
        Advanced
    }

    struct Submission {
        address hacker;
        string submissionLink;
    }

    uint256 private constant MIN_INTERMEDIATE_REPUTATION = 200;
    uint256 private constant MIN_ADVANCE_REPUTATION = 500;
    string private _groupChatId;
    address private immutable i_reputationToken;
    address private immutable i_kyhToken;
    /// @dev - Resolves disputes in case of Bounty winneer declaration
    address private immutable i_resolver;
    uint256 private immutable i_requiredReputation;
    bool private immutable i_requiredKYH;
    State private _state;
    Level private _level;
    /// @dev - MetaData IPFS hash of the bounty
    string private _metaData;
    uint256 private _startTime;
    uint256 private _endTime;
    Submission[] private submissionList;
    address private _winner;

    constructor(
        address creator,
        uint256 requiredReputation,
        bool requiredKYH,
        string memory metadata,
        uint256 startTime,
        uint256 endTime,
        address reputationToken,
        address kyhToken,
        string memory groupChatId
    ) payable Ownable(creator) {
        if (startTime < block.timestamp) {
            revert Bounty__InvalidStartTime();
        }
        if (endTime < startTime) {
            revert Bounty__InvalidEndTime();
        }
        Reputation reputation = Reputation(reputationToken);
        KnowYourHacker kyh = KnowYourHacker(kyhToken);

        /// @dev - Creator should atleast have the required reputation points and KYH NFT if required
        if (i_requiredReputation > reputation.balanceOf(creator) || (requiredKYH && kyh.balanceOf(creator) == 0)) {
            revert Bounty__InvalidGating();
        }

        i_resolver = msg.sender;
        i_requiredReputation = requiredReputation;
        i_requiredKYH = requiredKYH;
        _metaData = metadata;
        _startTime = startTime;
        _endTime = endTime;
        _state = State.Active;
        _groupChatId = groupChatId;
        _decideBountyLevel();
    }

    function _decideBountyLevel() private {
        if (i_requiredReputation <= MIN_INTERMEDIATE_REPUTATION) {
            _level = Level.Beginner;
        } else if (i_requiredReputation <= MIN_ADVANCE_REPUTATION) {
            _level = Level.Intermediate;
        } else {
            _level = Level.Advanced;
        }
    }

    function _addressIncludedInSubmissions(address _searchAddress) private view returns (bool) {
        for (uint256 i = 0; i < submissionList.length; i++) {
            if (submissionList[i].hacker == _searchAddress) {
                return true;
            }
        }
        return false;
    }

    function declareWinner(address payable hacker) external {
        if (msg.sender != i_resolver) {
            revert Bounty__UnauthorizedAccess();
        }
        if (block.timestamp < _endTime) {
            revert Bounty__NotEnded();
        }
        if (_state == State.Completed) {
            revert Bounty__AlreadyCompleted();
        }
        if (!_addressIncludedInSubmissions(hacker)) {
            revert Bounty__InvalidWinner();
        }
        _winner = hacker;
        _state = State.Completed;
        Reputation reputation = Reputation(i_reputationToken);

        if (_level == Level.Beginner) {
            reputation.mint(hacker, 100 * 10 ** 18);
        } else if (_level == Level.Intermediate) {
            reputation.mint(hacker, 300 * 10 ** 18);
        } else {
            reputation.mint(hacker, 500 * 10 ** 18);
        }

        // Use the call method to transfer the funds
        (bool success,) = hacker.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    function addSubmission(address hacker, string memory submissionLink) external {
        if (block.timestamp < _startTime) {
            revert Bounty__NotStarted();
        }
        if (block.timestamp >= _endTime) {
            revert Bounty__Ended();
        }

        Reputation reputation = Reputation(i_reputationToken);
        KnowYourHacker kyh = KnowYourHacker(i_kyhToken);

        /// @dev - Creator should atleast have the required reputation points and KYH NFT if required
        if (i_requiredReputation > reputation.balanceOf(hacker) || (i_requiredKYH && kyh.balanceOf(hacker) == 0)) {
            revert Bounty__InvalidGating();
        }

        submissionList.push(Submission(hacker, submissionLink));
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
        return i_requiredReputation;
    }

    function getBountyRequiredKYH() external view returns (bool) {
        return i_requiredKYH;
    }

    function getBountyRewardPrice() external view returns (uint256) {
        return address(this).balance;
    }

    function getBountyGroupChatId() external view returns (string memory) {
        return _groupChatId;
    }

    function getBountySubmissions() external view returns (Submission[] memory) {
        return submissionList;
    }

    function getWinner() external view returns (address) {
        return _winner;
    }
}
