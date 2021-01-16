const ALNToken = artifacts.require("ALNToken");
const AlienCore = artifacts.require("AlienCore");
const AlienERC721 = artifacts.require("AlienERC721");

module.exports = async function(deployer) {
  deployer.deploy(ALNToken);
    let token = await ALNToken.deployed()
  deployer.deploy(AlienERC721, token.address);
    let nft = await AlienERC721.deployed()
  deployer.deploy(AlienCore,await nft.address);
  let alcore = await AlienCore.deployed()

  // get the owner address
  const accounts = await web3.eth.getAccounts();

  try{
    console.log("alcore ",alcore.address,"nft: ",nft.address)
    //await nft.grantRole('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6', alcore.address)
    //let roleGranted = await nft.hasRole('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6', alcore.address)
    let calldata = await alcore.IAlienAddress()
    console.log("itf: ", calldata)
    //alcore.createAlienGen0('101520111')
      console.log(accounts)
  }catch(err){
    console.log(err)
  }
};
