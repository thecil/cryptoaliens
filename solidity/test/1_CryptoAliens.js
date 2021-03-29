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

// @openzeppelin/test-helpers utils
const balance = require('@openzeppelin/test-helpers/src/balance');
const ether = require('@openzeppelin/test-helpers/src/ether');
const { toNumber } = require('lodash');

// Main function that is executed during the test
contract("CryptoAliens", ([owner, alfa, beta, charlie]) => {
  // Global variable declarations
  let nftAlien;
  let alienCore;
  let marketplace;
  const price = ether("0.25");

  const gen0Alien = {
    genes1:'10152033',
    genes2:'34645456',
    genes3:'56345678',
    genes4:'45645812',
    genes5:'01298890',
    genes6:'91234852',
    genes7:'01293857',
    genes8:'90578232',
    genes9:'43909093',
    genes10:'74587593'
  }

  //set contracts instances
  beforeEach(async function() {
    // Deploy AlienERC721 to testnet
    nftAlien = await AlienERC721.new(); 
    // Deploy AlienCore to testnet
    alienCore = await AlienCore.new(nftAlien.address); 
    // Deploy AlienMarket to testnet
    marketplace = await AlienMarket.new(nftAlien.address); 
  })
  describe("Initial Values", () => {
/*    
    it("1.  show AlienCore, interface, marketplace & AlienNFT contract addresses", async function (){
            const interfaceAddress = await alienCore.IAlienNFT()
            console.log("UNIT TEST ADDRESSES")
            console.log(`ALIENCORE:: ${alienCore.address}`)
            console.log(`INTERFACE:: ${interfaceAddress}`)
            console.log(`MARKETPLACE:: ${marketplace.address}`)
            console.log(`AlienNFT::${nftAlien.address}`)
    })

    it("2. ALIENCORE: create a gen 0 alien, expect revert at 10", async function (){
      for(_i in gen0Alien){
       await alienCore.createAlienGen0(gen0Alien[_i]);
      }
      
      await expectRevert(
        alienCore.createAlienGen0(gen0Alien.genes1),
        "Maximum amount of aliens Gen 0 reached"
      );   
      // ALIENCORE:REVERT: create a gen 0 alien from account[1]
      await expectRevert(
        alienCore.createAlienGen0(gen0Alien.genes1, {from:alfa}),
        "Ownable: caller is not the owner"
      );

      const _totalSupply = await nftAlien.totalSupply();
      assert.equal(_totalSupply, 10, "NFT totalSupply should be 10, gen0");
    })

    it("3. ALIENCORE: Clone Alien", async function (){
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);

      let _totalSupply = await nftAlien.totalSupply();
      await alienCore.cloneAlien(_totalSupply,(_totalSupply - 1));
      _totalSupply = await nftAlien.totalSupply();
      assert.equal(_totalSupply, 3, "NFT totalSupply should be 3");
    })

    it("4. ALIEN MARKETPLACE: SetOffer, getOffer", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes1);
      assert.equal(_totalSupply, 1, "NFT totalSupply should be 1");
      // set marketplace address to approve for all
      await nftAlien.setApprovalForAll(marketplace.address, true);
      //setOffer alien
      const _setOffer = await marketplace.setOffer(price, "1");
      // fetch the offer object for token ID = 1
      const newOffer = await marketplace.getOffer("1");
      let _offerPrice = newOffer.price;
      assert.equal(_offerPrice.toString(), price, "Price should be the same as newOffer");
      // Event assertions can verify that the arguments are the expected ones
      expectEvent(_setOffer, "MarketTransaction", {
        TxType: "Create offer",
        owner: owner,
        tokenId: "1"
      });
    })

    it("5. ALIEN MARKETPLACE: totalOffers, buyAlien from account[1]", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes1);
      let _totalSupply = await nftAlien.totalSupply();
      assert.equal(_totalSupply, 1, "NFT totalSupply should be 1");

      // set marketplace address to approve for all
      await nftAlien.setApprovalForAll(marketplace.address, true);

      await marketplace.setOffer(price, _totalSupply);

      const _buyAlien = await marketplace.buyAlien(_totalSupply, {from:alfa, value:price});
      expectEvent(_buyAlien, "MarketTransaction", {
        TxType: "Buy Alien",
        owner: alfa,
        tokenId: '1'
      });

    })

    it("7. ALIENCORE:REVERT: clone alien that account[0] does not own 1 of them", async function (){
      // create 2 gen0
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      let _totalSupply = await nftAlien.totalSupply();
      assert.equal(_totalSupply, 2, "NFT totalSupply should be 2");
      // transfer tokenId 2 from owner to accounts[1]
      let _transfer = await nftAlien.safeTransferFrom(owner, alfa, "2");
      expectEvent(_transfer, "Transfer", {
        from: owner,
        to: alfa,
        tokenId: '2'
      });

      await expectRevert(
        alienCore.cloneAlien("1", "2"),
        "The user doesn't own the token _mumId"
      );
    })
*/    
    it("8. ALIENCORE:MARKETPLACE: account[1] buy second offer, clone 2 aliens owned", async function (){
      // create 2 gen0
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      let _totalSupply = await nftAlien.totalSupply();
      assert.equal(_totalSupply, 2, "NFT totalSupply should be 2");
      /*
      // set marketplace address to approve for all
      await nftAlien.setApprovalForAll(marketplace.address, true);
      // set 1 alien to sell
      await marketplace.setOffer(price, "2");
      // buyAlien tokenId = 2
      const _totalOffers = await marketplace.getOffer("2");

      const _buyAlien = await marketplace.buyAlien("2", {from:alfa, value:price});
      expectEvent(_buyAlien, "MarketTransaction", {
        TxType: "Buy Alien",
        owner: alfa,
        tokenId: '2'
      });
*/
      
      let _balanceOf = await nftAlien.balanceOf(owner);
      let _res = []
      for(let _i = 1; _i <= _balanceOf; _i++){
        let _alien = await nftAlien.alienDetails(owner, _i);
        console.log(JSON.stringify(_alien));
        
        let _getAlien = await nftAlien.getAlien(1);
        console.log(JSON.stringify(_getAlien));
        _res.push(_getAlien);
      }
      console.log(_res)
      
    })
/*
*/
  })//describe
})//contract
