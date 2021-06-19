// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IAlienOwnership is IERC721{
  event AlienMinted(
    address owner,
    uint alienId,
    uint mumId,
    uint dadId,
    uint genes
  );

  function createAlien(
    uint _genes,
    uint _mumId,
    uint _dadId,
    uint _generation,
    address _owner
    ) external returns (uint);

  function isAlienAlive(uint _nftId) external view returns (bool);

  function getAlien(uint _nftId) external view returns(
    uint _genes,
    uint _mumId,
    uint _dadId,
    uint _generation
  );

  function isApprovedOwner(address _owner, uint tokenId) external view returns (bool);

  function totalSupply() external view returns (uint);

  function transfer(address _from, address _to, uint _tokenId) external;

  /**
  * @dev Returns whether `spender` is allowed to manage `tokenId`.
  *
  * Requirements:
  *
  * - `tokenId` must exist.
  */
  function isApprovedOwner(address _owner, uint256 tokenId) public view returns (bool)
}
