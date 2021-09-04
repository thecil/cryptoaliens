const CONTRACT_NAME = "AlienMarketPlace";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const AlienFactory = await deployments.get("AlienFactory");
  console.log("Will deploy AlienMarketPlace with the account:", deployer);

  await deploy(CONTRACT_NAME, {
    from: deployer,
    args:[AlienFactory.address],
    log: true,
  });
  
};

module.exports.tags = [CONTRACT_NAME];
module.exports.dependencies = ['AlienFactory']; // this ensure the Token script above is executed first, so `deployments.get('Token')` succeeds