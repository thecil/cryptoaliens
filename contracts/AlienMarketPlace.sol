// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IAlienCore.sol";

import "hardhat/console.sol";

/**
 * @title The MarketPlace contract.
 * @author Carlos Zambrano - thecil
 * @dev It takes ownership of the alien for the duration that it is on the marketplace
 */
contract AlienMarketPlace is Ownable{

  IAlienCore public IAlienNft;
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
  Offer[] private _offers;

  event MarketTransaction(string TxType, address owner, uint tokenId);
  mapping(uint256 => Offer) private _tokenIdToOffer;

  /**
   * @notice Get the details about a offer for _tokenId. Throws an error if there is no active offer for _tokenId.
   * @param _tokenId the id of the token to get the offer from
   * return the offer
   */
  function getOffer(uint _tokenId) public view returns(
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

  /*
  * Get all aliens that are on sale
  * return all tokenId's that are currently for sale. 
  * Returns an empty arror if none exist
  */
  function getAllTokenOnSale() external view returns (Offer[] memory)
  {
      return _offers;
  }

  /** @notice Creates a new offer for _tokenId for the price _price.
  * @param _price the ethereum price in wei
  * @param _tokenId the token ID to set offer for */
  function setOffer(uint _price, uint _tokenId) public{

    // only alien owner can create offer
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
        index: _offers.length,
        tokenId: _tokenId,
        active: true
    });

    _tokenIdToOffer[_tokenId] = _offer; //update mapping
    _offers.push(_offer); //update array

    emit MarketTransaction("Create offer", msg.sender, _tokenId);
  }

  /** @notice removes alien of tokenId from the marketplace
  * @param _tokenId the token ID for the alien we remove from marketplace 
  */
  function _removeOffer(uint _tokenId) private {
    // Remove from array: move the last token to the current token position
    uint256 lastTokenIndex = _offers.length;
    uint256 tokenIndex = _tokenIdToOffer[_tokenId].index;
    Offer memory lastTokenId = _offers[lastTokenIndex];

    _offers[tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
    _tokenIdToOffer[lastTokenId.index].index = tokenIndex; // Update the moved token's index

    // This also deletes the contents at the last position of the array
    _offers.pop();
    _tokenIdToOffer[_tokenId].index = 0;
        
    // Remove from mapping
    delete _tokenIdToOffer[_tokenId];
  }

  /**
  * @notice Removes an existing offer.
  * @dev see _removeOffer
  */
  function removeOffer(uint256 _tokenId) external {
    Offer memory offer = _tokenIdToOffer[_tokenId];
    require(offer.seller == msg.sender, "Not the owner");

    _removeOffer(_tokenId);

    emit MarketTransaction("Remove offer", msg.sender, _tokenId);
  }

  function buyAlien(uint _tokenId) public payable{
    console.log("buyAlien started");
    Offer memory _offer = _tokenIdToOffer[_tokenId];
    console.log("buyAlien:: _offer[%s].tokenId", _offer.tokenId);
    console.log("buyAlien:: _offer[%s].index", _offer.index);
    console.log("buyAlien:: _offer[%s].active", _offer.active);
    require(msg.value == _offer.price, "The price amount must be the same as the price");
    
    _removeOffer(_tokenId);

    console.log("buyAlien:: _offer.index[%s], _offer[%s].active",_offer.index, _offers[_tokenId].active);
    _offer.seller.transfer(_offer.price);
    IAlienNft.transferFrom(_offer.seller, msg.sender, _offer.tokenId);

    emit MarketTransaction("Buy Alien", msg.sender, _tokenId);
  }


}
