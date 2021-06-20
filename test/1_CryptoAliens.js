const { expect } = require('chai');

// Main function that is executed during the test
  describe("CryptoAliens", () => {
      // Global variable declarations
  let _contractInstance, alienCore, marketplace, owner, addr1, addr2
  const price = web3.utils.toWei("0.25");

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
    // Deploy AlienCore to testnet
    _contractInstance = await ethers.getContractFactory('AlienCore')
    alienCore = await _contractInstance.deploy(); 
    // Deploy AlienMarket to testnet
    _contractInstance = await ethers.getContractFactory('AlienMarketPlace')
    marketplace = await _contractInstance.deploy(alienCore.address); 
    //get 3 of all accounts from hardhat
    [owner, addr1, addr2] = await ethers.getSigners();
  })

   
    it("1.  show AlienCore, interface, marketplace & AlienNFT contract addresses", async () => {
            console.log("UNIT TEST ADDRESSES")
            console.log(`ALIENCORE:: ${alienCore.address}`)
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
      await expect(alienCore.connect(addr1).createAlienGen0(gen0Alien.genes1)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
      // NFT totalSupply should be 10, gen0
      expect(await alienCore.totalSupply()).to.equal(10)
    })

    it("3. ALIENCORE: Clone Alien", async () => {
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      const _totalAliens = await alienCore.getAllAliens(owner.address);
      console.log(`total#2[${_totalAliens}]`)
      await alienCore.cloneAlien(_totalAliens[0], _totalAliens[1]);
 
      // NFT totalSupply should be 3
      expect(await alienCore.totalSupply()).to.equal(3)
    })

    it("4. ALIEN MARKETPLACE: SetOffer, getOffer", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes1);
      const _totalAliens = await alienCore.getAllAliens(owner.address);
      // NFT totalSupply should be 1
      expect(await alienCore.totalSupply()).to.equal(1)
      // set marketplace address to approve for all
      await alienCore.setApprovalForAll(marketplace.address, true);
      //setOffer alien
      console.log(`total#4[${_totalAliens}], length[${_totalAliens.length}]`)
      await expect(marketplace.setOffer(price, _totalAliens[0]))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Create offer", owner.address, _totalAliens[0]);
      // fetch the offer object for token ID = 1
      const newOffer = await marketplace.getOffer(_totalAliens[0]);
      // Price should be the same as newOffer
      expect(newOffer.price).to.equal(price) 

    })

    it("5. ALIEN MARKETPLACE: totalOffers, buyAlien from account[1]", async function(){
      await alienCore.createAlienGen0(gen0Alien.genes1);
      const _totalAliens = await alienCore.getAllAliens(owner.address);
      // NFT totalSupply should be 1
      expect(await alienCore.totalSupply()).to.equal(1)
      // set marketplace address to approve for all
      await alienCore.setApprovalForAll(marketplace.address, true);
      //setOffer alien
      await expect(marketplace.setOffer(price, _totalAliens[0]))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Create offer", owner.address, _totalAliens[0]);
      // buyAlien from account[1]
      await expect(marketplace.connect(addr1).buyAlien(_totalAliens[0], {value:price}))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Buy Alien", addr1.address, _totalAliens[0]);

    })

    it("6. ALIENCORE:REVERT: clone alien that account[0] does not own 1 of them", async () => {
      // create 2 gen0
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      // NFT totalSupply should be 2
      const _totalAliens = await alienCore.getAllAliens(owner.address);
      expect(await alienCore.totalSupply()).to.equal(2)
      // transfer tokenId 2 from owner to accounts[1]
      await expect(alienCore.transferFrom(owner.address, addr1.address, _totalAliens[0]))
      .to.emit(alienCore, 'Transfer')
      .withArgs(owner.address, addr1.address, _totalAliens[0]);
      // account[0] does not own alien ID = 0, will fail to clone mumId
      await expect(alienCore.cloneAlien(_totalAliens[1],_totalAliens[0])).to.be.revertedWith(
        "The user doesn't own the token _mumId"
      );
      // account[1] does not own alien ID = 1, will fail to clone dadId
      await expect(alienCore.connect(addr1).cloneAlien(_totalAliens[1],_totalAliens[0])).to.be.revertedWith(
        "The user doesn't own the token _dadId"
      );
    })
   
    it("7. ALIENCORE:MARKETPLACE: account[1] buy second offer, clone 2 aliens owned", async () => {
      // create 2 gen0
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      // NFT totalSupply should be 2
      const _totalAliens = await alienCore.getAllAliens(owner.address);
      expect(await alienCore.totalSupply()).to.equal(2)
      // set marketplace address to approve for all
      await alienCore.setApprovalForAll(marketplace.address, true);
      // set 1 alien to sell
      await expect(marketplace.setOffer(price, _totalAliens[0]))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Create offer", owner.address, _totalAliens[0]);
      // buyAlien tokenId = 0
      await expect(marketplace.connect(addr1).buyAlien(_totalAliens[0], {value:price}))
      .to.emit(marketplace, 'MarketTransaction')
      .withArgs("Buy Alien", addr1.address, _totalAliens[0]);   
    })

    it("8. Get all aliens by owner", async () => {
      // create 2 gen0
      await alienCore.createAlienGen0(gen0Alien.genes1);
      await alienCore.createAlienGen0(gen0Alien.genes2);
      expect(await alienCore.totalSupply()).to.be.equal(2)

      await alienCore.getAllAliens(owner.address);
    });
/*
*/
  })//describe
