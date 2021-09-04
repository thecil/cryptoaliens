const CONTRACT_NAME = "AlienToken";

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Will deploy AlienToken with the account:", deployer);

  await deploy(CONTRACT_NAME, {
    from: deployer,
    log: true,
  });
  
};

module.exports.tags = [CONTRACT_NAME];