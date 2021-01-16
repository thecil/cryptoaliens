const ALNToken = artifacts.require("ALNToken");

it("should mint 1000 tokens", async function (){
        let instance = await ALNToken.deployed();
        _mint = await instance._mint();
        console.log(contractBalance);
        console.log(balanceonchain);

        assert(balanceonchain == contractBalance, "Balance on blockchain and stored contract balance do not match");
    });
