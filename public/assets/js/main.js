'use strict';

const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const ulElem = document.querySelector('.tvShows-list');
const favElem = document.querySelector('#favouritesList');
const inputValue = document.querySelector('.searchInput');
const searchButton = document.querySelector('.buttonSearch');
const deleteButton = document.querySelector('.delete-all_button');

let tvShowsList = [];
let localStorageFavourites = readLocalStorage();

//1.Function to conect to Api.
function conectToApi() {
  const inputName = inputValue.value;
  ulElem.innerHTML = '';

  fetch(`${urlBase}` + inputName)
    .then(response => response.json())
    .then(data => {
      tvShowsList = data;
      printTvShows(tvShowsList);
    });
}

function conectToApiIfEnter(evt) {
  if (evt.keyCode === 13) {
    conectToApi();
  }
}

//2.Function to print results from search (add item.show.id to compare if we don't have in favourites).
function printTvShows(tvShowsArr) {
  for (let item of tvShowsArr) {
    const liElem = document.createElement('li');
    liElem.setAttribute('id', item.show.id);
    liElem.setAttribute('class', 'tvShow-list_item');

    const imgElem = document.createElement('img');
    imgElem.setAttribute('alt', 'Poster');

    const pElem = document.createElement('p');
    pElem.setAttribute('class', 'show-title');
    let pContent = document.createTextNode(item.show.name);

    pElem.appendChild(pContent);
    liElem.appendChild(imgElem);
    liElem.appendChild(pElem);
    ulElem.appendChild(liElem);

    if (item.show.image !== null) {
      imgElem.setAttribute('src', item.show.image.medium);
    } else {
      imgElem.setAttribute(
        'src',
        'https://via.placeholder.com/210x295/575352/ffffff/?text=TV'
      );
    }

    if (obtainIndexOfLocalStorageFavouritesById(item.show.id) !== -1) {
      liElem.setAttribute('class', 'tvShow-list_item tvShowSelected'); //add class to show favoritedstyle in every search if favorited
    }
  }
  addClickListeners();
}

//3.Function to obtain the index from localStorageFavourites by his ID
function obtainIndexOfLocalStorageFavouritesById(id) {
  for (let i = 0; i < localStorageFavourites.length; i++) {
    if (parseInt(id) === localStorageFavourites[i].show.id) {
      return i;
    }
  }
  return -1;
}

//4.Function to add listener to LI to save in favorites. Is ejecuted when the tvshows are printed.
function addClickListeners() {
  const tvShowLiElements = document.querySelectorAll('.tvShow-list_item');

  for (let tvShowLi of tvShowLiElements) {
    tvShowLi.addEventListener('click', saveAndDeleteFavourites);
  }
}

//5.Function to set the LocalStorage.
function setLocalStorage(favouritesArray) {
  localStorage.setItem('tvShowInfo', JSON.stringify(favouritesArray));
}

//6.Function to take the LocalStorage value, read and parse the info.
function readLocalStorage() {
  let localInfo = JSON.parse(localStorage.getItem('tvShowInfo'));
  if (localInfo !== null) {
    return localInfo;
  }
  return [];
}

//7.Function that relates the favorite with is ID, read and brings back the objetc to use it.
function getTvShowObject(id) {
  return tvShowsList.find(tvShow => tvShow.show.id === parseInt(id));
}

//8.Function that saves and delete favourites as an object when click.
function saveAndDeleteFavourites(evt) {
  const id = evt.currentTarget.id;
  const favoriteObject = getTvShowObject(id);
  let favouriteIndex = obtainIndexOfLocalStorageFavouritesById(id);

  if (favouriteIndex === -1) {
    localStorageFavourites.push(favoriteObject);
    tvShowSelectedStyle(id);
  } else {
    deleteFavouriteById(id);
  }

  setLocalStorage(localStorageFavourites);
  renderFavourites(localStorageFavourites);
}

//9.Function who gives or not style at the tvShow favorited.
function tvShowSelectedStyle(id) {
  const liSelected = document.getElementById(id);
  liSelected.classList.toggle('tvShowSelected');
}

//10.Function for print favourites in aside content.
function renderFavourites(favouritesArr) {
  favElem.innerHTML = '';
  for (let favouriteItem of favouritesArr) {
    const liElem = document.createElement('li');
    liElem.setAttribute('id', favouriteItem.show.id);
    liElem.setAttribute('class', 'fav-list_item');

    const imgElem = document.createElement('img');
    imgElem.setAttribute('alt', 'Poster');

    const pElem = document.createElement('p');
    let pContent = document.createTextNode(favouriteItem.show.name);
    pElem.appendChild(pContent);

    const spanElem = document.createElement('span');
    spanElem.setAttribute('class', 'close');
    spanElem.innerHTML = ' &times;';

    pElem.appendChild(spanElem);
    liElem.appendChild(imgElem);
    liElem.appendChild(pElem);
    favElem.appendChild(liElem);

    if (favouriteItem.show.image !== null) {
      imgElem.setAttribute('src', favouriteItem.show.image.medium);
    } else {
      imgElem.setAttribute(
        'src',
        'https://via.placeholder.com/210x295/575352/ffffff/?text=TV'
      );
    }
    addRemoveFavouriteListeners();
  }
}
//11.Add button CLOSE to delete favourites from aside content.
function addRemoveFavouriteListeners() {
  const closeButtons = document.getElementsByClassName('close');
  for (let closeButton of closeButtons) {
    closeButton.addEventListener('click', deleteFavouriteAside);
  }
}

//12.Functions to delete favourite from aside. We call to parentElement from CLOSE and we declare the object to looking for the ID and their INDEX.
function deleteFavouriteAside(evt) {
  const favouriteId = evt.currentTarget.parentElement.parentElement.id;
  deleteFavouriteById(favouriteId);
}

function deleteFavouriteById(id) {
  const favouriteIndex = obtainIndexOfLocalStorageFavouritesById(id);
  localStorageFavourites.splice(favouriteIndex, 1);

  tvShowSelectedStyle(id);
  setLocalStorage(localStorageFavourites);
  renderFavourites(localStorageFavourites);
}

//13.Function to delete all favourites at the same time.
function deleteAllFavourites() {
  for (let localStorageFavourite of localStorageFavourites) {
    tvShowSelectedStyle(localStorageFavourite.show.id);
  }

  favElem.innerHTML = '';
  setLocalStorage([]);
  localStorageFavourites = readLocalStorage();
}

searchButton.addEventListener('click', conectToApi);
document.addEventListener('keydown', conectToApiIfEnter);
window.addEventListener('load', renderFavourites(localStorageFavourites));
deleteButton.addEventListener('click', deleteAllFavourites);

//# sourceMappingURL=main.js.map
