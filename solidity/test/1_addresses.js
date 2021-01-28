const AlienCore = artifacts.require("AlienCore");
const AlienERC721 = artifacts.require("AlienERC721")

it("should show AlienCore & AlienNFT contract addresses", async function (){
        let instance = await AlienCore.deployed()
        let interfaceAddress = await instance.IAlienAddress()
        let nftInstance = await AlienERC721.deployed()
        console.log("UNIT TEST ADDRESSES")
        console.log(`ALIENCORE:: ${instance.address}`)
        console.log(`INTERFACE:: ${interfaceAddress}`)
        //show totalSupply
        let totalSupply = await nftInstance.totalSupply()
        console.log(`NFT TOTAL SUPPLY::${totalSupply}`)
    });
