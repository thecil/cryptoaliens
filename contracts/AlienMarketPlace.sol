// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAlienCore.sol";
import "./interfaces/IAlienMarketPlace.sol";

import "hardhat/console.sol";

/**
 * @title The MarketPlace contract.
 * @author Carlos Zambrano - thecil
 * @dev It takes ownership of the alien for the duration that it is on the marketplace
 */
contract AlienMarketPlace is Ownable, IAlienMarketPlace{
  
  IAlienCore public IAlienNft;
  using Counters for Counters.Counter;
  Counters.Counter private activeOffers;
  address public IAlienNFT;

  constructor(address _AlienERC721) {
    IAlienNFT = _AlienERC721;
    IAlienNft = IAlienCore(IAlienNFT);
  }

  struct Offer {
      address payable seller;
      uint price;
      uint index;
      uint tokenId;
      bool active;
  }
  Offer[] offers;

  mapping (uint => Offer) private _tokenIdToOffer;

  event MarketTransaction(string TxType, address owner, uint tokenId);

  /**
   * return the total amount of offers
   */ 
  function totalOffers() public view override returns(uint) {
    return offers.length;
  }

  /**
   * @notice Get the details about a offer for _tokenId. Throws an error if there is no active offer for _tokenId.
   * @param _tokenId the id of the token to get the offer from
   * return the offer
   */
  function getOffer(uint _tokenId) public view override returns(
    address seller,
    uint price,
    uint index,
    uint tokenId,
    bool active
  ) {
      Offer storage _offer = _tokenIdToOffer[_tokenId];
      return (
          _offer.seller,
          _offer.price,
          _offer.index,
          _offer.tokenId,
          _offer.active
      );
  }

  function getAllTokenOnSale() public view override returns(uint256[] memory){
    if (totalOffers() == 0) {
        return new uint256[](0);
    } else {
  
      uint256[] memory resultOfToken = new uint256[](totalOffers());
      uint256 offerId;
  
      for (offerId = 0; offerId < totalOffers(); offerId++) {
        /*
          console.log("iterator[%s], offerId[%s].tokenId", offerId, offers[offerId].tokenId);
          console.log("iterator[%s], offerId[%s].index",offerId, offers[offerId].index);
          console.log("iterator[%s], offerId[%s].active",offerId, offers[offerId].active);
        */
        if(offers[offerId].price != 0){
          resultOfToken[offerId] = offers[offerId].tokenId;
          // console.log("IF iterator[%s], resultOfToken[%s]",offerId, resultOfToken[offerId]);
        }
      }
      // console.log("resultOfToken[%s].length", resultOfToken.length);
      return resultOfToken;
    }
  }

  /** @notice Creates a new offer for _tokenId for the price _price.
  * @param _price the ethereum price in wei
  * @param _tokenId the token ID to set offer for */
  function setOffer(uint _price, uint _tokenId)
    public
    override
  {
    // only owner can create offer
    require(IAlienNft.ownerOf(_tokenId) == msg.sender, "only owner can sell tokenId");
    //There can only be one active offer for a token at a time
    require(_tokenIdToOffer[_tokenId].active == false, "offer already exists");
    //Marketplace contract (this) needs to be an approved operator when the offer is created
    require(IAlienNft.isApprovedForAll(msg.sender, address(this)), "contract is not approved");
    //Offer price must be greater than 0
    require(_price > 0, "offer price must be greater than 0");

    Offer memory _offer = Offer({
        seller: payable(msg.sender),
        price: _price,
        index: offers.length,
        tokenId: _tokenId,
        active: true
    });

    _tokenIdToOffer[_tokenId] = _offer; //update mapping
    offers.push(_offer); //update array

    activeOffers.increment(); // adds 1 to the activeOffers tracker.

    emit MarketTransaction("Create offer", msg.sender, _tokenId);
  }

  /** @notice removes cat of tokenId from the Adopt Kitties marketplace
  * @param _tokenId the token ID for the cat we remove from marketplace */
  function removeOffer(uint _tokenId)
    public
    override
  {
    Offer memory _offer = _tokenIdToOffer[_tokenId];
    require(_offer.seller == msg.sender, "You should own the alien to be able to remove this offer");

    //change the offer active status from offers array with index _tokenIdToOffer[_tokenId].index
    offers[_offer.index].active = false;
    //now delete it from the mapping
    delete _tokenIdToOffer[_tokenId];

    // substract 1 to the activeOffers tracker.
    activeOffers.decrement();

    emit MarketTransaction("Remove offer", msg.sender, _tokenId);
  }

  function buyAlien(uint _tokenId)
    public
    payable
    override
  {
    Offer memory _offer = _tokenIdToOffer[_tokenId];
    /*
    console.log("buyAlien:: _offer[%s].tokenId", _offer.tokenId);
    console.log("buyAlien:: _offer[%s].index", _offer.index);
    console.log("buyAlien:: _offer[%s].active", _offer.active);
    */
    require(msg.value == _offer.price, "The price amount must be the same as the price");
    //There must be an active _offer for _tokenId
    require(_offer.active == true, "no offer is active");

    delete _tokenIdToOffer[_tokenId];
    offers[_offer.index].active = false;
    _offer.seller.transfer(_offer.price);
    IAlienNft.transferFrom(_offer.seller, msg.sender, _offer.tokenId);
    // substract 1 to the activeOffers tracker.
    activeOffers.decrement();

    emit MarketTransaction("Buy Alien", msg.sender, _tokenId);
  }


}
