const { expect } = require('chai');

// Main function that is executed during the test
  describe("CryptoAliens", () => {
      // Global variable declarations
  let _contractInstance, alienCore, marketplace, accounts;
  const price = web3.utils.toWei("0.25");

  const gen0Alien = {
    genes1:'3440105589',
    genes2:'9834573458',
    genes3:'3456785345',
    genes4:'4564581234',
    genes5:'0129889012',
    genes6:'9123485232',
    genes7:'0129385756',
    genes8:'9057823282',
    genes9:'4390909383',
    genes10:'7458759390'
  }

  //set contracts instances
  beforeEach(async function() {
    // Deploy AlienCore to testnet
    _contractInstance = await ethers.getContractFactory('AlienFactory')
    alienCore = await _contractInstance.deploy(); 
    // Deploy AlienMarket to testnet
    _contractInstance = await ethers.getContractFactory('AlienMarketPlace')
    marketplace = await _contractInstance.deploy(alienCore.address); 
    //get all accounts from hardhat
    accounts = await ethers.getSigners();
  })

   
    it("1.  show AlienCore, interface, marketplace & AlienNFT contract addresses", async () => {
            console.log("UNIT TEST ADDRESSES")
            console.log(`AlienFactory:: ${alienCore.address}`)
            console.log(`MARKETPLACE:: ${marketplace.address}`)

    })

    it("2. ALIENCORE: create a gen 0 alien, expect revert at 10", async () => {
      for(_i in gen0Alien){
       await alienCore.createAlienGen0(gen0Alien[_i]);
      }
      
      await expect(alienCore.createAlienGen0(gen0Alien.genes1)).to.be.revertedWith(
        "Maximum amount of aliens Gen 0 reached"
      );
  
      // ALIENCORE:REVERT: create a gen 0 alien from account[1]
      await expect(alienCore.connect(accounts[1]).createAlienGen0(gen0Alien.genes1)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
      // NFT totalSupply should be 10, gen0
      expect(await alienCore.totalSupply()).to.equal(10)
    })

    it("3. ALIENCORE: Clone Alien", async () => {
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      const _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      const _newAlien = await alienCore.cloneAlien(_totalAliens[0], _totalAliens[1]);
      const _oldAlienId = await alienCore.getAlien(1);
      console.log("old _genes", ethers.utils.formatUnits(_oldAlienId[0], 0));
      console.log("old _birthTime", ethers.utils.formatUnits(_oldAlienId[1], 0));
      console.log("old _mumId", ethers.utils.formatUnits(_oldAlienId[2], 0));
      console.log("old _dadId", ethers.utils.formatUnits(_oldAlienId[3], 0));
      console.log("old _generation", ethers.utils.formatUnits(_oldAlienId[4], 0));
      const _newAlienId = await alienCore.getAlien(2);
      
      console.log("_genes", ethers.utils.formatUnits(_newAlienId[0], 0));
      console.log("_birthTime", ethers.utils.formatUnits(_newAlienId[1], 0));
      console.log("_mumId", ethers.utils.formatUnits(_newAlienId[2], 0));
      console.log("_dadId", ethers.utils.formatUnits(_newAlienId[3], 0));
      console.log("_generation", ethers.utils.formatUnits(_newAlienId[4], 0));
      // NFT totalSupply should be 3
      expect(await alienCore.totalSupply()).to.equal(3)
    })

    it("4. ALIEN MARKETPLACE: SetOffer, getOffer", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes1);
      const _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      // NFT totalSupply should be 1
      expect(await alienCore.totalSupply()).to.equal(1)
      // set marketplace address to approve for all
      await alienCore.setApprovalForAll(marketplace.address, true);
      //setOffer alien
      await expect(marketplace.setOffer(price, _totalAliens[0]))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Create offer", accounts[0].address, _totalAliens[0]);
      // fetch the offer object for token ID = 1
      const newOffer = await marketplace.getOffer(_totalAliens[0]);
      // Price should be the same as newOffer
      expect(newOffer.price).to.equal(price) 

    })

    it("5. ALIEN MARKETPLACE: totalOffers, buyAlien from account[1]", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes1);
      const _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      // NFT totalSupply should be 1
      expect(await alienCore.totalSupply()).to.equal(1)
      // set marketplace address to approve for all
      await alienCore.setApprovalForAll(marketplace.address, true);
      //setOffer alien
      await expect(marketplace.setOffer(price, _totalAliens[0]))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Create offer", accounts[0].address, _totalAliens[0]);
      // buyAlien from account[1]
      await expect(marketplace.connect(accounts[1]).buyAlien(_totalAliens[0], {value:price}))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Buy Alien", accounts[1].address, _totalAliens[0]);

    })

    it("6. ALIENCORE:REVERT: clone alien that account[0] does not own 1 of them", async () => {
      // create 2 gen0
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      // NFT totalSupply should be 2
      const _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      expect(await alienCore.totalSupply()).to.equal(2)
      // transfer tokenId 2 from accounts[0] to accounts[1]
      await expect(alienCore.transferFrom(accounts[0].address, accounts[1].address, _totalAliens[0]))
      .to.emit(alienCore, 'Transfer')
      .withArgs(accounts[0].address, accounts[1].address, _totalAliens[0]);
      // account[0] does not own alien ID = 0, will fail to clone mumId
      await expect(alienCore.cloneAlien(_totalAliens[1],_totalAliens[0])).to.be.revertedWith(
        "The user doesn't own the token _mumId"
      );
      // account[1] does not own alien ID = 1, will fail to clone dadId
      await expect(alienCore.connect(accounts[1]).cloneAlien(_totalAliens[1],_totalAliens[0])).to.be.revertedWith(
        "The user doesn't own the token _dadId"
      );
    })
   
    it("7. ALIENCORE:MARKETPLACE: account[1] buy second offer, clone 2 aliens owned", async () => {
      // create 2 gen0
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      // NFT totalSupply should be 2
      const _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      expect(await alienCore.totalSupply()).to.equal(2)
      // set marketplace address to approve for all
      await alienCore.setApprovalForAll(marketplace.address, true);
      // set 1 alien to sell
      await expect(marketplace.setOffer(price, _totalAliens[0]))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Create offer", accounts[0].address, _totalAliens[0]);
      // buyAlien tokenId = 0
      await expect(marketplace.connect(accounts[1]).buyAlien(_totalAliens[0], {value:price}))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Buy Alien", accounts[1].address, _totalAliens[0]);   
    })

    it("8. Get all aliens by owner, totalSupply should be equal to owned aliens", async () => {
      // create 2 gen0
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      const _totalSupply = await alienCore.totalSupply()
      expect(_totalSupply).to.be.equal(2)

      const _totalAliensOwned = await alienCore.getAllAliens(accounts[0].address);
      expect(_totalAliensOwned.length).to.be.equal(_totalSupply)
      
    });
/*
*/
  })//describe
