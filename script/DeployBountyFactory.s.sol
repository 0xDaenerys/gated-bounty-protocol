// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {BountyFactory} from "../src/BountyFactory.sol";

contract DeployBountyFactory is Script {
    function run() external returns (BountyFactory bountyFactory) {
        vm.startBroadcast();
        bountyFactory = new BountyFactory();
        vm.stopBroadcast();
    }
}