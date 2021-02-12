const AlienCore = artifacts.require("AlienCore")
const AlienERC721 = artifacts.require("AlienERC721")
const AlienMarket = artifacts.require("AlienMarketPlace")

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');
//track balance
const balance = require('@openzeppelin/test-helpers/src/balance');

contract("Marketplace", ([owner, alice, bob, charlie]) => {
  // Global variable declarations
  let kittycontract;
  let marketplace;
)}
it("Should: SetOffer, getOffer, buyAlien from account[1]", async function (){
  // get the owner address
  const accounts = await web3.eth.getAccounts()
  const OWNER = accounts[0]
  //instances
  let alienCore = await AlienCore.deployed()
  let nftInstance = await AlienERC721.deployed()
  let marketInstance = await AlienMarket.deployed()
  let nftSupply = await nftInstance.totalSupply()
  //setOffer alien
  let setOffer = await marketInstance.setOffer()


  nftSupply = await nftInstance.totalSupply()
  console.log(`CLONE ALIEN DATA:: ${JSON.stringify(cloneAlien)}`)
  console.log(`NFT TOTAL SUPPLY::${nftSupply}`)
})
