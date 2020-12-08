const AlienCore = artifacts.require("AlienCore");
const AlienERC721 = artifacts.require("AlienERC721");

module.exports = function(deployer) {
  deployer.deploy(AlienCore, AlienERC721.address);
};
