const AlienNFT = artifacts.require("AlienNFT");

module.exports = function(deployer) {
  deployer.deploy(AlienNFT)
};
