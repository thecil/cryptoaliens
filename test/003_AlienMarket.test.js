// We import Chai to use its assertion functions here.
require('hardhat');
const { expect } = require('chai');

const setupTest = deployments.createFixture(async ({deployments, getNamedAccounts, ethers, getUnnamedAccounts}, options) => {
    // it first ensures the deployment is executed and reset (use of evm_snapshot for faster tests)
    await deployments.fixture(); 
    const { deployer } = await getNamedAccounts();
    const contracts = {
        AlienToken : (await ethers.getContract("AlienToken", deployer)),
        AlienFactory : (await ethers.getContract("AlienFactory", deployer)),
        AlienMarketPlace : (await ethers.getContract("AlienMarketPlace", deployer)),
    }

    const users = await ethers.getSigners();

    // mint, claim & allow contract to transfer tokens
    await contracts.AlienToken.mint(100);
    await contracts.AlienToken.claimToken();
    await contracts.AlienToken.approve(contracts.AlienFactory.address, 20);
    //this createAlienGen0 is executed once and then `createFixture` will ensure it is snapshotted
    await contracts.AlienFactory.createAlienGen0("3440105589").then(tx => tx.wait());
    // finally we return the whole object (including the tokenOwner setup as a User object)
    return {
        ...contracts,
        users,
        tokenOwner: deployer,
    };
});

describe("Alien Factory unit-test", () => {
    const price = web3.utils.toWei("0.25");
    const _formatUnit = (_value) => {return ethers.utils.formatUnits(_value, 0) };
    const gen0Alien = {
        genes1:'7458759390',
        genes2:'9834573458',
        genes3:'3456785345',
        genes4:'4564581234',
        genes5:'0129889012',
        genes6:'9123485232',
        genes7:'0129385756',
        genes8:'9057823282',
        genes9:'4390909383',
    }

    it("4. ALIEN MARKETPLACE: SetOffer, getOffer", async function(){
        // initialize contracts
        const {AlienFactory, AlienMarketPlace, users} = await setupTest();
  
        // create 2 gen0 aliens
        await AlienFactory.createAlienGen0(gen0Alien.genes1);
        await AlienFactory.createAlienGen0(gen0Alien.genes2);
        const _totalAliens = await AlienFactory.getAllAliens(users[0].address);
        // NFT totalSupply should be 3
        expect(await AlienFactory.totalSupply()).to.equal(3)
        // set AlienMarketPlace address to approve for all
        await AlienFactory.setApprovalForAll(AlienMarketPlace.address, true);
        //setOffer alien
        await expect(AlienMarketPlace.setOffer(price, _totalAliens[1]))
        .to.emit(AlienMarketPlace, 'MarketTransaction')
        .withArgs("Create offer", users[0].address, _totalAliens[1]);
        // fetch the offer object for token ID = 1
        const newOffer = await AlienMarketPlace.getOffer(1);
        // Price should be the same as newOffer
        expect(newOffer.price).to.equal(price) 
        // tokenId should be the same as token ID = 1
        expect(newOffer.tokenId).to.equal(1)
      })
  
      it("5. ALIEN MARKETPLACE: totalOffers, buyAlien from account[1]", async function(){
        // initialize contracts
        const {AlienFactory, AlienMarketPlace, users} = await setupTest();
  
        await AlienFactory.createAlienGen0(gen0Alien.genes1);
        await AlienFactory.createAlienGen0(gen0Alien.genes2);
        await AlienFactory.createAlienGen0(gen0Alien.genes3);
        await AlienFactory.createAlienGen0(gen0Alien.genes4);
        let _totalAliens = await AlienFactory.getAllAliens(users[0].address);
        // NFT totalSupply should be 5
        expect(await AlienFactory.totalSupply()).to.equal(5)
        // set AlienMarketPlace address to approve for all
        await AlienFactory.setApprovalForAll(AlienMarketPlace.address, true);
        //setOffer alien tokenId = 1
        await expect(AlienMarketPlace.setOffer(price, _totalAliens[1]))
        .to.emit(AlienMarketPlace, 'MarketTransaction')
        .withArgs("Create offer", users[0].address, _totalAliens[1]);
        //setOffer alien tokenId = 1
        await expect(AlienMarketPlace.setOffer(price, _totalAliens[3]))
        .to.emit(AlienMarketPlace, 'MarketTransaction')
        .withArgs("Create offer", users[0].address, _totalAliens[3]);
  
        // buyAlien from account[1]
        await expect(AlienMarketPlace.connect(users[1]).buyAlien(_totalAliens[1], {value:price}))
        .to.emit(AlienMarketPlace, 'MarketTransaction')
        .withArgs("Buy Alien", users[1].address, _totalAliens[1]);
        // verify everyone owns the proper tokenId after buying
        let _totAliens = await AlienFactory.getAllAliens(users[1].address);
        _totalAliens = await AlienFactory.getAllAliens(users[0].address);
   
  
        // each account should users[0] = 4, users[1] = 1 tokenId
        expect(_formatUnit(_totAliens.length)).to.equal("1");
        expect(_formatUnit(_totalAliens.length)).to.equal("4");
        // verify ERC721Enumerable indexs should contain the same tokenId
        let _tokenByIndex = await AlienFactory.tokenByIndex(_formatUnit(_totAliens[0]));
        expect(_formatUnit(_tokenByIndex)).to.equal("1");
        _tokenByIndex = await AlienFactory.tokenByIndex(_formatUnit(_totalAliens[0]));
        expect(_formatUnit(_tokenByIndex)).to.equal("0");
        _tokenByIndex = await AlienFactory.tokenByIndex(_formatUnit(_totalAliens[1]));
        expect(_formatUnit(_tokenByIndex)).to.equal("4");
        let _tokenOfOwnerByIndex = await AlienFactory.tokenOfOwnerByIndex(users[0].address, 0);
        expect(_formatUnit(_tokenOfOwnerByIndex)).to.equal("0");
        _tokenOfOwnerByIndex = await AlienFactory.tokenOfOwnerByIndex(users[1].address, 0);
        expect(_formatUnit(_tokenOfOwnerByIndex)).to.equal("1");
      })
});