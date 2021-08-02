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

    // claim tokens by minting to msg.sender, limited to 1000 tokens, one time use
    function claimToken() public{
        require(hasClaimTokens[msg.sender] == false, "msg.sender already claimed tokens");
        // claim limit
        uint256 _claimAmount = 1000;
        uint256 _oldTotalSupply = totalSupply();

        // console.log("claimToken: msg.sender[%s], _claimAmount[%s], _oldTotalSupply[%s]", msg.sender, _claimAmount, _oldTotalSupply);
        
        // mint tokens, sender, amount
        _mint(msg.sender, _claimAmount);
        // update mapping
        hasClaimTokens[msg.sender] = true;

        // console.log("claimToken: _mint[%s], hasClaimTokens[%s]", _claimAmount, hasClaimTokens[msg.sender]);
        // console.log("claimToken: msg.sender balanceOf[%s]", balanceOf(msg.sender));

        // to validate that totalSupply is updated properly
        assert(totalSupply() == _oldTotalSupply + _claimAmount);
    }
}