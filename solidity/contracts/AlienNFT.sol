// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";
import "./@openzeppelin/contracts/utils/Counters.sol";

contract AlienNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 private gen0Counter;
    uint256 private constant CREATION_LIMIT_GEN0 = 10;
    string public constant _name = "AlienNFT";
    string public constant _symbol = "ALNFT";

    event Birth(
        address owner,
        uint256 alienId,
        uint32 mumId,
        uint32 dadId,
        uint16 genes
        );

    struct Alien {
      uint256 genes;
      uint64 birthTime;
      uint32 mumId;
      uint32 dadId;
      uint16 generation;
    }

    Alien[] aliens;
    constructor() public ERC721(_name, _symbol) {

    }

    function deployAliens() public onlyOwner {
      createAlienGen0(100);
      createAlienGen0(101);
    }

    function createAlienGen0(uint256 _genes) internal onlyOwner returns(uint256){
        require(gen0Counter < CREATION_LIMIT_GEN0, "Maximum amount of aliens Gen 0 reached");
        gen0Counter++;

        //Gen0 have no owners they are own by the contract
        return _createtAlien(_genes, 0, 0, 0, msg.sender);
    }

    function _createtAlien(
        uint256 _genes,
        uint32 _mumId,
        uint32 _dadId,
        uint16 _generation,
        address _owner
        ) private onlyOwner returns (uint256) {

        Alien memory _alien = Alien({
            genes: uint256(_genes),
            birthTime: uint64(now),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });
        aliens.push(_alien);

        uint256 alienId = mint(_owner);
        if(_owner != owner()){
            transferFrom(address(0), _owner, alienId);
        }

        emit Birth(_owner, alienId, _mumId, _dadId, _generation);
    }

    function getAlien(uint256 index) external view returns(
      address owner,
      uint256 genes,
      uint256 birthTime,
      uint256 mumId,
      uint256 dadId,
      uint256 generation
      ){
        Alien storage alien = aliens[index];

        owner = ownerOf((index+1));
        genes = uint256(alien.genes);
        birthTime = uint256(alien.birthTime);
        mumId = uint256(alien.mumId);
        dadId = uint256(alien.dadId);
        generation = uint256(alien.generation);
    }

    function mint(address to) private onlyOwner returns(uint256){
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
        return newTokenId;
    }

}
