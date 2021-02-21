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
contract("CryptoAliens", ([owner, alfa, beta, charlie]) => {
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
            const interfaceAddress = await alienCore.IAlienNFT()
            console.log("UNIT TEST ADDRESSES")
            console.log(`ALIENCORE:: ${alienCore.address}`)
            console.log(`INTERFACE:: ${interfaceAddress}`)
            console.log(`MARKETPLACE:: ${marketplace.address}`)
            console.log(`AlienNFT::${nftAlien.address}`)
    })

    it("2. ALIENCORE: create a gen 0 alien", async function (){
      const newAlien = await alienCore.createAlienGen0(gen0Alien.genes1)
      //console.log(`Alien created, ID::${JSON.stringify(createAlien)}`)

    })

    it("3. ALIENCORE: Clone Alien", async function (){
      const nftSupply = await nftAlien.totalSupply()
      //let cloneAlien =
      await alienCore.cloneAlien(nftSupply,(nftSupply - 1))

    })

    it("4. ALIEN MARKETPLACE: SetOffer, getOffer", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes2);
      // set marketplace address to approve for all
      await nftAlien.setApprovalForAll(marketplace.address, true);
      //setOffer alien
      const _setOffer = await marketplace.setOffer(price, "1");
      // fetch the offer object for token ID = 1
      const newOffer = await marketplace.getOffer(1);
      assert.equal(newOffer.price, price);
      // Event assertions can verify that the arguments are the expected ones
      expectEvent(_setOffer, "MarketTransaction", {
        TxType: "Create offer",
        owner: owner,
        tokenId: '1'
      });
    })

    it("5. ALIEN MARKETPLACE: totalOffers, buyAlien from account[1]", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes3);
      await marketplace.setOffer(price, "5");

      const _totalOffers = await marketplace.totalOffers();
      //console.log(`TOTAL OFFERS:: ${JSON.stringify(totalOffers)}`)
      // buyAlien ID = 1
      const _buyAlien = await marketplace.buyAlien(_totalOffers, {from:alfa, value:price});
      expectEvent(_buyAlien, "MarketTransaction", {
        TxType: "Buy Alien",
        owner: alfa,
        tokenId: '1'
      });

    })

    // Conditions that trigger a require statement can be precisely tested
    it("6. ALIENCORE:REVERT: create a gen 0 alien from account[1]", async function (){
      await expectRevert(
        alienCore.createAlienGen0(gen0Alien.genes1, {from:alfa}),
        "Ownable: caller is not the owner"
      );
    })

    // Conditions that trigger a require statement can be precisely tested
    it("7. ALIENCORE:REVERT: clone alien that account[0] does not own 1 of them", async function (){
      await expectRevert(
        alienCore.cloneAlien("1", "3"),
        "The user doesn't own the token _mumId"
      );
    })

    it("8. ALIENCORE:MARKETPLACE: account[1] buy second offer, clone 2 aliens owned", async function (){
      // buyAlien ID = 5
      const _totalOffers = await marketplace.getOffer("5");

      const _buyAlienTwo = await marketplace.buyAlien("5", {from:alfa, value:price});
      expectEvent(_buyAlienTwo, "MarketTransaction", {
        TxType: "Buy Alien",
        owner: alfa,
        tokenId: '5'
      });
    })

  })//describe
})//contract
