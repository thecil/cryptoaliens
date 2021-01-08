// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";

contract ALNToken is ERC20Pausable  {

  constructor() public ERC20("AlienCoin", "ALN") {}

}
