// contracts/ALNToken.sol
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ALNToken is ERC20 {
    constructor() public ERC20("AlienCoin", "ALN") {
        _mint(msg.sender, 21000000);
    }
}
