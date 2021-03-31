// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";

contract ALNToken is ERC20Pausable  {

  constructor() public ERC20("AlienCoin", "ALN") {}

}
