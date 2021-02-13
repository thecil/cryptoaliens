const AlienERC721 = artifacts.require("AlienERC721");
const AlienCore = artifacts.require("AlienCore");
const AlienMarket = artifacts.require("AlienMarketPlace")

module.exports = async function(deployer) {
  await deployer.deploy(AlienERC721)
  await deployer.deploy(AlienCore, AlienERC721.address)
  await deployer.deploy(AlienMarket)
  let nft = await AlienERC721.deployed()
  let alcore = await AlienCore.deployed()
  let marketplace = await AlienMarket.deployed()
  let totSupply = await nft.totalSupply()
  console.log("MIGRATION ADDRESSES, CHECK WITH UNIT TESTING")
  console.log(`NFT:: ${nft.address}`)
  console.log(`ALCORE:: ${alcore.address}`)
  console.log(`MARKET:: ${marketplace.address}`)
  console.log(`NFT TOTAL SUPPLY:: ${totSupply}`)

  /*
  try{
    console.log("alcore ",alcore.address,"nft: ",nft.address)

    let calldata = await alcore.IAlienAddress()
    console.log("itf: ", calldata)
    //alcore.createAlienGen0('101520111')

  }catch(err){
    console.log(err)
  }
  */
};
