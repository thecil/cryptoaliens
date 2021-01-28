const AlienCore = artifacts.require("AlienCore")

it("should create a gen 0 alien", async function (){
  // get the owner address
  const accounts = await web3.eth.getAccounts();

  let alienCore = await AlienCore.deployed()
  let interfaceAddress = await alienCore.IAlienAddress()
  let createAlien //= await alienCore.createAlienGen0('10152033',{from:accounts[0]})

  console.log(`Alien created, ID::${JSON.stringify(createAlien)}`)

})
