pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IAlienERC721.sol";


// SPDX-License-Identifier: MIT
//ERC721
contract AlienERC721 is
  Ownable,
  ERC721Pausable,
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
  // mapping(uint256 => AlienObj) public alienDetails;
  // [address] => (tokenId => Aliens)
  mapping(address => mapping(uint256 => AlienObj)) public alienDetails;
  mapping(address => uint256[]) public userAliens;
  
  constructor() public ERC721(
    "AlienNFT",
     "ALNFT"
     ) {

  }

  event AlienMinted(
    address owner,
    uint256 tokenId,
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
      alienDetails[msg.sender][_tokenIds.current()] = AlienObj(
        uint256(_genes),
        uint32(_mumId),
        uint32(_dadId),
        uint16(_generation)
      );
      _mint(_owner, _tokenIds.current());

      // It's probably never going to happen, 4 billion cats is A LOT, but
      // let's just be 100% sure we never let this happen.
      require(_tokenIds.current() == uint256(uint32(_tokenIds.current())));

      userAliens[msg.sender].push(_tokenIds.current());
      emit AlienMinted(_owner, _tokenIds.current(), _mumId, _dadId, _genes);
      return _tokenIds.current();
    }


  function getAlien(uint256 _nftId) public view returns(
    uint256 _genes,
    uint32 _mumId,
    uint32 _dadId,
    uint16 _generation
    ){
      AlienObj memory alien = alienDetails[msg.sender][_nftId];

      _genes = uint256(alien.genes);
      _mumId = uint32(alien.mumId);
      _dadId = uint32(alien.dadId);
      _generation = uint16(alien.generation);
      return (_genes, _mumId, _dadId, _generation);
  }

  function getAllAliens(address _owner) public view returns(uint256 [] memory){
    return userAliens[_owner];
  }

  function createAlien(
      uint256 _genes,
      uint256 _mumId,
      uint256 _dadId,
      uint256 _generation,
      address _owner
    ) public returns(uint256){
        uint256 _newAlien = _createAlien(_genes, _mumId, _dadId, _generation, _owner);
        return _newAlien;
  }

  function isApprovedOwner(address _owner, uint256 _nftId) public view returns (bool){
    return _isApprovedOrOwner(_owner, _nftId);
  }
  // burnable
    /**
     * @dev Burns `tokenId`. See {ERC721-_burn}.
     *
     * Requirements:
     *
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burn(uint256 tokenId) public virtual {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
    }

}
