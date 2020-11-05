const ALNToken = artifacts.require("ALNToken");

contract("Test Token Mint", async accounts => {
  it("2nd Account must have 100 tokens", async () => {
    let instance = await ALNToken.deployed();
    let balance = await instance.balanceOf.call(accounts[1]);
    assert.equal(balance.valueOf(), 100);
  })
})
