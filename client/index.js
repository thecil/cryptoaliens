
var web3 = new Web3(Web3.givenProvider)
var alienFactoryInstance, alienMarketInstance, user, contractOwner
var alienFactory_adderss = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
var alienMarketplace_address = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

$(document).ready(function(){
  window.ethereum.enable()
  .then(async function(accounts){
    alienFactoryInstance = new web3.eth.Contract(abiAlienFactory, alienFactory_adderss, {from: accounts[0]})
    alienMarketInstance = new web3.eth.Contract(abiAlienMarketplace, alienMarketplace_address, {from: accounts[0]})

    alienFactoryInstance.methods.owner().call().then(test => {
      contractOwner = test;
    });
    user = accounts[0];
    /*     
    EVENTS
    *   Listen for the `AlienMinted` event, and update the UI
    *   This event is generate in the alienFactory contract
    *   when the _createAlien internal method is called
    */

    await alienFactoryInstance.events.AlienMinted()
      .on('data', (event) => {
        console.log(event);
        let owner = event.returnValues.owner;
        let tokenId = event.returnValues.tokenId;
        let mumId = event.returnValues.mumId;
        let dadId = event.returnValues.dadId;
        let genes = event.returnValues.genes        
        alert_msg("owner:" + owner
          + " tokenId:" + tokenId
          + " mumId:" + mumId
          + " dadId:" + dadId
          + " genes:" + genes,'success')
      })
      .on('error', console.error);

  });
});

async function getAllEvents(){
  await alienFactoryInstance.getPastEvents('allEvents', {
    fromBlock: 0,
    toBlock: 'latest'
}, async function (error, events){
  console.log(events);
});
} 

$('#createAlien').click(function(){
  var _genes =  getDna()

  alienFactoryInstance.methods.createAlienGen0(_genes)
  .send({}, function(error, txHash){
    if(error){
      console.log(error)
    }else{console.log(txHash)}
  })

})

async function callApproved(){
  var res;
  let _isApproved = await alienFactoryInstance.methods.isApprovedForAll(user, alienMarketplace_address).call();
  // non-approved always have zero-address
  if(_isApproved == false){
    console.log(`Approved[FALSE]`);
    res = false;
    return res;
  }else{
    console.log(`Approved[TRUE]`);
    res = true;
    return res;
  }
  
}

//Get aliens of a current address
async function myAliens() {
  var arrayId = await alienFactoryInstance.methods.getAllAliens(user).call();
  for (i = 0; i < arrayId.length; i++) {
    await appendAliens(arrayId[i])
  }
}

//Appending aliens for catalog
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

//aliens for sale
async function contractCatalog() {
  var arrayId = await alienMarketInstance.methods.getAllTokenOnSale().call();
  // console.log(`contractCatalog: arrayId[${arrayId}]`)
  for (i = 0; i < arrayId.length; i++) {
    // if offer status is active, append to the market list
    let isActive = await alienMarketInstance.methods.getOffer(arrayId[i].tokenId).call();
    if(isActive.active == true){
      appendAliens(arrayId[i].tokenId)
    }
  }
}

async function deleteOffer(id) {
  try {
    await alienMarketInstance.methods.removeOffer(id).send();    
  } catch (err) {
    console.log(err);
  }

}

async function sellAlien(id) {  
  var price = $('#alienPrice').val()
  var amount = web3.utils.toWei(price, "ether")
  var _isApproved = await callApproved(id);
  if(_isApproved == false){
    try{
      console.log("should call approve")
      console.log("market address:", alienMarketInstance.address);
      await alienFactoryInstance.methods.setApprovalForAll(alienMarketplace_address, true).send();
    }catch(err){
      console.log(err);
    }
  }else{
    try {
      await alienMarketInstance.methods.setOffer(amount,id).send();
    } catch (err) {
      console.log(err);
    }
  }


}

async function buyAlien(id, price) {
  var amount = web3.utils.toWei(price, "ether")
  try {
    await alienMarketInstance.methods.buyAlien(id).send({ value: amount });
  } catch (err) {
    console.log(err);
  }
}

async function totalAliens() {
  var aliens = await alienFactoryInstance.methods.totalSupply().call();
}