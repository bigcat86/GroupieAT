const apiKey = 'BuTjcTSMjIfxFGWSJNPo'
const apiSecret = 'RHsXCGkbukoTWkHeCzBHZPspCYGEPPXG'
let bandName;
const queryDiscogs = 'https://api.discogs.com/database/search?artist=' + bandName + '&type=release&key=' + apiKey + '&secret=' + apiSecret;
const search = document.querySelector('#search');
const input = document.querySelector('.input');
const discography = document.querySelector('#discography');
const title = document.querySelector('.title');
let bandArr = [];


// button click for search artists -- clears content and initiates API fetch's
search.addEventListener('click', () => {
    bandName = input.value.toUpperCase();
    bandArr.push(bandName);
    getAll();
})

function getAll() {
    clearFields();
    getStar();
    getBandTitle();
    getLast();
    getTicket();
    getImagesAndDisc();
    window.scrollTo(0, 1000)
}

// function for clearing fields between new searches
function clearFields() {
    title.innerHTML = '';
    discography.innerHTML = ''
    bioDiv.innerHTML = '';
    tour.innerHTML = '';
    photo.innerHTML = '';
}

// press "enter" to search
input.addEventListener('keydown', function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        search.click();
    }
})

// create title element for body searched
function getBandTitle() {
    const titleEl = document.createElement('h1');
    titleEl.textContent = bandName;
    titleEl.setAttribute('style', 'font-weight: 700;')
    title.appendChild(titleEl);
}

// function to call the lastFM API to get bio
const lastKey = 'f54a71e4cffac64ddae0c640e1c20b04'
const lastSecret = '1a1cfb229ad5b54371350b86f7a4c32a'
const bioDiv = document.querySelector('#bio');

function getLast() {
    fetch('https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + bandName + '&api_key=' + lastKey + '&format=json')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            const bio = data.artist.bio.content;
            const bioEl = document.createElement('p');
            bioEl.textContent = bio;
            bioDiv.appendChild(bioEl);
        })
}

// variables and function to ticketmaster -- for events
const ticketKey = 'UcycjsGfTYWd0RhGEctxiUWtpRjqQXm8'
const ticketSecret = 'HWE3OUWKExknLpdY'
const photo = document.querySelector('#photo');
const tour = document.querySelector('#tour');

let tourDate = [];
let tourVenue = [];
let tourCity = [];
let tourState = [];
let tourEl = [];
let favEvent = [];
let favEventEl = [];
let favEventElClose = [];

function getTicket() {
    fetch('https://app.ticketmaster.com/discovery/v2/events.json?keyword=' + bandName + '&countryCode=US&sort=date,asc&apikey=' + ticketKey)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            for (let i = 0; i < 10; i++) {
                tourDate[i] = data._embedded.events[i].dates.start.localDate;
                tourVenue[i] = data._embedded.events[i]._embedded.venues[0].name;
                tourCity[i] = data._embedded.events[i]._embedded.venues[0].city.name;
                tourState[i] = data._embedded.events[i]._embedded.venues[0].state.stateCode;
                tourEl[i] = document.createElement('button');
                tourEl[i].classList.add('button');
                tourEl[i].classList.add('is-success');
                tourEl[i].setAttribute('id', 'tour-date');
                tourEl[i].textContent = tourCity[i] + ', ' + tourState[i] + " | " + tourVenue[i] + " | " + tourDate[i];
                tour.appendChild(tourEl[i]);
                tourEl[i].addEventListener('click', () => {
                    if (!favEventEl[i]) {
                        localStorage.setItem(`favorite-event-${bandName + i}`, bandName + ' | ' + tourEl[i].textContent);
                        favEvent[i] = localStorage.getItem(`favorite-event-${bandName + i}`)
                        favEventEl[i] = document.createElement('a');
                        favEventElClose[i] = document.createElement('span');                                     
                        favEventElClose[i].innerHTML = 'X';
                        favEventElClose[i].setAttribute('id', 'fav-event-close');
                        favEventEl[i].innerHTML = favEvent[i];
                        favEventEl[i].className = 'dropdown-item';
                        dropDivide.append(favEventEl[i], favEventElClose[i]);
                        favEventElClose[i].addEventListener('click', (event) => {
                            if (event.target = favEventElClose[i]) {
                                localStorage.removeItem(`favorite-event-${bandName + i}`)
                                favEventEl[i].remove();
                                favEventElClose[i].remove();
                                return;
                            }
                        })    
                    }else {
                        localStorage.removeItem(`favorite-event-${bandName + i}`)
                        favEventEl[i].remove();
                        favEventElClose[i].remove();
                        return;
                    }              
                }) 
            }
        })
}

// load up favorite events on init
function getFavoriteEvents() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substring(0, 14) === 'favorite-event'){
            favEvent[i] = localStorage.getItem(localStorage.key(i));
            favEventEl[i] = document.createElement('a');
            favEventElClose[i] = document.createElement('span');                                     
            favEventElClose[i].innerHTML = 'X';
            favEventElClose[i].setAttribute('id', 'fav-event-close');
            favEventEl[i].innerHTML = favEvent[i];
            favEventEl[i].className = 'dropdown-item';
            dropDivide.append(favEventEl[i], favEventElClose[i]);
            favEventElClose[i].addEventListener('click', (event) => {
                if (event.target = favEventElClose[i]) {
                    localStorage.removeItem(localStorage.key(i))
                    favEventEl[i].remove();
                    favEventElClose[i].remove();
                }
            })    
        }
    }
}

// function(s) to call spotify for images and discography
const spotifyId = "6787d1488ea5406fbed009d6123954fb";
const spotifySecret = "513f556ec09b4c3c8330732d84a763d4";
let spotifyToken;

async function getSpotifyToken() {
    let authParameters = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${spotifyId}&client_secret=${spotifySecret}`
      };

      spotifyToken = await fetch('https://accounts.spotify.com/api/token', authParameters)
        .then(result => result.json())
        .then(data => {
            return data.access_token
        });
        console.log(spotifyToken);
};

let discImage = [];
let discImageEl = [];
let discTitle = [];
let discTitleEl = [];

async function getImagesAndDisc(){

    let artistParameters = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + spotifyToken
        }
    }

    let artistId =  await fetch(`https://api.spotify.com/v1/search?q=${bandName}&type=artist`, artistParameters)
        .then(response => response.json())
        .then(data => {
            let bandImg = data.artists.items[0].images[0].url;
            let bandImgEl = document.createElement('img');
            bandImgEl.setAttribute('src', bandImg);
            photo.appendChild(bandImgEl);
            bandImgEl.classList.add('is-rounded');
            return data.artists.items[0].id;
        })

    fetch(`https://api.spotify.com/v1/artists/${artistId}/albums`, artistParameters)
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.items.length; i++) {
              discImage[i] = data.items[i].images[0].url;
              discTitle[i] = data.items[i].name;
              discImageEl[i] = document.createElement('img');
              discTitleEl[i] = document.createElement('a');
              discImageEl[i].setAttribute('src', discImage[i]);
              discTitleEl[i].textContent = discTitle[i];
              
              // Add Bulma classes to the created elements
              discImageEl[i].classList.add('column', 'is-one-quarter', 'image', 'is-rounded');
              discTitleEl[i].classList.add('column', 'is-three-quarters', 'has-text-weight-bold');
              
              const divEl = document.createElement('div');
              divEl.classList.add('columns', 'is-mobile', 'is-vcentered', 'fixed-width');
              divEl.style.height = "auto";
              divEl.appendChild(discImageEl[i]);
              divEl.appendChild(discTitleEl[i]);
              discography.appendChild(divEl);
            }
        })
}

// variables and open/close functions for discography modal
const discModal = document.querySelector('#disc-modal');
const discBtn = document.querySelector('#disc-modal-btn');
const discCloseBtn = document.querySelector('#disc-close');

discBtn.addEventListener('click', () => {
    discModal.classList.add('is-active');
    console.log('clicked');
})
discCloseBtn.addEventListener('click', () => {
    discModal.classList.remove('is-active');
})



// functionality for favorites star
const star = document.querySelector("#star");
const dropdown = document.querySelector('#dropdown');
const favDrop = document.querySelector('#fav-drop');
const favDropBtn = document.querySelector('#fav-button');
const dropDivide = document.querySelector('#drop-divider');
let favBand = [];
let favBandEl = [];


favDropBtn.addEventListener('click', () => {
    if (dropdown.classList.contains('is-active')) {
        dropdown.classList.remove('is-active');
    } else {
        dropdown.classList.add('is-active');
    }
})

star.addEventListener('click', function () {
    if (star.classList.contains('fa-regular')) {
        star.classList.remove('fa-regular');
        star.classList.add('fa-solid');
        localStorage.setItem(`favorite-band-${bandName}`, bandName);
        makeFavItem();
        clickFav();
    } else {
        star.classList.remove('fa-solid')
        star.classList.add('fa-regular')
        for (let i = 0; i < localStorage.length; i++) {
            if (bandName === favBand[i]) {
                localStorage.removeItem(localStorage.key(i));
                favBandEl[i].remove();
            }
        }
    }
})

function makeFavItem() {
    for (let i = 0; i < localStorage.length; i++) {
       if (localStorage.getItem(localStorage.key(i)) === bandName) {
        favBand[i] = localStorage.getItem(localStorage.key(i));
        favBandEl[i] = document.createElement('a');
        favBandEl[i].textContent = favBand[i];
        favBandEl[i].className = 'dropdown-item has-text-centered';
        favDrop.appendChild(favBandEl[i]);
       } else {
       }   
    }
}

function clickFav() {
    for (let i = 0; i < favBandEl.length; i++) {
        favBandEl[i].addEventListener('click', () => {
            bandName = favBand[i]
            getAll();
        })
    }    
}


function getStar() {
    for (let i = 0; i < favBand.length; i++) {
        if (bandName === favBand[i]) {
            star.className = 'fa-solid fa-star fa-2xl'
            return;
        }else {
            star.className = 'fa-regular fa-star fa-2xl'
        }
    }
}

function getFavoriteBands() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substring(0, 13) === 'favorite-band'){
            console.log(favBand[i]);
            favBand[i] = localStorage.getItem(localStorage.key(i));
            favBandEl[i] = document.createElement('a');
            favBandEl[i].textContent = favBand[i];
            favBandEl[i].className = 'dropdown-item has-text-centered';
            favDrop.appendChild(favBandEl[i]);
        } else {
        }
    }
    clickFav();
}

var modal = document.getElementById("contact-modal");
var btn = document.getElementById("contact-btn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
 modal.style.display = "block";
}

span.onclick = function() {
 modal.style.display = "none";
}

window.onclick = function(event) {
 if (event.target == modal) {
   modal.style.display = "none";
 }
}

const aboutModal = document.querySelector('#about-info');
const aboutBtn = document.querySelector('#about-btn');
const aboutClose = document.querySelector('#about-close');

aboutBtn.addEventListener ('click', () => {
    aboutModal.classList.add('is-active');
});

aboutClose.addEventListener ('click', () => {
    aboutModal.classList.remove('is-active');
});

function clearAbout(event) {
    if (event.target == aboutModal) {
        aboutModal.classList.remove('is-active');
    }
}

// clearAbout();
getSpotifyToken();
getFavoriteBands();
getFavoriteEvents();
