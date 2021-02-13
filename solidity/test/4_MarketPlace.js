const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')
//test-helpers config

//track balance
const balance = require('@openzeppelin/test-helpers/src/balance')
//Contracts
const AlienCore = artifacts.require("AlienCore")
const AlienERC721 = artifacts.require("AlienERC721")
const AlienMarket = artifacts.require("AlienMarketPlace")

// Main function that is executed during the test
contract("Marketplace", () => {
  // Global variable declarations
  let alienCore
  let marketplace
  let nftAlien
  const price = web3.utils.toWei("0.1")

  //set contracts instances
  before(async function() {
    // Deploy AlienERC721 to testnet
    nftAlien = await AlienERC721.deployed()
    // Deploy AlienCore to testnet
    alienCore = await AlienCore.deployed()
    // Deploy AlienMarket to testnet
    marketplace = await AlienMarket.deployed()
    //accounts participants
    const accounts = await web3.eth.getAccounts()
    const addresses = {
      owner:accounts[0],
      acc1:accounts[1],
      acc2:accounts[2]
    }
  })
  describe("Initial Values", () => {
    it("Should: SetOffer, getOffer, buyAlien from account[1]", async function(){
      let nftSupply = await nftAlien.totalSupply()
      //setOffer alien
      let setOffer = await marketplace.setOffer(price, nftSupply,{from:addresses.owner})
      nftSupply = await nftAlien.totalSupply()
      console.log(`SET OFFER DATA:: ${JSON.stringify(setOffer)}`)
      console.log(`NFT TOTAL SUPPLY::${nftSupply}`)
    })
  })
})
