// contracts/AlienFactory.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/utils/Counters.sol";

contract AlienFactory is ERC721{
    address internal _minter;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    string public constant name = "AlienNFT";
    string public constant symbol = "ALNFT";

    constructor() public ERC721(name, symbol) {
      _minter = msg.sender;
    }

    event Birth(
        address owner,
        uint256 alienId,
        uint32 mumId,
        uint32 dadId,
        uint256 genes
        );

    struct Alien {
      uint256 genes;
      uint64 birthTime;
      uint32 mumId;
      uint32 dadId;
      uint16 generation;
    }

    Alien[] aliens;

    function _createtAlien(
        uint256 _genes,
        uint32 _mumId,
        uint32 _dadId,
        uint16 _generation,
        address _owner
        ) internal returns (uint256) {

        Alien memory _alien = Alien({
            genes: uint256(_genes),
            birthTime: uint64(now),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });
        aliens.push(_alien);

        uint256 alienId = mint(_owner);

        // It's probably never going to happen, 4 billion cats is A LOT, but
        // let's just be 100% sure we never let this happen.
        require(alienId == uint256(uint32(alienId)));

        if(_owner != _minter){
            transferFrom(address(0), _owner, alienId);
        }

        emit Birth(_owner, alienId, _mumId, _dadId, _genes);
        return alienId;
    }

    function mint(address to) private returns(uint256){
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
        return newTokenId;
    }

}
