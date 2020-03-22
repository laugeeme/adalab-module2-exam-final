'use strict';

const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const ulElem = document.querySelector('.tvShows-list');
const favElem = document.querySelector('#favouritesList');
const inputValue = document.querySelector('.searchInput');
const searchButton = document.querySelector('.buttonSearch');
const deleteButton = document.querySelector('.delete-all_button');

let tvShowsList = [];
const localStorageFavourites = readLocalStorage();

//1.Función llamar a la Api

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
  event.preventDefault();
  if (evt.keyCode === 13) {
    conectToApi();
  }
}

//2.Función pintar los resultados de la búsqueda (añadimos ID para comprobar luego que no la tenemos si ya la hemos añadido a favoritos)

function printTvShows(tvShowsArr) {
  for (let item of tvShowsArr) {
    if (item.show.image !== null) {
      ulElem.innerHTML += `<li id='${item.show.id}' class='tvShow-list_item'></div><img src='${item.show.image.medium}' alt='Poster'</img><p class='show-title'>${item.show.name}</p></li>`;
    } else {
      ulElem.innerHTML += `<li id='${item.show.id}' class='tvShow-list_item'></div><img src='https://via.placeholder.com/210x295/575352/ffffff/?text=TV' alt='Poster'</img><p class='show-title'>${item.show.name}</p></li>`;
    }
  }
  addClickListeners();
}

//3.Función para añadir listener a los li para guardar en favoritos. La ejecutamos donde pinta las películas, es decir en el paso 2.

function addClickListeners() {
  const tvShowLiElements = document.querySelectorAll('.tvShow-list_item');

  for (let tvShowLi of tvShowLiElements) {
    tvShowLi.addEventListener('click', saveAndDeleteFavourites);
  }
}

//4.Función que setea el LocalStorage.

function setLocalStorage(favouritesArray) {
  localStorage.setItem('tvShowInfo', JSON.stringify(favouritesArray));
  // meter por cada indice su id y su valor, en local storage para que carguen con todas las busquedas
}

//5.Función que recoge el valor de LocalStorage, lee y parsea la info.

function readLocalStorage() {
  let localInfo = JSON.parse(localStorage.getItem('tvShowInfo'));
  if (localInfo !== null) {
    return localInfo;
  }
  return [];
}

//6. Me quedo con el objeto para poder usarlo. Función que relaciona el favorito con su ID ,lo lee y devuelve el objeto para usarlo.

function getTvShowObject(id) {
  return tvShowsList.find(tvShow => tvShow.show.id === parseInt(id));
}

//7 Función que guarda y borra favoritos al hacer click como un objeto.

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

//7.b Función que nos da estilo o no al tvShow seleccionado

function tvShowSelectedStyle(id) {
  const liSelected = document.getElementById(id);
  liSelected.classList.toggle('tvShowSelected');
}

//8.Función que nos pinta el contenido de favoritos.

function renderFavourites(favouritesArr) {
  favElem.innerHTML = '';
  for (let favouriteItem of favouritesArr) {
    if (favouriteItem.show.image !== null) {
      favElem.innerHTML += `<li class='fav-list_item' id='${favouriteItem.show.id}'><img src='${favouriteItem.show.image.medium}' alt='Poster'</img><p>${favouriteItem.show.name}<span class='close'> &times;</span></p></li>`;
    } else {
      favElem.innerHTML += `<li class='fav-list_item' id='${favouriteItem.show.id}'><img src='https://via.placeholder.com/210x295/575352/ffffff/?text=TV' alt='Poster'</img><p>${favouriteItem.show.name}<span class='close'> &times;</span></p></li>`;
    }
    addRemoveFavouriteListeners();
  }
}
//9.Añadimos botón close para poder eliminar nuestros favoritos del aside.
function addRemoveFavouriteListeners() {
  const closeButtons = document.getElementsByClassName('close');
  for (let closeButton of closeButtons) {
    closeButton.addEventListener('click', deleteFavouriteAside);
  }
}

//10.Delete favorito /Llamamos al elemento padre del close y volvemos a declarar el objeto para localizar su id y por ende su index.
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

//11.Delete all favourites.

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
searchButton.addEventListener('keyup', conectToApiIfEnter);

window.addEventListener('load', renderFavourites(localStorageFavourites));
deleteButton.addEventListener('click', deleteAllFavourites);

//# sourceMappingURL=main.js.map
