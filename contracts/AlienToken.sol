// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract AlienToken is ERC20, Ownable{
    // to manage claiming, only 1 time a msg.sender can claim tokens
    mapping(address => bool) hasClaimTokens;

    constructor() ERC20("CryptoAlienToken", "CAT"){

    }

    function mint(uint256 amount) public onlyOwner {
        uint256 _oldTotalSupply = totalSupply();
        _mint(address(this), amount);
        // to validate that totalSupply is updated properly
        assert(totalSupply() == _oldTotalSupply + amount);
    }
    
    // claim tokens by minting to msg.sender, limited to 1000 tokens, one time use
    function claimToken() public{
        require(hasClaimTokens[msg.sender] == false, "address already claimed tokens");
        // claim limit
        uint256 _claimAmount = 20;
        // update mapping
        hasClaimTokens[msg.sender] = true;
        // transfer tokens, sender, amount
        _transfer(address(this), msg.sender, _claimAmount);
        // validate that msg.sender receive their tokens
        assert(balanceOf(msg.sender) == _claimAmount || balanceOf(msg.sender) > _claimAmount);
    }
}