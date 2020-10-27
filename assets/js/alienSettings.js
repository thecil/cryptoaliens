
var colors = Object.values(allColors())

var defaultDNA = {
    "headcolor" : 10,
    "eyesColor" : 15,
    "armLegColors" : 20,
    //attributes
    "eyesShape" : 1,
    "animation1" :  1,
    "animation2" :  10,
    "lastNum" :  1
    }

// when page load
$( document ).ready(function() {
  $('#dnabody').html(defaultDNA.headcolor)
  $('#dnaeyes').html(defaultDNA.eyesColor)
  $('#dnaArmleg').html(defaultDNA.armLegColors)
  $('#dnashape').html(defaultDNA.eyesShape)
  $('#dnadanimation1').html(defaultDNA.animation1)
  $('#dnadanimation2').html(defaultDNA.animation2)

//$('#dnadecoration').html(defaultDNA.decorationPattern)
//$('#dnadecorationMid').html(defaultDNA.decorationMidcolor)
//$('#dnadecorationSides').html(defaultDNA.decorationSidescolor)

//$('#dnaspecial').html(defaultDNA.lastNum)

  renderAlien(defaultDNA)
});

function getDna(){
    var dna = ''
    dna += $('#dnabody').html()
    dna += $('#dnaeyes').html()
    dna += $('#dnaArmleg').html()
    dna += $('#dnashape').html()

    dna += $('#dnaanimation1').html()
    dna += $('#dnaanimation2').html()
    dna += $('#dnaspecial').html()

    return parseInt(dna)
}

function renderAlien(dna){
    headColor(colors[dna.headcolor],dna.headcolor)
    $('#bodycolor').val(dna.headcolor)
    eyeColor(colors[dna.eyesColor],dna.eyesColor)
    $('#eyescolor').val(dna.eyesColor)
    armLegColor(colors[dna.armLegColors],dna.armLegColors)
    $('#armLegColor').val(dna.armLegColors)
    eyeVariation(dna.eyesShape)
    $('#eyeShape').val(dna.eyesShape)
    anim1Variation(dna.animation1)
    $('#1anim').val(dna.animation1)
    logoCrypto(dna.animation2)
    $('#cryptoLogo').val(dna.animation2)
}

// Changing Alien colors
$('#bodycolor').change(()=>{
    let colorVal = $('#bodycolor').val()
    headColor(colors[colorVal],colorVal)
})
$('#eyescolor').change(()=>{
    let colorVal = $('#eyescolor').val()
    eyeColor(colors[colorVal],colorVal)
})
$('#armLegColor').change(()=>{
    let colorVal = $('#armLegColor').val()
    armLegColor(colors[colorVal],colorVal)
})
$('#eyeShape').change(()=>{
    let shape = parseInt($('#eyeShape').val())
    eyeVariation(shape)
})
$('#1anim').change(()=>{
    let anim1 = parseInt($('#1anim').val())
    anim1Variation(anim1)
})
$('#cryptoLogo').change(()=>{
    let logo = parseInt($('#cryptoLogo').val())
    logoCrypto(logo)
})

$('#resetAlien').click(function(){
  renderAlien(defaultDNA)
})

$('#randomAlien').click(function(){
  var randomDNA = {
    "headcolor": Math.floor(Math.random() * 88) + 10 ,
    "eyesColor": Math.floor(Math.random() * 88) + 10 ,
    "armLegColors": Math.floor(Math.random() * 88) + 10 ,
    //attributes
    "eyesShape": Math.floor(Math.random() * 5) + 1 ,
    "animation1" :  Math.floor(Math.random() * 5) + 1,
    "animation2" :  Math.floor(Math.random() * 89) + 10,
    "lastNum" : Math.floor(Math.random() * 5) + 1
  }
  renderAlien(randomDNA)
})
