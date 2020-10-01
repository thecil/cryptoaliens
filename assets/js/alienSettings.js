
var colors = Object.values(allColors())

var defaultDNA = {
    "headcolor" : 10,
    "eyesColor" : 15,
    "armLegColors" : 20,
    //attributes
    "eyesShape" : 1,
    "decorationPattern" : 1,
    "decorationMidcolor" : 13,
    "decorationSidescolor" : 13,
    "animation" :  1,
    "lastNum" :  1
    }

// when page load
$( document ).ready(function() {
  $('#dnabody').html(defaultDNA.headcolor)
  $('#dnaeyes').html(defaultDNA.eyesColor)
  $('#dnaArmleg').html(defaultDNA.armLegColors)
  $('#dnashape').html(defaultDNA.eyesShape)

//$('#dnadecoration').html(defaultDNA.decorationPattern)
//$('#dnadecorationMid').html(defaultDNA.decorationMidcolor)
//$('#dnadecorationSides').html(defaultDNA.decorationSidescolor)
//$('#dnaanimation').html(defaultDNA.animation)
//$('#dnaspecial').html(defaultDNA.lastNum)

  renderAlien(defaultDNA)
});

function getDna(){
    var dna = ''
    dna += $('#dnabody').html()
    dna += $('#dnaeyes').html()
    dna += $('#dnaArmleg').html()
    dna += $('#dnashape').html()

    dna += $('#dnadecoration').html()
    dna += $('#dnadecorationMid').html()
    dna += $('#dnadecorationSides').html()
    dna += $('#dnaanimation').html()
    dna += $('#dnaspecial').html()

    return parseInt(dna)
}

function renderAlien(dna){
    headColor(colors[dna.headcolor],dna.headcolor)
    eyeColor(colors[dna.eyesColor],dna.eyesColor)
    armLegColor(colors[dna.armLegColors],dna.armLegColors)
    eyeVariation(defaultDNA.eyesShape)
    $('#bodycolor').val(dna.headcolor)
    $('#eyescolor').val(dna.eyesColor)
    $('#armLegColor').val(dna.armLegColors)
    $('#eyeShape').val(dna.eyesShape)
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
