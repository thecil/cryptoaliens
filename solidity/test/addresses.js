const AlienCore = artifacts.require("AlienCore");

it("should show AlienCore & AlienNFT contract addresses", async function (){
        let instance = await AlienCore.deployed()
        let interfaceAddress = await instance.IAlienAddress()
          console.log("UNIT TEST ADDRESSES")
        console.log(`ALIENCORE:: ${instance.address}`)
        console.log(`INTERFACE:: ${interfaceAddress}`)
    });
