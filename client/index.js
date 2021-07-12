
var web3 = new Web3(Web3.givenProvider)
var alienFactoryInstance, alienMarketInstance, user, contractOwner
var alienFactory_adderss = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
var alienMarketplace_address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

$(document).ready(function(){
  window.ethereum.enable()
  .then(function(accounts){
    alienFactoryInstance = new web3.eth.Contract(abiAlienFactory, alienFactory_adderss, {from: accounts[0]})
    alienMarketInstance = new web3.eth.Contract(abiAlienMarketplace, alienMarketplace_address, {from: accounts[0]})

    alienFactoryInstance.methods.owner().call().then(test => {
      contractOwner = test;
    });
    user = accounts[0];

    console.log("alien Factory", alienFactoryInstance);
    console.log("alien Marketplace", alienMarketInstance);

  }).catch( error => console.error)

});

$('#createAlien').click(function(){
  var _genes =  getDna()

  alienFactoryInstance.methods.createAlienGen0(_genes)
  .send({}, function(error, txHash){
    if(error){
      console.log(error)
    }else{console.log(txHash)}
  })

})

//Get aliens of a current address
async function myAliens() {
  var arrayId = await alienFactoryInstance.methods.getAllAliens(user).call();
  for (i = 0; i < arrayId.length; i++) {
    console.log("appending MyAliens")
    await appendAliens(arrayId[i])
  }
}

//Appending cats for catalog
async function appendAliens(id) {
  log("appendAliens")
  var alien = await alienFactoryInstance.methods.getAlien(id).call()
  console.log("appending", alien)
  appendAlien(alien[0], id, alien['_generation'])
}

async function singleAlien() {
  var id = get_variables().alienId
  var alien = await alienFactoryInstance.methods.getAlien(id).call()
  singleAlien(alien[0], id, alien['_generation'])
}