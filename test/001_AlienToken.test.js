require('hardhat');
const { expect } = require('chai');

const setupTest = deployments.createFixture(async ({deployments, getNamedAccounts, ethers}, options) => {
    await deployments.fixture(); // ensure you start from a fresh deployments
    const { deployer } = await getNamedAccounts();
    const TokenContract = await ethers.getContract("AlienToken", deployer);
    await TokenContract.mint(100).then(tx => tx.wait()); //this mint is executed once and then `createFixture` will ensure it is snapshotted
    return {
      tokenOwner: {
        address: deployer,
        TokenContract
      }
    };
});
  
describe("Alien Token unit-test", () => {

    it("TESTTOKEN: mint token, totalsupply...", async () => {
        const {tokenOwner} = await setupTest()
        // totalSupply contract should be 0 tokens at the start
        expect(await tokenOwner.TokenContract.totalSupply()).to.be.equal(100);
        // balanceOf contract should be same as totalSupply at these point
        expect(await tokenOwner.TokenContract.balanceOf(tokenOwner.TokenContract.address)).to.be.equal(100);
        // claim tokens from owner, emits Transfer event
        await expect(tokenOwner.TokenContract.claimToken())
        .to.emit(tokenOwner.TokenContract, 'Transfer')
        .withArgs(tokenOwner.TokenContract.address, tokenOwner.address, 20);
        // REVERT, already claimed the tokens, cant claim twice
        await expect(tokenOwner.TokenContract.claimToken()).to.be.revertedWith(
          "address already claimed tokens"
        );
        // totalSupply contract should be 100 tokens at the start
        expect(await tokenOwner.TokenContract.totalSupply()).to.be.equal(100);
        // balanceOF tokenOwner should be 10 tokens ()
        expect(await tokenOwner.TokenContract.balanceOf(tokenOwner.address)).to.be.equal(20);
    })
  });