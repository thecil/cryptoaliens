// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAlienERC721.sol";

import "hardhat/console.sol";

contract AlienFactory is Ownable{
  using Counters for Counters.Counter;

  uint private constant CREATION_LIMIT_GEN0 = 10;
  Counters.Counter private gen0Counter;

  address public IAlienNFT;
  IAlienERC721 public aln721;

  constructor(address _AlienERC721){
    /*
    console.log("AlienCore Constructor:");
    console.log("AlienERC721 contract address: '%s'", _AlienERC721);\
    */
    IAlienNFT = _AlienERC721;
    aln721 = IAlienERC721(IAlienNFT);
  }

  /**
   * @dev Returns a binary between 00000000-11111111
   */
  function _getRandom() internal view returns (uint8) {
      return uint8(block.timestamp % 255);
  }

  /**
   * @dev calculates the max of 2 numbers (generation from parents)
   */
  function maxGeneration(uint _gen1, uint _gen2) internal pure returns (uint) {
      return _gen1 >= _gen2 ? _gen1 : _gen2;
  }

  /**
  * @dev mix a new dna based on 2 inputed dna (mum || dad)
  */
  function _mixDna(uint _dna1, uint _dna2) internal view returns(uint){
    uint[8] memory _geneArray;
    uint8 _random = _getRandom();
    uint8 index = 7;

    // Bitshift: move to next binary bit
    for (uint i = 1; i <= 128; i = i * 2) {
      // Then add 2 last digits from the dna to the new dna
      if (_random & i != 0) {
          _geneArray[index] = uint8(_dna1 % 100);
      } else {
          _geneArray[index] = uint8(_dna2 % 100);
      }
      _dna1 = _dna1 / 100;
      _dna2 = _dna2 / 100;
      index = index - 1;
    }

    // Add a random parameter in a random place
    uint8 _newDnaIndex = _random % 7;
    _geneArray[_newDnaIndex] = _random % 99;

    uint _newDna;

    for (uint i = 0; i < 8; i = i + 1) {
      _newDna = _newDna + _geneArray[i];

      if (i != 7) {
        _newDna = _newDna * 100;
      }
    }

    return _newDna;
  }

  /**
  * @notice Clone a new alien based on a mom and dad
  * @param _dadId the id of the dad
  * @param _mumId the id of the mom
  */
  function cloneAlien(uint _dadId, uint _mumId) public returns(uint){
      require(aln721.isApprovedOwner(msg.sender, _dadId) == true, "The user doesn't own the token _dadId");
      require(aln721.isApprovedOwner(msg.sender, _mumId) == true, "The user doesn't own the token _mumId");
      require(_dadId != _mumId, "tokenId should be different");

      (uint Dadgenes,,,uint DadGeneration ) = aln721.getAlien(_dadId);
      (uint Mumgenes,,,uint MumGeneration ) = aln721.getAlien(_mumId);

      uint _newGenes = _mixDna(Dadgenes, Mumgenes);
      uint _newGeneration = maxGeneration(DadGeneration, MumGeneration);

      uint _newAlien = aln721.createAlien(_newGenes, _mumId, _dadId, _newGeneration, msg.sender);
      return _newAlien;
  }

  function createAlienGen0(uint _genes) public onlyOwner returns(uint){
      require(gen0Counter.current() < CREATION_LIMIT_GEN0, "Maximum amount of aliens Gen 0 reached");
      gen0Counter.increment();
      uint _newAlien = aln721.createAlien(_genes, 0, 0, 0, msg.sender);
      //Gen0 have no owners they are own by the contract
      return _newAlien;
  }

}
