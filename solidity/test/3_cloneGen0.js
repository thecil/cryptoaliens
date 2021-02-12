const AlienCore = artifacts.require("AlienCore")
const AlienERC721 = artifacts.require("AlienERC721")

it("Clone Alien", async function (){
  // get the owner address
  const accounts = await web3.eth.getAccounts()
  const OWNER = accounts[0]
  //instances
  let alienCore = await AlienCore.deployed()
  let nftInstance = await AlienERC721.deployed()
  let totSupply = await nftInstance.totalSupply()

  //clone alien
  let cloneAlien = await alienCore.cloneAlien(totSupply,(totSupply - 1), {from:accounts[0]})
  totSupply = await nftInstance.totalSupply()
  console.log(`CLONE ALIEN DATA:: ${JSON.stringify(cloneAlien)}`)
  console.log(`NEW NFT TOTAL SUPPLY::${totSupply}`)
})
