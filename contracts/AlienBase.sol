// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title The base contract that contains the base logic, structs and data that are needed
 * @author Carlos Zambrano - thecil
 */
contract AlienBase is Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  struct AlienObj {
    // Unique genes of this alien
    uint genes;
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

  // @dev Double Mapping from address to alien ID, to Alien struct details
  mapping(uint => AlienObj) internal alienDetails;// [address] => (tokenId => Aliens)
  // @dev Mapping from address to alien IDs owned by the address 
  mapping(address => uint[]) internal aliensOwned;
  // @dev Mapping from alien id to number of children
  mapping(uint => uint[]) internal _alienToChildren;

  event AlienMinted(
    address owner,
    uint tokenId,
    uint mumId,
    uint dadId,
    uint genes
  );

  event AlienDestroyed(
    address owner,
    uint tokenId
  );

}
