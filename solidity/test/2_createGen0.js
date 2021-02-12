const AlienCore = artifacts.require("AlienCore")
const AlienERC721 = artifacts.require("AlienERC721")

it("should create a gen 0 alien", async function (){
  // get the owner address
  const accounts = await web3.eth.getAccounts();

  let alienCore = await AlienCore.deployed()
  let nftInstance = await AlienERC721.deployed()

  let interfaceAddress = await alienCore.IAlienAddress()

  let createAlien = await alienCore.createAlienGen0('10152033',{from:accounts[0]})
  console.log(`Alien created, ID::${JSON.stringify(createAlien)}`)

  //show getAliens
  console.log(`NEW TOTAL:: ${JSON.stringify(await nftInstance.totalSupply())}`)
  for (var i = 0; i < await nftInstance.totalSupply(); i++) {
    let getAliens = await nftInstance.getAlien(i)
    console.log(`ALIENS DATA ID:${i}:: ${JSON.stringify(getAliens)}`)
  }
})
