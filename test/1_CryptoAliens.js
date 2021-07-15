const { expect } = require('chai');

// Main function that is executed during the test
  describe("CryptoAliens", () => {
      // Global variable declarations
  let _contractInstance, alienCore, marketplace, accounts;
  const price = web3.utils.toWei("0.25");
  const _formatUnit = (_value) => {return ethers.utils.formatUnits(_value, 0) } 
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

   
    it.skip("1.  show AlienCore, interface, marketplace & AlienNFT contract addresses", async () => {
            console.log("UNIT TEST ADDRESSES")
            console.log(`AlienFactory:: ${alienCore.address}`)
            console.log(`MARKETPLACE:: ${marketplace.address}`)

    })

    it.skip("2. ALIENCORE: create a gen 0 alien, expect revert at 10", async () => {
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

    it.skip("3. ALIENCORE: Clone Alien", async () => {
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      const _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      
      await alienCore.cloneAlien(_totalAliens[0], _totalAliens[1]);

      // NFT totalSupply should be 3
      expect(await alienCore.totalSupply()).to.equal(3)
    })

    it("4. ALIEN MARKETPLACE: SetOffer, getOffer", async function(){
      // create 2 gen0 aliens
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      const _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      // NFT totalSupply should be 2
      expect(await alienCore.totalSupply()).to.equal(2)
      // set marketplace address to approve for all
      await alienCore.setApprovalForAll(marketplace.address, true);
      //setOffer alien
      await expect(marketplace.setOffer(price, _totalAliens[1]))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Create offer", accounts[0].address, _totalAliens[1]);
      // fetch the offer object for token ID = 1
      const newOffer = await marketplace.getOffer(1);
      // Price should be the same as newOffer
      expect(newOffer.price).to.equal(price) 
      // tokenId should be the same as token ID = 1
      expect(newOffer.tokenId).to.equal(1)
    })

    it.skip("5. ALIEN MARKETPLACE: totalOffers, buyAlien from account[1]", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      let _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      // NFT totalSupply should be 2
      expect(await alienCore.totalSupply()).to.equal(2)
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
      // verify everyone owns the proper tokenId after buying
      let _totAliens = await alienCore.getAllAliens(accounts[1].address)
      _totalAliens = await alienCore.getAllAliens(accounts[0].address);
      // each account should own 1 tokenId
      expect(_formatUnit(_totAliens[0])).to.equal("0");
      expect(_formatUnit(_totalAliens[0])).to.equal("1");
      // verify ERC721Enumerable indexs should contain the same tokenId
      let _tokenByIndex = await alienCore.tokenByIndex(_formatUnit(_totAliens[0]));
      expect(_formatUnit(_tokenByIndex)).to.equal("0");
      _tokenByIndex = await alienCore.tokenByIndex(_formatUnit(_totalAliens[0]));
      expect(_formatUnit(_tokenByIndex)).to.equal("1");
      let _tokenOfOwnerByIndex = await alienCore.tokenOfOwnerByIndex(accounts[0].address, 0);
      expect(_formatUnit(_tokenOfOwnerByIndex)).to.equal("1");
      _tokenOfOwnerByIndex = await alienCore.tokenOfOwnerByIndex(accounts[1].address, 0);
      expect(_formatUnit(_tokenOfOwnerByIndex)).to.equal("0");
    })

    it.skip("6. ALIENCORE:REVERT: clone alien that account[0] does not own 1 of them", async () => {
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
   
    it.skip("7. ALIENCORE:MARKETPLACE: account[1] buy second offer, clone 2 aliens owned", async () => {
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

    it.skip("8. Get all aliens by owner, totalSupply should be equal to owned aliens", async () => {
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
