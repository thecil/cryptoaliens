// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IAlienCore is IERC721{
  event AlienMinted(
    address owner,
    uint256 alienId,
    uint256 mumId,
    uint256 dadId,
    uint256 genes
  );

  /**
  * @notice Count aliens tracked by this contract
  * @return A count of valid aliens tracked by this contract with Counters
  */
  function totalSupply() external view returns (uint256);

  /**
  * @dev Assign ownership of a specific Kitty to an address.
  * @dev This poses no restriction on msg.sender
  * @param _from The address from who to transfer from, can be 0 for creation of a kitty
  * @param _to The address to who to transfer to, cannot be 0 address
  * @param _tokenId The id of the transfering alien,
  */
  function transfer(address _from, address _to, uint256 _tokenId) external;

  /**
  * @dev Returns whether `spender` is allowed to manage `tokenId`.
  *
  * Requirements:
  *
  * - `tokenId` must exist.
  */
  function isApprovedOwner(address _owner, uint256 tokenId) external view returns (bool);

  /**
  * @dev Burns `tokenId`. See {ERC721-_burn}.
  *
  * Requirements:
  *
  * - The caller must own `tokenId` or be an approved operator.
  * Event {AlienDestroyed}
  */
  function burn(uint256 tokenId) external;

  /**
  * @dev Returns an alien object based on its ID.
  *
  * Requirements:
  *
  * - The ID must be lower than totalSupply.
  */
  function getAlien(uint256 tokenId) external view returns(uint256 _genes, uint64 _birthTime, uint32 _mumId, uint32 _dadId, uint16 _generation);

  /**
  * @dev Returns an array of IDs owned by the address.
  * Requirements:
  *
  * - The ID must be lower than totalSupply.
  */
  function getAllAliens(address _owner) external view returns(uint256 [] memory);

  // public function to createAliens see: {_createAlien}
  function createAlien(
    uint256 _genes,
    uint256 _mumId,
    uint256 _dadId,
    uint256 _generation,
    address _owner
  ) external returns(uint256);

}
