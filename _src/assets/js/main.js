'use strict';

const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const ulElem = document.querySelector('.tvShows-list');
const favElem = document.querySelector('#favouritesList');
const inputValue = document.querySelector('.searchInput');
const searchButton = document.querySelector('.buttonSearch');
const deleteButton = document.querySelector('.delete-all_button');

let tvShowsList = [];
const localStorageFavourites = readLocalStorage();

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

//2.Function to print results from search (add ID to compare if we don't have in favourites).

function printTvShows(tvShowsArr) {
  for (let item of tvShowsArr) {
    const liElem = document.createElement('li');
    const imgElem = document.createElement('img');
    const pElem = document.createElement('p');
    liElem.appendChild(imgElem);
    liElem.appendChild(pElem);
    liElem.setAttribute('id', item.show.id);
    liElem.setAttribute('class', 'tvShow-list_item');
    imgElem.setAttribute('alt', 'Poster');
    pElem.setAttribute('class', 'show-title');
    let pContent = document.createTextNode(item.show.name);
    pElem.appendChild(pContent);
    ulElem.appendChild(liElem);

    if (item.show.image !== null) {
      imgElem.setAttribute('src', item.show.image.medium);
    } else {
      imgElem.setAttribute(
        'src',
        'https://via.placeholder.com/210x295/575352/ffffff/?text=TV'
      );
    }

    if (isFavourited(item.show.id)) {
      liElem.setAttribute('class', 'tvShow-list_item tvShowSelected');   //add class to show favoritedstyle in every search if favorited
    }
  }
  addClickListeners();
}

function isFavourited(id) {
  for (let localFavourite of localStorageFavourites) {
    if (id === localFavourite.show.id) {
      return true;
    }
  }
  return false;
}

//3.Function to add listener to LI to save in favorites. Is ejecuted when the tvshows are printed.

function addClickListeners() {
  const tvShowLiElements = document.querySelectorAll('.tvShow-list_item');

  for (let tvShowLi of tvShowLiElements) {
    tvShowLi.addEventListener('click', saveAndDeleteFavourites);
  }
}

//4.Function to set the LocalStorage.

function setLocalStorage(favouritesArray) {
  localStorage.setItem('tvShowInfo', JSON.stringify(favouritesArray));
}

//5.Function to take the LocalStorage value, read and parse the info.

function readLocalStorage() {
  let localInfo = JSON.parse(localStorage.getItem('tvShowInfo'));
  if (localInfo !== null) {
    return localInfo;
  }
  return [];
}

//6.Function that relates the favorite with is ID, read and brings back the objetc to use it.

function getTvShowObject(id) {
  return tvShowsList.find(tvShow => tvShow.show.id === parseInt(id));
}

//7.Function that saves and delete favourites as an object when click.

function saveAndDeleteFavourites(evt) {
  const id = evt.currentTarget.id;
  const favoriteObject = getTvShowObject(id);
  let favouriteIndex = localStorageFavourites.indexOf(favoriteObject);

  if (favouriteIndex === -1) {
    localStorageFavourites.push(favoriteObject);
    tvShowSelectedStyle(id);
  } else {
    deleteFavouriteById(id);
  }

  setLocalStorage(localStorageFavourites);
  renderFavourites(localStorageFavourites);
}

//8.Function who gives or not style at the tvShow favorited.

function tvShowSelectedStyle(id) {
  const liSelected = document.getElementById(id);
  liSelected.classList.toggle('tvShowSelected');
}

//9.Function for print favourites in aside content.

function renderFavourites(favouritesArr) {
  favElem.innerHTML = '';
  for (let favouriteItem of favouritesArr) {
    if (favouriteItem.show.image !== null) {
      favElem.innerHTML += `<li class='fav-list_item' id='${favouriteItem.show.id}'><img src='${favouriteItem.show.image.medium}' alt='Poster'></img><p>${favouriteItem.show.name}<span class='close'> &times;</span></p></li>`;
    } else {
      favElem.innerHTML += `<li class='fav-list_item' id='${favouriteItem.show.id}'><img src='https://via.placeholder.com/210x295/575352/ffffff/?text=TV' alt='Poster'></img><p>${favouriteItem.show.name}<span class='close'> &times;</span></p></li>`;
    }
    addRemoveFavouriteListeners();
  }
}
//10.Add button CLOSE to delete favourites from aside content.
function addRemoveFavouriteListeners() {
  const closeButtons = document.getElementsByClassName('close');
  for (let closeButton of closeButtons) {
    closeButton.addEventListener('click', deleteFavouriteAside);
  }
}

//11.Functions to delete favourite from aside. We call to parentElement from CLOSE and we declare the object to looking for the ID and their INDEX.
function deleteFavouriteAside(evt) {
  const favouriteId = evt.currentTarget.parentElement.parentElement.id;
  deleteFavouriteById(favouriteId);
}

function deleteFavouriteById(id) {
  const favouriteObject = getTvShowObject(id);
  const favouriteIndex = localStorageFavourites.indexOf(favouriteObject);
  localStorageFavourites.splice(favouriteIndex, 1);

  tvShowSelectedStyle(id);
  setLocalStorage(localStorageFavourites);
  renderFavourites(localStorageFavourites);
}

//12.Function to delete all favourites at the same time.

function deleteAllFavourites() {
  const allStyledFavourites = document.querySelectorAll('.tvShowSelected');

  for (let styleFavourite of allStyledFavourites) {
    tvShowSelectedStyle(styleFavourite.id);
  }

  favElem.innerHTML = '';
  setLocalStorage([]);
  readLocalStorage();
}

searchButton.addEventListener('click', conectToApi);
window.addEventListener('keyup', conectToApiIfEnter);
window.addEventListener('load', renderFavourites(localStorageFavourites));
deleteButton.addEventListener('click', deleteAllFavourites);
