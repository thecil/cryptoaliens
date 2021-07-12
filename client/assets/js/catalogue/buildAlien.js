// CSS properties to build each alien depending on the DNA
var colors = Object.values(allColors())

function headColor(code, id) {
    var color = colors[code]
    $('#head' + id + ', #alien_chest' + id).css('background', '#' + color)
}

function eyeColor(code, id) {
    var color = colors[code]
    $('#eyes' + id).find('span').css('background', '#' + color)
}

function armLegColor(code, id) {
    var color = colors[code]
    $('#alien__arm--left' + id + ', #alien__arm--right'+ id).css('background', '#' + color)
    $('#alien__leg--left' + id + ', #alien__leg--right'+ id).css('background', '#' + color)
}

// Variation functions for range-bars

//8 eye types
function eyeVariation(num, id) {

    switch (num) {
        case "1":
            normalEyes(id)
            $('#eyeName' + id).html('Basic')
            break
        case "2":
            normalEyes(id)
            $('#eyeName' + id).html('Chill')
            return eyesType1(id)
            break
        case "3":
            normalEyes(id)
            $('#eyeName' + id).html('Mad')
            return eyesType2(id)
            break
        case "4":
            normalEyes(id)
            $('#eyeName' + id).html('Human')
            return eyesType3(id)
            break
        case "5":
            normalEyes(id)
            $('#eyeName' + id).html('Reptile')
            return eyesType4(id)
            break
    }
}

function anim1Variation(num, id) {
    switch (num) {
        case "1":
            $('#animationName' + id).html('Basic')
            resetAnimation(id)
            break
        case "2":
            $('#animationName' + id).html('Move Head')
            animType1(id)
            break
        case "3":
            $('#animationName' + id).html('Pulse Head')
            animType2(id)
            break
        case "4":
            $('#animationName' + id).html('Body Aura')
            animType3(id)
            break
        case "5":
            $('#animationName' + id).html('Invisible')
            animType4(id)
            break
    }
}

// **   Eyes **  //
function normalEyes(id) {
    $('#eyes' + id).find('.alien__pupil--left').css('top', '14px')
    $('#eyes' + id).find('.alien__pupil--left').css('left', '33px')
    $('#eyes' + id).find('.alien__pupil--right').css('top', '25px')
    $('#eyes' + id).find('.alien__pupil--right').css('left', '20px')
    $('#eyes' + id).find('span').css('width', '5px')
    $('#eyes' + id).find('span').css('height', '20px')
    $('#eyes' + id).find('span').css('border-radius', '100% 100%')
    $('#eyes' + id).find('.alien__pupil--left').css('transform', 'rotate(90deg)')
    $('#eyes' + id).find('.alien__pupil--right').css('transform', 'rotate(0deg)')
}

function eyesType1(id) {
    $('#eyes' + id).find('.alien__pupil--left').css('top', '14px')
    $('#eyes' + id).find('.alien__pupil--left').css('left', '33px')
    $('#eyes' + id).find('.alien__pupil--right').css('top', '25px')
    $('#eyes' + id).find('.alien__pupil--right').css('left', '20px')
    $('#eyes' + id).find('span').css('width', '5px')
    $('#eyes' + id).find('span').css('height', '20px')
    $('#eyes' + id).find('span').css('border-radius', '100% 100%')
    $('#eyes' + id).find('.alien__pupil--left').css('transform', 'rotate(0deg)')
    $('#eyes' + id).find('.alien__pupil--right').css('transform', 'rotate(90deg)')
}
function eyesType2(id) {
    $('#eyes' + id).find('.alien__pupil--left').css('top', '14px')
    $('#eyes' + id).find('.alien__pupil--left').css('left', '33px')
    $('#eyes' + id).find('.alien__pupil--right').css('top', '25px')
    $('#eyes' + id).find('.alien__pupil--right').css('left', '20px')
    $('#eyes' + id).find('span').css('width', '5px')
    $('#eyes' + id).find('span').css('height', '20px')
    $('#eyes' + id).find('span').css('border-radius', '100% 100%')
    $('#eyes' + id).find('.alien__pupil--left').css('transform', 'rotate(45deg)')
    $('#eyes' + id).find('.alien__pupil--right').css('transform', 'rotate(45deg)')
  }
function eyesType3(id) {
    $('#eyes' + id).find('.alien__pupil--left').css('top', '19px')
    $('#eyes' + id).find('.alien__pupil--left').css('left', '25px')
    $('#eyes' + id).find('.alien__pupil--right').css('top', '25px')
    $('#eyes' + id).find('.alien__pupil--right').css('left', '20px')
    $('#eyes' + id).find('span').css('width', '20px')
    $('#eyes' + id).find('span').css('height', '20px')
    $('#eyes' + id).find('span').css('border-radius', '50% 50%')
  }
function eyesType4(id) {
    $('#eyes' + id).find('.alien__pupil--left').css('top', '27px')
    $('#eyes' + id).find('.alien__pupil--left').css('left', '10px')
    $('#eyes' + id).find('.alien__pupil--right').css('top', '34px')
    $('#eyes' + id).find('.alien__pupil--right').css('left', '3px')
    $('#eyes' + id).find('span').css('width', '50px')
    $('#eyes' + id).find('span').css('height', '3px')
    $('#eyes' + id).find('span').css('border-radius', '100% 100%')
    $('#eyes' + id).find('.alien__pupil--left').css('transform', 'rotate(0deg)')
    $('#eyes' + id).find('.alien__pupil--right').css('transform', 'rotate(90deg)')
  }

// **   Decoration **  //
async function logoCrypto(code, id) {
    code = code - 10
    const _logos = await getGeckoData()
    $('#imgLogo' + id).attr('src', _logos[code]._logoUrl);
    $('#decorationName' + id).html(`${_logos[code]._name}`)
}

/** Animations **/
async function resetAnimation(id) {
    document.getElementById("head" + id).classList.remove("movingHead", "pulseAnim", "inviAnim")
    document.getElementById("alien_chest" + id).classList.remove("shadowAnim")
    document.getElementById("body" + id).classList.remove("inviAnim")
}

function animType1(id) {    
    $('#head' + id).addClass('movingHead')
}

function animType2(id) {    
    $('#head' + id).addClass('pulseAnim')
}

function animType3(id) {    
    $('#alien_chest' + id).addClass('shadowAnim')
}

function animType4(id) {    
    $('#head' + id).addClass('inviAnim')
    $('#body' + id).addClass('inviAnim')
}


