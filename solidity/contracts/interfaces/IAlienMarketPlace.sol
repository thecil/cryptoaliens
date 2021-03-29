pragma solidity ^0.6.0;

interface IAlienMarketPlace {
  event MarketTransaction(string TxType, address owner, uint256 tokenId);

  function totalOffers() external view returns(uint256);

  function getOffer(uint256 _tokenId)
      external
      view
      returns
  (
    address seller,
    uint256 price,
    uint256 index,
    uint256 tokenId,
    bool active
  );

  function setOffer(uint256 _price, uint256 _tokenId) external;

  function removeOffer(uint256 _tokenId) external;

  function buyAlien(uint256 _tokenId) external payable;
}