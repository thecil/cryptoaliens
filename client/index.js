
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
    await appendAliens(arrayId[i])
  }
}

//Appending cats for catalog
async function appendAliens(id) {
  var alien = await alienFactoryInstance.methods.getAlien(id).call()
  appendAlien(alien[0], id, alien['_generation'])
}

async function alienDetails() {
  var id = get_variables().alienId
  var alien = await alienFactoryInstance.methods.getAlien(id).call()
  singleAlien(alien[0], id, alien['_generation'])
}

//Get aleins for cloning that are not selected
async function cloneAliens(gender) {
  var arrayId = await alienFactoryInstance.methods.getAllAliens(user).call();
  for (i = 0; i < arrayId.length; i++) {
    appendClone(arrayId[i], gender)
  }
}

//Appending aliens to clone selection
async function appendClone(id, gender) {
  var alien = await alienFactoryInstance.methods.getAlien(id).call()
  cloneAppend(alien[0], id, alien['_generation'], gender)
}

//Appending aliens to clone selection
async function clone(dadId, mumId) {
  try {
    await alienFactoryInstance.methods.cloneAlien(dadId, mumId).send()
  } catch (err) {
    log(err)
  }
}

async function checkOffer(id) {

  let res;
  try {

    res = await alienMarketInstance.methods.getOffer(id).call();
    var price = res['price'];
    var seller = res['seller'];
    var onsale = false
    //If price more than 0 means that cat is for sale
    if (price > 0) {
      onsale = true
    }
    //Also might check that belong to someone
    price = Web3.utils.fromWei(price, 'ether');
    var offer = { seller: seller, price: price, onsale: onsale }
    return offer

  } catch (err) {
    console.log(err);
    return
  }

}

// Checks that the user address is same as the alien owner address
//This is use for checking if user can sell this alien
async function alienOwnership(id) {

  var address = await alienFactoryInstance.methods.ownerOf(id).call()

  if (address.toLowerCase() == user.toLowerCase()) {      
    return true
  }  
  return false

}

async function totalAliens() {
  var aliens = await alienFactoryInstance.methods.totalSupply().call();
}