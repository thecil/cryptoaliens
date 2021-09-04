
// when page load
$( document ).ready(function() {
    menu()
});


function menu(){

    var menu = `<nav class="menu navbar navbar-expand-md navbar-light fixed-top bg-ligh p-4" style="opacity:0.9;">
      <div class="container">
        <img src="assets/images/illuminati.png"  style="width:40px; height:40px;>
        <a class="navbar-brand " href="index.html"><b>CryptoAliens</b></a>

          <div class="navbar-collapse collapse  justify-content-end ml-4" id="navbarsExampleDefault">

              <div align="right">
                  <ul class="navbar-nav mr-auto ">
                    <img src="assets/images/vortex.png" class="align-self-baseline" style="width:30px; height:30px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="index.html"><b>Home</b></a>
                      </li>
                      <img src="assets/images/blockchain.png" class="align-self" style="width:30px; height:30px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="market.html"><b>Market</b></a>
                      </li>
                        <img src="assets/images/aliens.png" class="align-self" style="width:30px; height:30px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="myAliens.html"><b>My Aliens</b></a>
                      </li>
                      <img src="assets/images/dna.png" class="align-self" style="width:30px; height:30px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="factory.html"><b>Alien-Factory</b></a>
                      </li>
                      <img src="assets/images/ufo.png" class="align-self" style="width:30px; height:30px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="clone.html"><b>Clone-Aliens</b></a>
                      </li>

                      <li class="nav-item">
                          <button id="btcWeb3connect" onclick="claimToken()" class="btn red-btn m-4">Claim Token</button>
                      </li>

                  </ul>

              </div>

          </div>
      </div>
  </nav>`
  $('#menu').html(menu)

  }
