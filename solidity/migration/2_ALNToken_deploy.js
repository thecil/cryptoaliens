const ALNToken = artifacts.require("ALNToken");

module.exports = function(deployer) {
  deployer.deploy(ALNToken)
};
