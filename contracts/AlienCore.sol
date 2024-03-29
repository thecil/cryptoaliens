// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title The contract that handles ownership, 
 * Implementation of ERC721 Non-Fungible Token Standard, including
 * the Metadata , Enumerable extensions (and ERC165) compliant, 
 * @author Carlos Zambrano - thecil
 */
contract AlienCore is ERC721Enumerable, Ownable, Pausable{
    
    using SafeMath for uint256;
    // variables for alienToken, fee on each 
    IERC20 public alienToken;
    uint256 private _creationFee = 2; 
    
    

    struct AlienObj {
        // Unique genes of this alien
        uint256 genes;
        // The timestamp from the block when the alien was created
        uint64 birthTime;
        // References to parents, start 0 for gen0
        uint32 mumId;
        uint32 dadId;
        /* 
        Genereation of the Alien, start with gen0,
        each clone generation increase generation number
        */
        uint16 generation;
    }

    /**
    * @dev An array containing all aliens
    */
    AlienObj[] internal _aliens;

    constructor(address _alienToken, string memory _name, string memory _symbol) ERC721(_name, _symbol){
        alienToken = IERC20(_alienToken);
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function pauseContract() public onlyOwner whenNotPaused {
        _pause();
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function unpauseContract() public onlyOwner whenPaused {
        _unpause();
    }
    
    /**
     * @dev Assign ownership of a specific alien to an address.
     * @dev This poses no restriction on msg.sender
     * @param _from The address from who to transfer from, can be 0 for creation of a alien
     * @param _to The address to who to transfer to, cannot be 0 address
     * @param _tokenId The id of the transfering alien,
     */
    function transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) public whenNotPaused{
        require(_to != address(0), "transfer to the zero address");
        require(_to != address(this), "Can't transfer to");

        safeTransferFrom(_from, _to, _tokenId);       
    }

    /**
     * @dev Logic for creation of a alien, via gen0 creation or cloning
     * @param _genes The generic code, must me computed by the caller
     * @param _mumId The mother of the alien (0 for gen0)
     * @param _dadId The dad of the alien (0 for gen0)
     * @param _generation The generation number of this alien, must be computed by caller
     * @param _owner The initial owner, must me non-zero
     * @return The id of the created alien
    */
    function _createAlien(
      uint256 _genes,
      uint256 _mumId,
      uint256 _dadId,
      uint256 _generation,
      address _owner
    ) internal whenNotPaused returns (uint256) {

        AlienObj memory _alien = AlienObj({
            genes: _genes,
            birthTime: uint64(block.timestamp),
            mumId: uint32(_mumId),
            dadId: uint32(_dadId),
            generation: uint16(_generation)
        });

        _aliens.push(_alien);

        uint256 _newAlienId = _aliens.length.sub(1);

        _safeMint(_owner, _newAlienId);

        emit AlienMinted(_owner, _newAlienId, _mumId, _dadId, _genes);
        return _newAlienId;
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
    * emits Event {AlienDestroyed}
    */
    function burn(uint256 tokenId) public virtual whenNotPaused{
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);
        delete _aliens[tokenId];
        emit AlienDestroyed(msg.sender, tokenId);
    }

    /**
    * @dev Returns an alien object based on its ID.
    *
    * Requirements:
    *
    * - The ID must be lower than totalSupply.
    */
    function getAlien(uint256 tokenId) public view returns(
        uint256 _genes,
        uint64 _birthTime,
        uint32 _mumId,
        uint32 _dadId,
        uint16 _generation
        ){
        require(tokenId <= totalSupply(), "Id outside of totalSupply");
        AlienObj memory alien = _aliens[tokenId];

        _genes = uint256(alien.genes);
        _birthTime = uint64(alien.birthTime);
        _mumId = uint32(alien.mumId);
        _dadId = uint32(alien.dadId);
        _generation = uint16(alien.generation);

        return (_genes, _birthTime, _mumId, _dadId, _generation);
    }

    /**
    * @dev Returns an array of IDs owned by the address.
    * Requirements:
    *
    * - The ID must be lower than totalSupply.
    */
    function getAllAliens(address _owner) public view returns(uint256 [] memory){
        require(_owner != address(0), "Token query for the zero address");

        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        }

        uint256[] memory result = new uint256[](tokenCount);

        uint256 alienId;
        for (alienId = 0; alienId < tokenCount; alienId++) {
                result[alienId] = tokenOfOwnerByIndex(_owner, alienId);
        }

        return result;
    }

    /**
    * @dev public function to createAliens see: {_createAlien}
    * @param _genes The generic code, must me computed by the caller
    * @param _mumId The mother of the alien (0 for gen0)
    * @param _dadId The dad of the alien (0 for gen0)
    * @param _generation The generation number of this alien, must be computed by caller
    * @param _owner The initial owner, must me non-zero
    * Requirements:
    * - msg.sender will pay the creation Fee for creation
    */
    function createAlien(
      uint256 _genes,
      uint256 _mumId,
      uint256 _dadId,
      uint256 _generation,
      address _owner
    ) public returns(uint256){
        require(alienToken.balanceOf(_owner) >= _creationFee, "not enough balance for creation fee");
        uint256 _oldBalanceOf = alienToken.balanceOf(address(this));
        // sent creation Fee to contract
        alienToken.transferFrom(msg.sender, address(this), _creationFee);
        // validate that contract receive the fees
        assert(alienToken.balanceOf(address(this)) == _oldBalanceOf + _creationFee);
        uint256 _newAlien = _createAlien(_genes, _mumId, _dadId, _generation, _owner);
        return _newAlien;
    }

    event AlienMinted(
        address owner,
        uint256 tokenId,
        uint256 mumId,
        uint256 dadId,
        uint256 genes
    );

    event AlienDestroyed(
        address owner,
        uint256 tokenId
    );
}
