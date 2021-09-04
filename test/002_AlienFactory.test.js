// We import Chai to use its assertion functions here.
require('hardhat');
const { expect } = require('chai');

const setupTest = deployments.createFixture(async ({deployments, getNamedAccounts, ethers, getUnnamedAccounts}, options) => {
    // it first ensures the deployment is executed and reset (use of evm_snapshot for faster tests)
    await deployments.fixture(); 
    const { deployer } = await getNamedAccounts();
    const contracts = {
        AlienFactory : (await ethers.getContract("AlienFactory", deployer)),
        AlienToken : (await ethers.getContract("AlienToken", deployer)),
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

    it("1. ALIENCORE: create a gen 0 alien, expect revert at 10", async () => {
        // initialize contracts
        const {AlienFactory, users} = await setupTest();

        for(let _i in gen0Alien){
         await AlienFactory.createAlienGen0(gen0Alien[_i]);
        }
        
        await expect(AlienFactory.createAlienGen0(gen0Alien.genes1)).to.be.revertedWith(
          "Maximum amount of aliens Gen 0 reached"
        );
    
        // ALIENCORE:REVERT: create a gen 0 alien from account[1]
        await expect(AlienFactory.connect(users[1]).createAlienGen0(gen0Alien.genes1)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
        // NFT totalSupply should be 10, gen0
        expect(await AlienFactory.totalSupply()).to.equal(10)
    });
  
    it("2. ALIENCORE: Clone Alien", async () => {
        // initialize contracts
        const {AlienFactory, users} = await setupTest();
  
        await AlienFactory.createAlienGen0(gen0Alien.genes1);
        await AlienFactory.createAlienGen0(gen0Alien.genes2);
        const _totalAliens = await AlienFactory.getAllAliens(users[0].address);
        
        await AlienFactory.cloneAlien(_totalAliens[0], _totalAliens[1]);
  
        // NFT totalSupply should be 3
        expect(await AlienFactory.totalSupply()).to.equal(4)
    });

    it("3. ALIENCORE: Should create 2 gen0 aliens, pause contract, fail to create, unpause and create a 3rd gen0 alien", async () => {
        // initialize contracts
        const {AlienFactory, users} = await setupTest();
        
        // create 2 gen0
        await AlienFactory.createAlienGen0(gen0Alien.genes1);
        await AlienFactory.createAlienGen0(gen0Alien.genes2);
        let _totalSupply = await AlienFactory.totalSupply()
        expect(_totalSupply).to.be.equal(3)
        // pause contract
        await expect(AlienFactory.pauseContract())
        .to.emit(AlienFactory, 'Paused')
        .withArgs(users[0].address);
        // createAlien will fail, CONTRACT PAUSED
        await expect(AlienFactory.createAlienGen0(gen0Alien.genes3)).to.be.revertedWith(
          "Pausable: paused"
        );
        // try unpause with account[1], should fail, not owner
        await expect(AlienFactory.connect(users[1]).createAlienGen0(gen0Alien.genes4)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
        // unpause contract
        await expect(AlienFactory.unpauseContract())
        .to.emit(AlienFactory, 'Unpaused')
        .withArgs(users[0].address);
        // create alien after unpause
        await AlienFactory.createAlienGen0(gen0Alien.genes2);
        _totalSupply = await AlienFactory.totalSupply()
        expect(_totalSupply).to.be.equal(4)
    });
});