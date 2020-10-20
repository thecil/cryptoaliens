
//Random color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}

function genColors(){
    var colors = []
    for(var i = 10; i < 99; i ++){
      var color = getColor()
      colors[i] = color
    }
    return colors
}

//This function code needs to modified so that it works with Your cat code.
function headColor(color,code) {
    $('.alien__head, .alien__chest').css('background', '#' + color)  //This changes the color of the alien
    $('#headcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the alien
}
function eyeColor(color,code) {
    $('.alien__eye span').css('background', '#' + color)  //This changes the color of the alien
    $('#eyescode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnaeyes').html(code) //This updates the body color part of the DNA that is displayed below the alien
}
function armLegColor(color,code) {
    $('.alien__leg--left, .alien__leg--right, .alien__arm--left, .alien__arm--right').css('background', '#' + color)  //This changes the color of the alien
    $('#armLegcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnaArmleg').html(code) //This updates the body color part of the DNA that is displayed below the alien
}
function eyeShapes(type,code) {
    $('.alien__eye span').css('border', 'none')  //This changes the color of the alien
    $('#shapecode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnashape').html(code) //This updates the body color part of the DNA that is displayed below the alien
}
async function logoCrypto() {
  let _coins = await getGeckoData()
    $('#imgLogo').attr("src", `${_coins._logoUrl}`)  //This changes the color of the alien
    $('#cryptoLogocode').html(_coins._name) //This updates text of the badge next to the slider
    $('#dnaanimation2').html(_coins.indexOf(_coins._name)) //This updates the body color part of the DNA that is displayed below the alien
}
//###################################################
//Functions below will be used later on in the project
//###################################################
function eyeVariation(num) {

    $('#dnashape').html(num)
    switch (num) {
        case 1:
            normalEyes()
            $('#shapecode').html('Basic')
            break
        case 2:
            normalEyes()
            $('#shapecode').html('Chill')
            eyesType1()
            break
        case 3:
            normalEyes()
            $('#shapecode').html('Mad')
            eyesType2()
            break
        case 4:
            normalEyes()
            $('#shapecode').html('Human')
            eyesType3()
            break
        case 5:
            normalEyes()
            $('#shapecode').html('Reptile')
            eyesType4()
            break
    }
}



function anim1Variation(num) {
    $('#dnadanimation1').html(num)
    switch (num) {
        case 1:
            $('#1animcode').html('Basic')
            resetAnim()
            break
        case 2:
            $('#1animcode').html('Move Head')
            animType1()
            break
        case 3:
            $('#1animcode').html('Pulse Head')
            animType2()
            break
        case 4:
            $('#1animcode').html('Body Aura')
            animType3()
            break
        case 5:
            $('#1animcode').html('Invisible')
            animType4()
            break
    }
}

//Animations Type
function resetAnim(){
  $("#head").removeClass("movingHead")
  $("#head").removeClass("pulseAnim")
  $("#alien_chest").removeClass("shadowAnim")
  $("#head").removeClass("inviAnim")
  $("#body").removeClass("inviAnim")
}
function animType1(){
  resetAnim()
  $("#head").addClass("movingHead")
}
function animType2(){
  resetAnim()
  $("#head").addClass("pulseAnim")
}
function animType3(){
  resetAnim()
  $("#alien_chest").addClass("shadowAnim")
}
function animType4(){
  resetAnim()
  $("#head").addClass("inviAnim")
  $("#body").addClass("inviAnim")
}

//Eyes Type
async function normalEyes() {
    await $('.alien__eye').find('.alien__pupil--left').css('top', '14px')
    await $('.alien__eye').find('.alien__pupil--left').css('left', '33px')
    await $('.alien__eye').find('.alien__pupil--right').css('top', '25px')
    await $('.alien__eye').find('.alien__pupil--right').css('left', '20px')
    await $('.alien__eye').find('span').css('width', '5px')
    await $('.alien__eye').find('span').css('height', '20px')
    await $('.alien__eye').find('span').css('border-radius', '100% 100%')
    await $('.alien__eye').find('.alien__pupil--left').css('transform', 'rotate(90deg)')
    await $('.alien__eye').find('.alien__pupil--right').css('transform', 'rotate(0deg)')
}
async function eyesType1() {
  await $('.alien__eye').find('.alien__pupil--left').css('top', '14px')
  await $('.alien__eye').find('.alien__pupil--left').css('left', '33px')
  await $('.alien__eye').find('.alien__pupil--right').css('top', '25px')
  await $('.alien__eye').find('.alien__pupil--right').css('left', '20px')
  await $('.alien__eye').find('span').css('width', '5px')
  await $('.alien__eye').find('span').css('height', '20px')
  await $('.alien__eye').find('span').css('border-radius', '100% 100%')
  await $('.alien__eye').find('.alien__pupil--left').css('transform', 'rotate(0deg)')
  await $('.alien__eye').find('.alien__pupil--right').css('transform', 'rotate(90deg)')
}
async function eyesType2() {
  await $('.alien__eye').find('.alien__pupil--left').css('top', '14px')
  await $('.alien__eye').find('.alien__pupil--left').css('left', '33px')
  await $('.alien__eye').find('.alien__pupil--right').css('top', '25px')
  await $('.alien__eye').find('.alien__pupil--right').css('left', '20px')
  await $('.alien__eye').find('span').css('width', '5px')
  await $('.alien__eye').find('span').css('height', '20px')
  await $('.alien__eye').find('span').css('border-radius', '100% 100%')
  await $('.alien__eye').find('.alien__pupil--left').css('transform', 'rotate(45deg)')
  await $('.alien__eye').find('.alien__pupil--right').css('transform', 'rotate(45deg)')
}
async function eyesType3() {
  await $('.alien__eye').find('.alien__pupil--left').css('top', '19px')
  await $('.alien__eye').find('.alien__pupil--left').css('left', '25px')
  await $('.alien__eye').find('.alien__pupil--right').css('top', '25px')
  await $('.alien__eye').find('.alien__pupil--right').css('left', '20px')
  await $('.alien__eye').find('span').css('width', '20px')
  await $('.alien__eye').find('span').css('height', '20px')
  await $('.alien__eye').find('span').css('border-radius', '50% 50%')
}
async function eyesType4() {
  await $('.alien__eye').find('.alien__pupil--left').css('top', '27px')
  await $('.alien__eye').find('.alien__pupil--left').css('left', '10px')
  await $('.alien__eye').find('.alien__pupil--right').css('top', '34px')
  await $('.alien__eye').find('.alien__pupil--right').css('left', '3px')
  await $('.alien__eye').find('span').css('width', '50px')
  await $('.alien__eye').find('span').css('height', '3px')
  await $('.alien__eye').find('span').css('border-radius', '100% 100%')
  await $('.alien__eye').find('.alien__pupil--left').css('transform', 'rotate(0deg)')
  await $('.alien__eye').find('.alien__pupil--right').css('transform', 'rotate(90deg)')
}

async function normaldecoration() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('.alien__head-dots').css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('.alien__head-dots_first').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('.alien__head-dots_second').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}
