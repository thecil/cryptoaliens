pragma solidity ^0.6.0;

// import "@openzeppelin/contracts/introspection/IERC165.sol";

interface IAlienERC721 {

  function createtAlien(
    uint256 _genes,
    uint32 _mumId,
    uint32 _dadId,
    uint16 _generation,
    address _owner
    ) external returns (uint256);

  function itemExists(uint256 itemId) external view returns (bool);
  function isAlienAlive(uint256 _nftId) external view returns (bool);

  function getItemInfo(uint256 _itemId)
    external
    view
    returns (
      string memory _name,
      uint256 _price,
      uint256 _points,
      uint256 _timeExtension
  );

  function getAlien(uint256 _nftId) external view returns(
    uint256 _genes,
    uint256 _timeAlienBorn,
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
