// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {Reputation} from "../src/Reputation.sol";

contract ReputationTest is Test {
    Reputation public reputation;
    address private USER = makeAddr("USER");

    function setUp() public {
        reputation = new Reputation();
    }

    function test_InitialSupply() public view {
        assert(reputation.totalSupply() == 0);
    }

    function test_Name() public {
        assertEq(reputation.name(), "Reputation");
    }

    function test_Symbol() public {
        assertEq(reputation.symbol(), "RP");
    }

    function test_Decimals() public {
        assertEq(reputation.decimals(), 18);
    }

    function test_OwnerMint() public {
        // Called by address.this ie owner
        reputation.mint(USER, 1 ether);
        assertEq(reputation.balanceOf(USER), 1 ether);
    }

    function test_NonOwnerMint() public {
        address nonOwner = makeAddr("nonOwner");
        vm.prank(nonOwner);
        vm.expectRevert();
        reputation.mint(USER, 1 ether);
    }

    function test_Burn() public {
        reputation.mint(USER, 1 ether);
        vm.prank(USER);
        reputation.burn();
        assertEq(reputation.balanceOf(USER), 0);
    }

    function test_Transfer() public {
        reputation.mint(address(this), 5 ether);
        vm.expectRevert(Reputation.Reputation__TransferNotAllowed.selector);
        reputation.transfer(USER, 1 ether);
    }

    function test_TransferFrom() public {
        reputation.mint(address(this), 5 ether);
        // Approve owner itself to call TranserFrom
        reputation.approve(address(this), 1 ether);
        assertEq(reputation.balanceOf(address(this)), 5 ether);
        vm.expectRevert(Reputation.Reputation__TransferNotAllowed.selector);
        reputation.transferFrom(address(this), USER, 1 ether);
    }
}
