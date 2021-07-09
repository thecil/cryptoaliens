
var web3 = new Web3(Web3.givenProvider)
var alienFactoryInstance, alienMarketInstance
var alienFactory_adderss = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
var alienMarketplace_address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

$(document).ready(function(){
  window.ethereum.enable()
  .then(function(accounts){
    alienFactoryInstance = new web3.eth.Contract(abiAlienFactory, alienFactory_adderss, {from: accounts[0]})
    alienMarketInstance = new web3.eth.Contract(abiAlienMarketplace, alienMarketplace_address, {from: accounts[0]})

    console.log("alien Factory", alienFactoryInstance);
    console.log("alien Marketplace", alienMarketInstance);

  }).catch( error => console.error)

})
