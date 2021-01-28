const AlienCore = artifacts.require("AlienCore")
const AlienERC721 = artifacts.require("AlienERC721")

it("clone an Alien", async function (){
  // get the owner address
  const accounts = await web3.eth.getAccounts()
  const OWNER = accounts[0]
  //instances
  let alienCore = await AlienCore.deployed()
  let nftInstance = await AlienERC721.deployed()

  //show getAliens
  console.log(`NEW TOTAL:: ${JSON.stringify(await nftInstance.totalSupply())}`)
  for (var i = 0; i < await nftInstance.totalSupply(); i++) {
    let getAliens = await nftInstance.getAlien(i)
    console.log(`ALIENS DATA ID:${i}:: ${JSON.stringify(getAliens)}`)
  }
  //clone alien
  console.log(`Cloning alien`)
  let cloneAlien = await alienCore.cloneAlien(1,2, {from:accounts[0]})
  console.log(`CLONE ALIEN DATA:: ${JSON.stringify(cloneAlien)}`)
})
