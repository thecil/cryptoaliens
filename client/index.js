
var web3 = new Web3(Web3.givenProvider)
var instance
var user
var contractAddress = '0x288096E0a237365846582382F586D6A44BF5217b'

$(document).ready(function(){
  window.ethereum.enable()
  .then(function(accounts){
    instance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]})
    user = accounts[0]
    console.log("contract instance created")

    instance.events.Birth().on('data', function(event){
      console.log(event)
      let _owner = event.returnValues.owner
      let _alienId = event.returnValues.alienId
      let _mumId = event.returnValues.mumId
      let _dadId = event.returnValues.dadId
      let _genes = event.returnValues.genes
      $("#alienCreation").css("display", "block")
      $("#alienCreation").text(`owner: ${_owner},
        alienId: ${_alienId},
        mumId: ${_mumId},
        dadId: ${_dadId},
        genes: ${_genes}`)
    })
    .on('error', console.error)
  })
  .catch( error => console.error)
})
