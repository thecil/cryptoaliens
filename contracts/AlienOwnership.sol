// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./AlienBase.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/**
 * @title The contract that handles ownership, 
 * Implementation of ERC721 Non-Fungible Token Standard, including
 * the Metadata , Enumerable extensions (and ERC165) compliant, 
 * @author Carlos Zambrano - thecil
 */
contract AlienOwnership is AlienBase, ERC721{
    string public constant name = "CryptoAliens";
    string public constant symbol = "ALIEN";

    constructor() ERC721(name, symbol){

    }

    /**
     * @notice Count aliens tracked by this contract
     * @dev [ERC721Enumerable]
     * @return A count of valid kitties tracked by this contract, where each one of
     *  them has an assigned and queryable owner not equal to the zero address
     */
    function totalSupply() public view returns(uint){
        return _tokenIds.current();
    }

    /**
     * @dev Assign ownership of a specific Kitty to an address.
     * @dev This poses no restriction on msg.sender
     * @param _from The address from who to transfer from, can be 0 for creation of a kitty
     * @param _to The address to who to transfer to, cannot be 0 address
     * @param _tokenId The id of the transfering alien,
     */
    function transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        require(_to != address(0), "transfer to the zero address");
        require(_to != address(this), "Can't transfer to");
        uint[] memory _aliensOwnedFrom = aliensOwned[_from];
        // search _tokenId index in mapping Array _from
        uint _indexToRemove;
        for(uint i = 0; i < _aliensOwnedFrom.length; i++){
            if(_aliensOwnedFrom[i] == _tokenId) return(_indexToRemove = i);
        }
        // Move the last element into the place to delete
        _aliensOwnedFrom[_indexToRemove] = _aliensOwnedFrom[_aliensOwnedFrom.length - 1];
        // Remove the last element
        _aliensOwnedFrom.pop();
        // set the new mapping array _from
        aliensOwned[_from] = _aliensOwnedFrom;
        // add alien to mapping array _to
        aliensOwned[_to].push(_tokenId);

        safeTransferFrom(_from, _to, _tokenId);
    }

    /**
    * @dev Returns whether `spender` is allowed to manage `tokenId`.
    *
    * Requirements:
    *
    * - `tokenId` must exist.
    */
    function isApprovedOwner(address _owner, uint256 tokenId) public view returns (bool){
        return _isApprovedOrOwner(_owner, tokenId);
    }

    /**
    * @dev Burns `tokenId`. See {ERC721-_burn}.
    *
    * Requirements:
    *
    * - The caller must own `tokenId` or be an approved operator.
    * @emits Event {AlienDestroyed}
    */
    function burn(uint256 tokenId) public virtual {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
        _tokenIds.decrement();
        emit AlienDestroyed(msg.sender, tokenId)
    }

    /**
    * @dev Returns an alien object based on its ID.
    *
    * Requirements:
    *
    * - The ID must be lower than totalSupply.
    */
    function getAlien(uint tokenId) public view returns(
        uint _genes,
        uint64 _birthTime,
        uint32 _mumId,
        uint32 _dadId,
        uint16 _generation
        ){
        require(tokenId < tokenIds.current(), "Id outside of totalSupply");
        AlienObj memory alien = alienDetails[tokenId];

        _genes = uint(alien.genes);
        _birthTime = uint64(alien.birthTime);
        _mumId = uint32(alien.mumId);
        _dadId = uint32(alien.dadId);
        _generation = uint16(alien.generation);

        return (_genes, _birthTime, _mumId, _dadId, _generation);
    }

    /**
    * @dev Returns an array of IDs owned by the address.
    * @param address requested
    * Requirements:
    *
    * - The ID must be lower than totalSupply.
    */
    function getUserAliens(address _request) public view returns(uint memory []){
        require(_to != address(0), "no zero address allowed");
        return (aliensOwned[_request]);
    }

    /**
     * @dev Logic for creation of a alien, via gen0 creation or cloning
     * @param _genes The generic code, must me computed by the caller
     * @param _mumId The mother of the alien (0 for gen0)
     * @param _dadId The dad of the alien (0 for gen0)
     * @param _generation The generation number of this cat, must be computed by caller
     * @param _owner The initial owner, must me non-zero
     * @return The id of the created alien
    */
    function _createAlien(
      uint _genes,
      uint _mumId,
      uint _dadId,
      uint _generation,
      address _owner
    ) internal returns (uint) {
      _tokenIds.increment();

      alienDetails[_tokenIds.current()] = AlienObj(
        uint(_genes),
        uint64(block.timestamp),
        uint32(_mumId),
        uint32(_dadId),
        uint16(_generation)
      );
      _safeMint(_owner, _tokenIds.current());

      aliensOwned[msg.sender].push(_tokenIds.current());

      emit AlienMinted(_owner, _tokenIds.current(), _mumId, _dadId, _genes);
      return _tokenIds.current();
    }

    // public function to createAliens
    function createAlien(
      uint _genes,
      uint _mumId,
      uint _dadId,
      uint _generation,
      address _owner
    ) public returns(uint){
        uint _newAlien = _createAlien(_genes, _mumId, _dadId, _generation, _owner);
        return _newAlien;
    }

}