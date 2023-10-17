// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract KnowYourHacker is ERC721, Ownable {
    error KnowYourHacker__TransferNotAllowed();
    error KnowYourHacker__OnlyOwnerCanBurn();
    error KnowYourHacker__OnlyMintOnce();

    uint256 private _nextTokenId;
    mapping(address owner => uint256 tokenId) private _ownerToTokenId;
    mapping(uint256 tokenId => string tokenURI) private _tokenIdToURI;
    string private constant IMAGEURI =
        "ipfs://bafybeieqa3lrf3viuj5rkuhoiy2vitpz4yxmndk4v52kdh4jp544cw55va/Verification_Badge.png";

    constructor() ERC721("KnowYourHacker", "KYH") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    function mint(address to, string memory userName) public onlyOwner {
        if (balanceOf(to) > 0) {
            revert KnowYourHacker__OnlyMintOnce();
        }
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _ownerToTokenId[to] = tokenId;
        _tokenIdToURI[tokenId] = _createTokenURI(userName);
    }

    function burn() external {
        uint256 tokenId = _ownerToTokenId[msg.sender];
        // only burn for existing tokenId
        if (tokenId != 0) {
            _burn(tokenId);
        }
        delete _ownerToTokenId[msg.sender];
        delete _tokenIdToURI[tokenId];
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        if (_ownerOf(tokenId) != address(0) && to != address(0)) {
            revert KnowYourHacker__TransferNotAllowed();
        }
        return super._update(to, tokenId, auth);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function _createTokenURI(string memory userName) internal view returns (string memory) {
        return string(
            abi.encodePacked(
                _baseURI(),
                Base64.encode(
                    abi.encodePacked(
                        '{"name":"',
                        name(),
                        '", "description":"KYH SoulBound NFT", ',
                        '"attributes": [{"trait_type": "userName", "value": "',
                        userName,
                        '"}], "image":"',
                        IMAGEURI,
                        '"}'
                    )
                )
            )
        );
    }

    function getTokenCount() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenIdToURI[tokenId];
    }
}
