// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAlienERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AlienMarketPlace is Ownable{

  IAlienERC721 public aln721;
  using Counters for Counters.Counter;
  Counters.Counter private activeOffers;

  struct Offer {
      address payable seller;
      uint256 price;
      uint256 index;
      uint256 tokenId;
      bool active;
  }
  Offer[] offers;

  mapping (uint256 => Offer) tokenIdToOffer;

  event MarketTransaction(string TxType, address owner, uint256 tokenId);

  function totalOffers() public view returns(uint256) {
    return activeOffers.current();
  }

  function getOffer(uint256 _tokenId)
      public
      view
      returns
  (
    address seller,
    uint256 price,
    uint256 index,
    uint256 tokenId,
    bool active
  ) {
      Offer storage _offer = tokenIdToOffer[_tokenId];
      return (
          _offer.seller,
          _offer.price,
          _offer.index,
          _offer.tokenId,
          _offer.active
      );
  }

  /** @notice Creates a new offer for _tokenId for the price _price.
  * @param _price the ethereum price in wei
  * @param _tokenId the token ID to set offer for */
  function setOffer(uint256 _price, uint256 _tokenId)
    public
  {
    // only owner can create offer
    require(aln721.ownerOf(_tokenId) == msg.sender, "only owner can sell tokenId");
    //There can only be one active offer for a token at a time
    require(tokenIdToOffer[_tokenId].active == false, "offer already exists");
    //Marketplace contract (this) needs to be an approved operator when the offer is created
    require(aln721.isApprovedForAll(msg.sender, address(this)), "contract is not approved");
    //Offer price must be greater than 0
    require(_price > 0, "offer price must be greater than 0");

    Offer memory _offer = Offer({
        seller: msg.sender,
        price: _price,
        index: offers.length,
        tokenId: _tokenId,
        active: true
    });

    tokenIdToOffer[_tokenId] = _offer; //update mapping
    offers.push(_offer); //update array

    activeOffers.increment(); // adds 1 to the activeOffers tracker.

    emit MarketTransaction("Create offer", msg.sender, _tokenId);
  }

  /** @notice removes cat of tokenId from the Adopt Kitties marketplace
  * @param _tokenId the token ID for the cat we remove from marketplace */
  function removeOffer(uint256 _tokenId)
    public
  {
    Offer memory _offer = tokenIdToOffer[_tokenId];
    require(_offer.seller == msg.sender, "You should own the alien to be able to remove this offer");

    //change the offer active status from offers array with index tokenIdToOffer[_tokenId].index
    offers[_offer.index].active = false;
    //now delete it from the mapping
    delete tokenIdToOffer[_tokenId];

    // substract 1 to the activeOffers tracker.
    activeOffers.decrement();

    emit MarketTransaction("Remove offer", msg.sender, _tokenId);
  }

  function buyAlien(uint256 _tokenId)
    public
    payable
  {
    Offer memory _offer = tokenIdToOffer[_tokenId];
    require(msg.value == _offer.price, "The price amount must be the same as the price");
    //There must be an active _offer for _tokenId
    require(_offer.active == true, "no offer is active");

    delete tokenIdToOffer[_tokenId];
    offers[_offer.index].active = false;

    _offer.seller.transfer(_offer.price);
    aln721.transferFrom(_offer.seller, msg.sender, _tokenId);
    // substract 1 to the activeOffers tracker.
    activeOffers.decrement();

    emit MarketTransaction("Buy Alien", msg.sender, _tokenId);
  }


}
