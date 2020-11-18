
// when page load
$( document ).ready(function() {
    menu()
     });


function menu(){

    var menu = `<nav class="menu navbar navbar-expand-md navbar-light fixed-top bg-ligh p-4">
      <div class="container">
        <img src="assets/images/illuminati.png" class="align-self-start mr-3" style="width:40px; height:40px;>
          <a class="navbar-brand" href="index.html"><b>CryptoAliens</b></a>
          <button class="navbar-toggler collapsed" type="button" data-toggle="collapse"
              data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false"
              aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
          </button>

          <div class="navbar-collapse collapse  justify-content-end" id="navbarsExampleDefault">

              <div align="right">
                  <ul class="navbar-nav mr-auto ">
                    <img src="assets/images/vortex.png" style="width:40px; height:40px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="index.html"><b>Home</b></a>
                      </li>
                      <img src="assets/images/blockchain.png" style="width:40px; height:40px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="market.html"><b>Market</b></a>
                      </li>
                        <img src="assets/images/aliens.png" style="width:40px; height:40px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="myAliens.html"><b>My Aliens</b></a>
                      </li>
                      <img src="assets/images/dna.png" style="width:40px; height:40px;"/>
                      <li class="nav-item">
                          <a class="nav-link" href="factory.html"><b>Alien-Factory</b></a>
                      </li>

                      <li class="nav-item">
                          <button class="btn red-btn ml-4">Start</button>
                      </li>

                  </ul>

              </div>

          </div>
      </div>
  </nav>`
  $('#menu').html(menu)

  }
