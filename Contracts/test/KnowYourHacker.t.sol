// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {KnowYourHacker} from "../src/KnowYourHacker.sol";

contract KnowYourHackerTest is Test {
    KnowYourHacker public knowYourHacker;
    address private USER = makeAddr("USER");
    string private constant USER_NAME = "XYZ";

    function setUp() public {
        knowYourHacker = new KnowYourHacker();
    }

    function test_InitialSupply() public view {
        assert(knowYourHacker.getTokenCount() == 0);
    }

    function test_Name() public {
        assertEq(knowYourHacker.name(), "KnowYourHacker");
    }

    function test_Symbol() public {
        assertEq(knowYourHacker.symbol(), "KYH");
    }

    function test_OwnerMint() public {
        // Called by address.this ie owner
        knowYourHacker.mint(USER, USER_NAME);
        assertEq(knowYourHacker.balanceOf(USER), 1);
    }

    function test_NonOwnerMint() public {
        address nonOwner = makeAddr("nonOwner");
        vm.prank(nonOwner);
        vm.expectRevert();
        knowYourHacker.mint(USER, USER_NAME);
    }

    function test_Burn() public {
        knowYourHacker.mint(USER, USER_NAME);
        vm.prank(USER);
        knowYourHacker.burn();
        assertEq(knowYourHacker.balanceOf(USER), 0);
    }

    function test_TransferFrom() public {
        knowYourHacker.mint(USER, USER_NAME);
        vm.expectRevert(KnowYourHacker.KnowYourHacker__TransferNotAllowed.selector);
        knowYourHacker.transferFrom(USER, makeAddr("SECOND_USER"), 1);
    }

    function test_MultipleMints() public {
        knowYourHacker.mint(USER, USER_NAME);
        vm.expectRevert(KnowYourHacker.KnowYourHacker__OnlyMintOnce.selector);
        knowYourHacker.mint(USER, USER_NAME);
    }

    function test_getTokenCount() public {
        knowYourHacker.mint(USER, USER_NAME);
        assertEq(knowYourHacker.getTokenCount(), 1);
        knowYourHacker.mint(makeAddr("SECOND_USER"), USER_NAME);
        assertEq(knowYourHacker.getTokenCount(), 2);
    }

    function test_getTokenURI() public {
        knowYourHacker.mint(USER, USER_NAME);
        assertEq(
            knowYourHacker.tokenURI(1),
            "data:application/json;base64,eyJuYW1lIjoiS25vd1lvdXJIYWNrZXIiLCAiZGVzY3JpcHRpb24iOiJLWUggU291bEJvdW5kIE5GVCIsICJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6ICJ1c2VyTmFtZSIsICJ2YWx1ZSI6ICJYWVoifV0sICJpbWFnZSI6ImlwZnM6Ly9iYWZ5YmVpZXFhM2xyZjN2aXVqNXJrdWhvaXkydml0cHo0eXhtbmRrNHY1MmtkaDRqcDU0NGN3NTV2YS9WZXJpZmljYXRpb25fQmFkZ2UucG5nIn0="
        );
    }
}
