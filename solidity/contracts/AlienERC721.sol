pragma solidity ^0.6.0;

import "./@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "./@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./@openzeppelin/contracts/presets/ERC721PresetMinterPauserAutoId.sol";
import "./@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "./@openzeppelin/contracts/token/ERC1155/ERC1155Holder.sol";
import "./@openzeppelin/contracts/utils/Counters.sol";
import "./@openzeppelin/contracts/access/Ownable.sol";
import "./@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IAlienToken.sol";
// SPDX-License-Identifier: MIT
//ERC721
contract AlienERC721 is
  Ownable,
  ERC721PresetMinterPauserAutoId,
  ERC1155Holder
{
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  IAlienToken public aln;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  Counters.Counter private _itemIds;

  bool public gameStopped = false;

  struct AlienObj {
    uint256 genes;
    uint32 mumId;
    uint32 dadId;
    uint16 generation;
  }

  // Mapping from token ID to NFT struct details
  mapping(uint256 => AlienObj) public alienDetails;
  // Alien Time properties
  mapping(uint256 => uint256) public timeUntilStarving;
  mapping(uint256 => uint256) public timeAlienBorn;

  constructor(address _AlienToken) public ERC721PresetMinterPauserAutoId(
    "AlienNFT",
     "ALNFT",
     "http:localhost/"
     ) {
    _setupRole(OPERATOR_ROLE, _msgSender());
    aln = IAlienToken(_AlienToken);
    // We are creating the first alien at index 0
    _createtAlien(0, 0, 0, uint16(-1), msg.sender);
  }

  event AlienMinted(
    address owner,
    uint256 alienId,
    uint32 mumId,
    uint32 dadId,
    uint256 genes
  );

  modifier notPaused() {
      require(!gameStopped, "Contract is paused");
      _;
  }

  modifier onlyOperator() {
      require(
          hasRole(OPERATOR_ROLE, _msgSender()),
          "Roles: caller does not have the OPERATOR role"
      );
      _;
  }

  modifier onlyMinter() {
      require(
          hasRole(MINTER_ROLE, _msgSender()),
          "Roles: caller does not have the MINTER role"
      );
      _;
  }

  function _createtAlien(
      uint256 _genes,
      uint32 _mumId,
      uint32 _dadId,
      uint16 _generation,
      address _owner
      ) internal returns (uint256) {

      alienDetails[_tokenIds.current()] = AlienObj(
        uint256(_genes),
        uint32(_mumId),
        uint32(_dadId),
        uint16(_generation)
      );
      mint(_owner);

      // It's probably never going to happen, 4 billion cats is A LOT, but
      // let's just be 100% sure we never let this happen.
      require(_tokenIds.current() == uint256(uint32(_tokenIds.current())));

      if(_owner != owner()){
          transferFrom(address(0), _owner, _tokenIds.current());
      }

      emit AlienMinted(_owner, _tokenIds.current(), _mumId, _dadId, _genes);
      return _tokenIds.current();
    }

  function mint(address player) public override onlyMinter{
    //pet minted has 7 days until it starves at first
    timeUntilStarving[_tokenIds.current()] = block.timestamp.add(7 days);
    timeAlienBorn[_tokenIds.current()] = block.timestamp;

    super._mint(player, _tokenIds.current());
    _tokenIds.increment();
  }

  // in case a bug happens or we upgrade to another smart contract
  function pauseGame(bool _pause) external onlyOperator {
      gameStopped = _pause;
  }

  // check that Alien didn't starve
  function isAlienAlive(uint256 _nftId) public view returns (bool) {
    uint256 _timeUntilStarving = timeUntilStarving[_nftId];
    if (_timeUntilStarving != 0 && _timeUntilStarving >= block.timestamp) {
      return true;
    }
  }

  function getAlien(uint256 _nftId) public view returns(
    uint256 _genes,
    uint256 _timeAlienBorn,
    uint256 _mumId,
    uint256 _dadId,
    uint256 _generation
    ){
      AlienObj storage alien = alienDetails[_nftId];

      require(timeAlienBorn[_tokenIds.current()] > 0, "the alien doesn't exist");

      _genes = uint256(alien.genes);
      _timeAlienBorn = uint256(timeAlienBorn[_tokenIds.current()]);
      _mumId = uint256(alien.mumId);
      _dadId = uint256(alien.dadId);
      _generation = uint256(alien.generation);
  }

  function createtAlien(
      uint256 _genes,
      uint32 _mumId,
      uint32 _dadId,
      uint16 _generation,
      address _owner
      ) external {
        _createtAlien(_genes, _mumId, _dadId, _generation, _owner);
  }
  function isApprovedOwner(address _owner, uint256 _nftId) public view returns (bool){
    return _isApprovedOrOwner(_owner, _nftId);
  }

}
