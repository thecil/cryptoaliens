const AlienERC721 = artifacts.require("AlienERC721");
const ALNToken = artifacts.require("ALNToken");

module.exports = function(deployer) {
  deployer.deploy(AlienERC721, ALNToken.address);
};
