// File for fetching all the aliens from smart contrat 
// into the catalogue

//Append each Alien card as a catalog
function appendAlien(dna, id, gen) {
    //1 return DNA alien into readable string 
    var AlienDna = alienDna(dna)
    //2 build the alienBox into HTML
    alienBox(id)
    //3 Render the aliens CSS style depending on DNA string
    renderAlien(AlienDna, id)
    $('#alienview' + id).attr('onclick', 'go_to("alienDetails.html?alienId=' + id + '")')
    $('#alienDNA' + id).html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>`+ gen + `</h4></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna + `</h4></span>`)
}

//Append alien for breeding
function cloneAppend(dna, id, gen, gender) {
    //1 return DNA alien into readable string 
    var AlienDna = alienDna(dna)
    //2 build the alienBox into HTML    
    alienBox(id)
    //3 Render the aliens CSS style depending on DNA string
    renderAlien(AlienDna, id)
    $('#alienDNA' + id).html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>`+ gen + `</h4></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna + `</h4></span>`)

    $('#alienview' + id).attr('onclick', 'selectClone("' + dna + '","' + id + '","' + gen + '","' + gender + '")')
}

function selectClone(dna, id, gen, gender) {

    var AlienDna = alienDna(dna)
    //2 build the singleAlien into HTML
    var body = alienBody(gender)
    var AlienAttributes = alienAtributes(gender)
    $('#alienAtributes' + gender).html(AlienAttributes)
    $('#' + gender).html(body)
    //3 Render the cats CSS style depending on DNA string
    renderAlien(AlienDna, gender)
    $('#' + gender).addClass('cloneSelect')
    $('#' + gender).attr('data-alienid', id)
    $('#' + gender).attr('onclick', 'cloneAlien("' + gender + '")')
    $('#alienDNA' + gender).html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>`+ gen + `</h4><input class="hidden" id="` + gender + `Id" type="number" value=` + id + `></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna + `</h4></span>`)
    $('#alienSelection').modal('hide')
    removeSelection(id, gender)
    readyToClone()
}

function readyToClone() {

    var mumId = $('#MumId').val()
    var dadId = $('#DadId').val()

    if (!empty(mumId) && !empty(dadId)) {
        $('#clone').css('filter', 'none')
        $('#clone').prop('disabled', false)
        $('#clone').attr('onclick', 'clone("' + dadId + '","' + mumId + '")')
        return true
    }
    $('#clone').prop('disabled', true)
    $('#clone').css('filter', ' grayscale()')
    return false
}

//If user select a selected alien from any gender, its remove it from the selection box
function removeSelection(id, gender) {

    var selectionDiv = `<div align="center">
                                <div class="egg">
                                </div>
                                <h4>Select a alien as `+ gender + `</h4>
                            </div>
                        </div>`

    if (gender == 'Mom') {
        var alienData = $('#Dad').attr('data-alienid')
        if (alienData == id) {
            $('#Dad').attr('data-alienid', 0)
            $('#Dad').attr('onclick', 'breedKitties(this.id)')
            $('#Dad').html(selectionDiv)
            $('#Dad').removeClass('breedSelect')
            $('#alienDNADad').html('')
        }
    }
    if (gender == 'Dad') {
        var alienData = $('#Mom').attr('data-alienid')
        if (alienData == id) {
            $('#Mom').attr('data-alienid', 0)
            $('#Mom').attr('onclick', 'cloneAliens(this.id)')
            $('#Mom').html(selectionDiv)
            $('#Mom').removeClass('cloneSelect')
            $('#alienDNAMom').html('')
        }
    }
}

async function singleAlien(dna, id, gen) {

    var AlienDna = alienDna(dna)
    //2 build the singleAlien into HTML
    var body = alienBody(id)
    var AlienAtributes = alienAtributes(id)
    $('#alienAtributes').html(AlienAtributes)
    $('#singleAlien').html(body)
    //3 Render the alien CSS style depending on DNA string
    renderAlien(AlienDna, id)
    $('#alienDNA').html(`
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>GEN:</b>`+ gen + `</h4></span>
    <br>
    <span class="badge badge-light"><h4 class="tsp-2 m-0"><b>DNA:</b>`+ dna + `</h4></span>`)
    
    await alienOffer(id)
}

// Checks the Alien on market situation
async function alienOffer(id) {

    //Checking if this alien is for Sale
    var offer = await checkOffer(id)
    var seller = offer.seller.toLocaleLowerCase()
    if (offer.onsale == true && seller != user) {
        $('#buyBox').removeClass('hidden')
        $('#priceBtn').html('<b>' + offer.price + ' ETH</b>')
        $('#buyBtn').attr('onclick', 'buyAlien(' + id + ',"' + offer.price + '")')
    }
    
    var ownership = await alienOwnership(id)
    //If user owns the alien
    if (ownership == true) {        
        //If is not on sale
        if (offer.onsale == false) {
            $('#sellBox').removeClass('hidden')
            $('#sellBtn').attr('onclick', 'sellAlien(' + id + ')')
        } else {
            $('#sellBox').removeClass('hidden')
            $('#cancelBox').removeClass('hidden')
            $('#cancelBtn').attr('onclick', 'deleteOffer(' + id + ')')
            $('#sellBtn').addClass('btn-success')
            $('#sellBtn').html('<b>For sale at:</b>')
            $('#catPrice').val(offer.price)
            $('#catPrice').prop('readonly', true)
        }
    }
}


//Apply cat CSS Styles from buidAlien.js

async function renderAlien(dna, id) {
    headColor(dna.headcolor, id)
    eyeColor(dna.eyesColor, id)
    armLegColor(dna.armLegColors, id)
    eyeVariation(dna.eyesShape, id)
    anim1Variation(dna.animation1, id)
    await logoCrypto(dna.animation2, id)
}

//Splitting the cat DNA to use it in render

function alienDna(dnaStr) {

    var dna = {
        //Colors
        "headcolor": dnaStr.substring(0, 2),
        "eyesColor": dnaStr.substring(2, 4),
        "armLegColors": dnaStr.substring(4, 6),
        //alien Attributes
        "eyesShape": dnaStr.substring(6, 7),
        "animation1": dnaStr.substring(7, 8),
        // logos
        "animation2": dnaStr.substring(8, 10)
    }

    return dna
}

//Alien HTML Div for catalogue
function alienBox(id) {

    var alienDiv = `<div class="col-lg-4 pointer fit-content" id="alienview` + id + `">
                 <div class="featureBox alienDiv">
                 `+ alienBody(id) + `      
                    <div class="dnaDiv" id="alienDNA`+ id + `"></div>
                    `+ alienAtributes(id) + `
                    </div>                     
                 </div>`
    var alienView = $('#alienview' + id)
    if (!alienView.length) {
        $('#aliensDiv').append(alienDiv)
    }
}


//Simple body of a alien
function alienBody(id) {

    var single = `
                    <div id="head`+ id + `" class="alien__head">
                        <div id="imgHeadDiv`+ id + `">
                            <img id="imgLogo`+ id + `" class="logoSize" alt="cryptoLogos">
                        </div>
                        <div id="eyes`+ id + `" class="alien__eye">
                            <div class="alien__eye--left">
                                <span class="alien__pupil--left "></span>
                            </div>
                            <div class="alien__eye--right">
                                <span class="alien__pupil--right "></span>
                            </div>
                        </div>
                        <div class="alien__mouth"></div>
                    </div>
                    <div id="body`+ id + `" class="alien__body">
                        <div id="alien_chest`+ id + `" class="alien__chest ">
                            <div id="armsDiv`+ id + `" class="armsDiv">
                                <div id="alien__arm--left`+ id + `" class="alien__arm--left">
                                <span class="alien__finger1--left"></span>
                                <span class="alien__finger2--left"></span>
                                </div>
                                <div id="alien__arm--right`+ id + `" class="alien__arm--right">
                                <span class="alien__finger1--right"></span>
                                <span class="alien__finger2--right"></span>
                                </div>
                            </div>
                            <div id="alien__leg`+ id + `" class="alien__leg">
                                <div class="alien__legSpace"></div>
                                <div id="alien__leg--left`+ id + `" class="alien__leg--left"></div>
                                <div id="alien__leg--right`+ id + `" class="alien__leg--right"></div>
                            </div>
                        </div>
                    </div>
                `
    return single
}

function alienAtributes(id) {

    var AlienAtributes = `<ul class="ml-5 alienAtributes">
                            <li><span id="eyeName`+ id + `"></span> eyes</li>
                            <li><span id="decorationName`+ id + `"></span> hodler</li>
                            <li><span id="animationName`+ id + `"></span></li>
                        </ul>`
    return AlienAtributes
}