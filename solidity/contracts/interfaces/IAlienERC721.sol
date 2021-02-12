pragma solidity ^0.6.0;

// import "@openzeppelin/contracts/introspection/IERC165.sol";

interface IAlienERC721 {

  function createAlien(
    uint256 _genes,
    uint256 _mumId,
    uint256 _dadId,
    uint256 _generation,
    address _owner
    ) external returns (uint256);

  function isAlienAlive(uint256 _nftId) external view returns (bool);

  function getAlien(uint256 _nftId) external view returns(
    uint256 _genes,
    uint256 _mumId,
    uint256 _dadId,
    uint256 _generation
  );

  function isApprovedOwner(address _owner, uint256 _nftId) external view returns (bool);
  //IERC721
  function balanceOf(address owner) external view returns (uint256 balance);

  function ownerOf(uint256 tokenId) external view returns (address owner);

  function transferFrom(address from, address to, uint256 tokenId) external;

  function approve(address to, uint256 tokenId) external;

  function getApproved(uint256 tokenId) external view returns (address operator);
}
