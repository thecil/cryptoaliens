//Contracts
const AlienCore = artifacts.require("AlienCore")
const AlienERC721 = artifacts.require("AlienERC721")
const AlienMarket = artifacts.require("AlienMarketPlace")

const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers')

//track balance
const balance = require('@openzeppelin/test-helpers/src/balance')


// Main function that is executed during the test
contract("CryptoAliens", ([owner, alice, bob, charlie]) => {
  // Global variable declarations
  let alienCore
  let marketplace
  let nftAlien

  const price = web3.utils.toWei("0.1")

  let gen0Alien = {
    genes1:'10152033',
    genes2:'34645456',
    genes3:'56345678',
    genes4:'45645812',
    genes5:'01298890',
    genes6:'91234852',
    genes7:'01293857',
    genes8:'90578232'
  }

  //set contracts instances
  before(async function() {
    // Deploy AlienERC721 to testnet
    nftAlien = await AlienERC721.deployed()
    // Deploy AlienCore to testnet
    alienCore = await AlienCore.deployed()
    // Deploy AlienMarket to testnet
    marketplace = await AlienMarket.deployed()
  })
  describe("Initial Values", () => {
    it("1.  show AlienCore, interface, marketplace & AlienNFT contract addresses", async function (){
            let interfaceAddress = await alienCore.IAlienAddress()
            console.log("UNIT TEST ADDRESSES")
            console.log(`ALIENCORE:: ${alienCore.address}`)
            console.log(`INTERFACE:: ${interfaceAddress}`)
            console.log(`MARKETPLACE:: ${marketplace.address}`)
            console.log(`AlienNFT::${nftAlien.address}`)
    })

    it("2. ALIENCORE: create a gen 0 alien", async function (){
      //nftSupply = await nftAlien.totalSupply()
      await alienCore.createAlienGen0(gen0Alien.genes1)
      //console.log(`Alien created, ID::${JSON.stringify(createAlien)}`)

      /*
      //show getAliens
      console.log(`NEW TOTAL:: ${JSON.stringify(nftSupply)}`)
      for (var i = 0; i < nftSupply; i++) {
        let getAliens = await nftAlien.getAlien(i)
        console.log(`ALIENS DATA ID:${i}:: ${JSON.stringify(getAliens)}`)
      }
      */
    })

    it("3. ALIENCORE: Clone Alien", async function (){
      let nftSupply = await nftAlien.totalSupply()
      //let cloneAlien =
      await alienCore.cloneAlien(nftSupply,(nftSupply - 1))
      //console.log(`CLONE ALIEN DATA:: ${JSON.stringify(cloneAlien)}`)
      //console.log(`NEW NFT TOTAL SUPPLY::${nftSupply}`)
    })

    it("4. ALIEN MARKETPLACE: SetOffer, getOffer", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes2)
      // set marketplace address to approve for all
      await nftAlien.setApprovalForAll(marketplace.address, true)
      //setOffer alien
      await marketplace.setOffer(price, "1")
      // fetch the offer object for token ID = 1
      const newOffer = await marketplace.getOffer(1);


      //console.log(`SET OFFER DATA:: ${JSON.stringify(setOffer)}`)
      //console.log(`GET OFFER DATA:: ${JSON.stringify(newOffer)}`)
      assert.equal(newOffer.price, price);
    })
/*
    it("5. ALIEN MARKETPLACE: totalOffers, buyAlien from account[1]", async function(){
      let totalOffers = await marketplace.totalOffers()
      console.log(`TOTAL OFFERS:: ${JSON.stringify(totalOffers)}`)
      let buyAlien = await marketplace.buyAlien(totalOffers,{from:addresses.acc1})
      console.log(`BUY ALIEN DATA:: ${JSON.stringify(buyAlien)}`)
    })
*/
  })//describe
})//contract
