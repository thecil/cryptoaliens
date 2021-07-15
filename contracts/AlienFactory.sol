// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./AlienCore.sol";

import "hardhat/console.sol";

/**
 * @title The AlienFactory contract.
 * @author Carlos Zambrano - thecil
 * @dev This contract handles cloning aliens and createGen0
 * @dev This contract is split in the following way:
 *      - AlienCore: This provides the methods required for basic non-fungible token
 */
contract AlienFactory is AlienCore{
  using Counters for Counters.Counter;
  
  uint256 private constant CREATION_LIMIT_GEN0 = 10;
  Counters.Counter private gen0Counter;

  /**
   * @dev Returns a binary between 00000000-11111111
   */
  function _getRandom() internal view returns (uint8) {
      return uint8(block.timestamp % 255);
  }

  /**
   * @dev calculates the max of 2 numbers (generation from parents)
   */
  function maxGeneration(uint256 _gen1, uint256 _gen2) internal pure returns (uint256) {
      return _gen1 >= _gen2 ? _gen1 : _gen2;
  }

  /**
  * @dev mix a new dna based on 2 inputed dna (mum || dad)
  */
  function _mixDna(uint256 _dna1, uint256 _dna2) internal view returns(uint256){
  
    uint256[6] memory _geneArray;
    uint8 _random = _getRandom();
    uint8 index = 5;

    // Bitshift: move to next binary bit
    for (uint256 i = 1; i <= 16; i = i * 2) {
      // Then add 2 last digits from the dna to the new dna
      if (_random & i != 0) {
          _geneArray[index] = uint8(_dna1 % 100);
      } else {
          _geneArray[index] = uint8(_dna2 % 100);
      }
      _dna1 = _dna1 / 100;
      _dna2 = _dna2 / 100;
      index--;
    }

    // Add a random parameter in a random place
    uint8 _newDnaIndex = _random % 5;
    _geneArray[_newDnaIndex] = _random % 99;

    uint256 _newDna;
    // We reverse the DNa in the right order
    for (uint256 i = 0; i < 6; i = i + 1) {
      _newDna = _newDna + _geneArray[i];
      if (i != 5) {
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
  function cloneAlien(uint256 _dadId, uint256 _mumId) public whenNotPaused returns(uint256){
      require(isApprovedOwner(msg.sender, _dadId), "The user doesn't own the token _dadId");
      require(isApprovedOwner(msg.sender, _mumId), "The user doesn't own the token _mumId");
      require(_dadId != _mumId, "tokenId should be different");
    
      AlienObj storage _dad = _aliens[_dadId];    
      AlienObj storage _mum  = _aliens[_mumId];
      
      uint256 _newGenes = _mixDna(_dad.genes, _mum.genes);
      uint256 _newGeneration = maxGeneration(_dad.generation, _mum.generation);
      _newGeneration = _newGeneration + 1;
      uint256 _newAlien = createAlien(_newGenes, _mumId, _dadId, _newGeneration, msg.sender);
      return _newAlien;
  }


  function createAlienGen0(uint256 _genes) public onlyOwner whenNotPaused returns(uint256){
      require(gen0Counter.current() < CREATION_LIMIT_GEN0, "Maximum amount of aliens Gen 0 reached");
      gen0Counter.increment();
      uint256 _newAlien = createAlien(_genes, 0, 0, 0, msg.sender);
      //Gen0 have no owners they are own by the contract
      return _newAlien;
  }

}
