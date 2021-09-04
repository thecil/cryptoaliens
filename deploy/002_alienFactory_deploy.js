const CONTRACT_NAME = "AlienFactory";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const TokenContract = await deployments.get("AlienToken");
  console.log("Will deploy AlienFactory with the account:", deployer);

  await deploy(CONTRACT_NAME, {
    from: deployer,
    args:[TokenContract.address],
    log: true,
  });
  
};

module.exports.tags = [CONTRACT_NAME];
module.exports.dependencies = ['AlienToken']; // this ensure the TokenContract script above is executed first, so `deployments.get('TokenContract')` succeeds