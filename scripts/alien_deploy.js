async function main() {
    // We get the contract to deploy
    // Deploy AlienCore to testnet
    let _contractInstance = await ethers.getContractFactory('AlienFactory')
    const alienCore = await _contractInstance.deploy(); 
    // Deploy AlienMarket to testnet
    _contractInstance = await ethers.getContractFactory('AlienMarketPlace')
    const marketplace = await _contractInstance.deploy(alienCore.address);
    console.log(`AlienFactory:: ${alienCore.address}`)
    console.log(`MARKETPLACE:: ${marketplace.address}`)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });