// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./@openzeppelin/contracts/access/Ownable.sol";
import "./AlienMarketPlace.sol";

contract AlienCore is Ownable, AlienMarketPlace{

  uint256 private constant CREATION_LIMIT_GEN0 = 10;
  // Counts the number of cats the contract owner has created.
  uint256 private gen0Counter;

  constructor(address _AlienERC721) public {
    aln721 = IAlienERC721(_AlienERC721);
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

  function getGenesKid(uint256 _dadId, uint256 _mumId) private view returns (uint256){
    ( uint256 Dadgenes,,,,) = aln721.getAlien(_dadId);

    ( uint256 Mumgenes,,,,) = aln721.getAlien(_mumId);

    uint256 geneKid;
    uint256 [8] memory geneArray;
    uint256 index = 7;
    uint8 random = uint8(now % 255);
    uint256 i = 0;

    for(i = 1; i <= 128; i=i*2){

        /* We are */
        if(random & i != 0){
            geneArray[index] = uint8(Mumgenes % 100);
        } else {
            geneArray[index] = uint8(Dadgenes % 100);
        }
        Mumgenes /= 100;
        Dadgenes /= 100;
      index -= 1;
    }

    /* Add a random parameter in a random place */
    uint8 newGeneIndex =  random % 7;
    geneArray[newGeneIndex] = random % 99;

    /* We reverse the DNa in the right order */
    for (i = 0 ; i < 8; i++ ){
      geneKid += geneArray[i];
      if(i != 7){
          geneKid *= 100;
      }
    }
    return geneKid;
  }

  function getGenerationKid(uint256 _dadId, uint256 _mumId) private view returns (uint256){
    ( ,,,,uint256 DadGeneration ) = aln721.getAlien(_dadId);

    (,,,,uint256 MumGeneration ) = aln721.getAlien(_mumId);
    uint256 _kidGen = 0;
    if (DadGeneration < MumGeneration){
      _kidGen = MumGeneration + 1;
      _kidGen /= 2;
    } else if (DadGeneration > MumGeneration){
      _kidGen = DadGeneration + 1;
      _kidGen /= 2;
    } else{
      _kidGen = MumGeneration + 1;
    }
    return _kidGen;
  }

  function cloneAlien(uint256 _dadId, uint256 _mumId) public {
      require(aln721.isApprovedOwner(msg.sender, _dadId), "The user doesn't own the token");
      require(aln721.isApprovedOwner(msg.sender, _mumId), "The user doesn't own the token");

      uint256 geneKid = getGenesKid(_dadId, _mumId);
      uint256 kidGen = getGenerationKid(_dadId, _mumId);

      aln721.createtAlien(geneKid, uint32(_mumId), uint32(_dadId), uint16(kidGen), msg.sender);
  }

  function createAlienGen0(uint256 genes) public onlyOwner returns(uint256){
      require(gen0Counter < CREATION_LIMIT_GEN0, "Maximum amount of aliens Gen 0 reached");
      gen0Counter++;

      //Gen0 have no owners they are own by the contract
      return aln721.createtAlien(genes, 0, 0, 0, msg.sender);
  }

}
