// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {BountyFactory} from "../src/BountyFactory.sol";
import {console} from "forge-std/Test.sol";

contract DeployBountyFactory is Script {
    function run() external returns (BountyFactory bountyFactory) {
        vm.startBroadcast();
        bountyFactory = new BountyFactory();
        vm.stopBroadcast();

        console.log("BountyFactory address: %s", address(bountyFactory));
        console.log("Reputation address: %s", address(bountyFactory.getReputationTokenAddress()));
        console.log("KYH address: %s", address(bountyFactory.getKYHTokenAddress()));
    }
}
