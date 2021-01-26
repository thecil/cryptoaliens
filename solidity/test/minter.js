const AlienCore = artifacts.require("AlienCore")
const AlienERC721 = artifacts.require("AlienERC721")
const MINTER_ROLE_KECCKAK = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6'
const OWNER = '0x9038156f749D5cFd5a89E0E5Ac16808583E8594f'

it("should verify minter role", async function (){
  let alienCore = await AlienCore.deployed()
  let nftInstance = await AlienERC721.deployed()

  let interfaceAddress = await alienCore.IAlienAddress()
  let roleGranted = {
    nft: await nftInstance.hasRole(MINTER_ROLE_KECCKAK, nftInstance.address),
    core: await nftInstance.hasRole(MINTER_ROLE_KECCKAK, alienCore.address),
    owner: await nftInstance.hasRole(MINTER_ROLE_KECCKAK, OWNER)
  }
  console.log(roleGranted)
})
