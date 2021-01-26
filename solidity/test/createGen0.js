const AlienCore = artifacts.require("AlienCore")

it("should create a gen 0 alien", async function (){
  // get the owner address
  const accounts = await web3.eth.getAccounts();

  let alienCore = await AlienCore.deployed()
  let createAlien = await alienCore.createAlienGen0('101520111')
  let interfaceAddress = await alienCore.IAlienAddress()

  console.log(`Alien created, ID::${createAlien}`)
})
