// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AlienNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public constant _name = "AlienNFT";
    string public constant _symbol = "ALNFT";

    struct Alien {
      uint256 genes;
      uint64 birthTime;
      uint32 mumId;
      uint32 dadId;
      uint16 generation;
    }

    Alien[] aliens;

    mapping (uint256=>address) public alienIndexToOwner;
    mapping (address=>uint256) ownershipTokenCount;



    constructor() public ERC721(_name, _symbol) {}

    function awardItem(address player, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(player, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
