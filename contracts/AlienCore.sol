// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAlienERC721.sol";

import "hardhat/console.sol";

contract AlienCore is Ownable{

  uint256 private constant CREATION_LIMIT_GEN0 = 10;
  // Counts the number of cats the contract owner has created.
  uint256 private gen0Counter;
  address public IAlienNFT;
  IAlienERC721 public aln721;

  constructor(address _AlienERC721) public {
    console.log("AlienCore Constructor:");
    console.log("AlienERC721 contract address: '%s'", _AlienERC721);
    IAlienNFT = _AlienERC721;
    aln721 = IAlienERC721(IAlienNFT);
  }
/*
*       we get a
*
*       Basic binary operation
*
*       >>> '{0:08b}'.format(255 & 1)
*       '00000001'
*       >>> '{0:08b}'.format(255 & 2)
*       '00000010'
*       >>> '{0:08b}'.format(255 & 4)
*       '00000100'
*       >>> '{0:08b}'.format(255 & 8)
*       '00001000'
*       >>> '{0:08b}'.format(255 & 16)
*       '00010000'
*       >>> '{0:08b}'.format(255 & 32)
*       '00100000'
*       >>> '{0:08b}'.format(255 & 64)
*       '01000000'
*       >>> '{0:08b}'.format(255 & 128)
*       '10000000'
*
*       So we use a mask on our random number to check if we will use the mumID or the dadId
*
*       For example 205 is 11001101 in binary So
*       mum - mum - dad -dad -mum - mum - dad - mum
*
*/
function getGenesKid(uint256 _Dadgenes, uint256 _Mumgenes) internal view returns (uint256){
    uint256 _geneKid;
    uint256 [8] memory geneArray;
    uint256 index = 7;
    uint8 random = uint8(block.timestamp % 255);
    uint256 i = 0;

    for(i = 1; i <= 128; i=i*2){
        /* We are */
        if(random & i != 0){
            geneArray[index] = uint8(_Mumgenes % 100);
        } else {
            geneArray[index] = uint8(_Dadgenes % 100);
        }
        _Mumgenes /= 100;
        _Dadgenes /= 100;
      index -= 1;
    }

    /* Add a random parameter in a random place */
    uint8 newGeneIndex =  random % 7;
    geneArray[newGeneIndex] = random % 99;

    /* We reverse the DNa in the right order */
    for (i = 0 ; i < 8; i++ ){
      _geneKid += geneArray[i];
      if(i != 7){
          _geneKid *= 100;
      }
    }
    return _geneKid;
  }

  function getGenerationKid(uint256 _DadGeneration, uint256 _MumGeneration) internal pure returns (uint256){
    uint256 _kidGen = 0;
    if (_DadGeneration < _MumGeneration){
      _kidGen = _MumGeneration + 1;
      _kidGen /= 2;
    } else if (_DadGeneration > _MumGeneration){
      _kidGen = _DadGeneration + 1;
      _kidGen /= 2;
    } else{
      _kidGen = _MumGeneration + 1;
    }
    return _kidGen;
  }

  function cloneAlien(uint256 _dadId, uint256 _mumId) public returns(uint256){
      require(aln721.isApprovedOwner(msg.sender, _dadId) == true, "The user doesn't own the token _dadId");
      require(aln721.isApprovedOwner(msg.sender, _mumId) == true, "The user doesn't own the token _mumId");
      require( _dadId != _mumId, "tokenId should be different");

      (uint256 Dadgenes,,,uint256 DadGeneration ) = aln721.getAlien(_dadId);
      (uint256 Mumgenes,,,uint256 MumGeneration ) = aln721.getAlien(_mumId);

      uint256 _geneKid = getGenesKid(Dadgenes, Mumgenes);
      uint256 _kidGen = getGenerationKid(DadGeneration, MumGeneration);

      uint256 _newAlien = aln721.createAlien(_geneKid, _mumId, _dadId, _kidGen, msg.sender);
      return _newAlien;
  }

  function createAlienGen0(uint256 genes) public onlyOwner returns(uint256){
      require(gen0Counter < CREATION_LIMIT_GEN0, "Maximum amount of aliens Gen 0 reached");
      gen0Counter++;
      uint256 _newAlien = aln721.createAlien(genes, 0, 0, 0, msg.sender);
      //Gen0 have no owners they are own by the contract
      return _newAlien;
  }

}
