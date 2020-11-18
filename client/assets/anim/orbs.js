$( document ).ready(function() {
    orbs("#orbs1","market")
    orbs("#orbs2","monitor")
    orbs("#orbs3","aliens")
     });

function orbs(id, image){
  var _image
  switch (image) {
    case "market":
      _image = "assets/images/blockchain.png"
      break
    case "monitor":
      _image = "assets/images/monitor.png"
      break
    case "aliens":
      _image = "assets/images/ufo.png"
      break
  }

  var orbs = `
  <div class="spinner-box">
    <img src="${_image}" class="" style="width:40px; height:40px;">
    <div class="blue-orbit leo">
    </div>

    <div class="green-orbit leo">
    </div>

    <div class="red-orbit leo">
    </div>

    <div class="white-orbit w1 leo">

    </div>
    <div class="white-orbit w2 leo">
    </div>
    <div class="white-orbit w3 leo">
    </div>

  </div>
  `
  $(id).html(orbs)
}
/*

// GRADIENT SPINNER -->
<div class="spinner-box">
  <div class="circle-border">
    <div class="circle-core"></div>
  </div>
</div>

// SPINNER ORBITS -->
<div class="spinner-box">
  <div class="blue-orbit leo">
  </div>

  <div class="green-orbit leo">
  </div>

  <div class="red-orbit leo">
  </div>

  <div class="white-orbit w1 leo">
  </div><div class="white-orbit w2 leo">
  </div><div class="white-orbit w3 leo">
  </div>
</div>

// GRADIENT CIRCLE PLANES -->
<div class="spinner-box">
  <div class="leo-border-1">
    <div class="leo-core-1"></div>
  </div>
  <div class="leo-border-2">
    <div class="leo-core-2"></div>
  </div>
</div>

// SPINNING SQUARES -->
<div class="spinner-box">
  <div class="configure-border-1">
    <div class="configure-core"></div>
  </div>
  <div class="configure-border-2">
    <div class="configure-core"></div>
  </div>
</div>

// LOADING DOTS... -->
<div class="spinner-box">
  <div class="pulse-container">
    <div class="pulse-bubble pulse-bubble-1"></div>
    <div class="pulse-bubble pulse-bubble-2"></div>
    <div class="pulse-bubble pulse-bubble-3"></div>
  </div>
</div>

// SOLAR SYSTEM -->
<div class="spinner-box">
  <div class="solar-system">
    <div class="earth-orbit orbit">
      <div class="planet earth"></div>
      <div class="venus-orbit orbit">
        <div class="planet venus"></div>
        <div class="mercury-orbit orbit">
          <div class="planet mercury"></div>
          <div class="sun"></div>
        </div>
      </div>
    </div>
  </div>
</div>

// Three Quarter Spinner -->

<div class="spinner-box">
  <div class="three-quarter-spinner"></div>
</div>

*/
