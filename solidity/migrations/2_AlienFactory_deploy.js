const AlienFactory = artifacts.require("AlienFactory");

module.exports = function(deployer) {
  deployer.deploy(AlienFactory)
};
