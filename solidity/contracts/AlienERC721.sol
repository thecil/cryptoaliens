pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


// SPDX-License-Identifier: MIT
//ERC721
contract AlienERC721 is
  Ownable,
  ERC721,
  ERC721Burnable,
  ERC1155Holder
{

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  struct AlienObj {
    uint256 genes;
    uint32 mumId;
    uint32 dadId;
    uint16 generation;
  }

  // Mapping from token ID to NFT struct details
  mapping(uint256 => AlienObj) public alienDetails;

  constructor() public ERC721(
    "AlienNFT",
     "ALNFT"
     ) {

  }

  event AlienMinted(
    address owner,
    uint256 alienId,
    uint256 mumId,
    uint256 dadId,
    uint256 genes
  );

  function _createAlien(
      uint256 _genes,
      uint256 _mumId,
      uint256 _dadId,
      uint256 _generation,
      address _owner
    ) private returns (uint256) {
      _tokenIds.increment();
      alienDetails[_tokenIds.current()] = AlienObj(
        uint256(_genes),
        uint32(_mumId),
        uint32(_dadId),
        uint16(_generation)
      );
      _mint(_owner, _tokenIds.current());

      // It's probably never going to happen, 4 billion cats is A LOT, but
      // let's just be 100% sure we never let this happen.
      require(_tokenIds.current() == uint256(uint32(_tokenIds.current())));



      emit AlienMinted(_owner, _tokenIds.current(), _mumId, _dadId, _genes);
      return _tokenIds.current();
    }


  function getAlien(uint256 _nftId) public view returns(
    uint256 _genes,
    uint32 _mumId,
    uint32 _dadId,
    uint16 _generation
    ){
      AlienObj memory alien = alienDetails[_nftId];

      _genes = uint256(alien.genes);
      _mumId = uint32(alien.mumId);
      _dadId = uint32(alien.dadId);
      _generation = uint16(alien.generation);
      return (_genes, _mumId, _dadId, _generation);
  }

  function createAlien(
      uint256 _genes,
      uint256 _mumId,
      uint256 _dadId,
      uint256 _generation,
      address _owner
    ) external returns(uint256){
        uint256 _newAlien = _createAlien(_genes, _mumId, _dadId, _generation, _owner);
        return _newAlien;
  }

  function isApprovedOwner(address _owner, uint256 _nftId) public view returns (bool){
    return _isApprovedOrOwner(_owner, _nftId);
  }

}
