'use strict';

const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const ulElem = document.querySelector('.tvShows-list');
const favElem = document.querySelector('#favouritesList');
const inputValue = document.querySelector('.searchInput');
const searchButton = document.querySelector('.buttonSearch');

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

//2.Función pintar la película (añadimos ID para comprobar luego que no la tenemos si ya la hemos añadido a favoritos)

function printTvShows(tvShowsArr) {
  for (let item of tvShowsArr) {
    if (item.show.image !== null) {
      ulElem.innerHTML += `<li id='${item.show.id}' class='tvShow-list_item'><img src='${item.show.image.medium}' alt='Poster'</img><p class='show-title'>${item.show.name}</p></li>`;
    } else {
      ulElem.innerHTML += `<li id='${item.show.id}' class='tvShow-list_item'><img src='https://via.placeholder.com/210x295/ffffff/666666/?text=TV' alt='Poster'</img><p class='show-title'>${item.show.name}</p></li>`;
    }
  }
  addClickListeners();
}

//3.Función para añadir listener a los li para guardar en favoritos. La ejecutamos donde pinta las películas, es decir en el paso 2.

function addClickListeners() {
  const tvShowLiElements = document.querySelectorAll('.tvShow-list_item');

  for (let tvShowLi of tvShowLiElements) {
    tvShowLi.addEventListener('click', saveFavourites);
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

//7 Función que guarda favoritos al hacer click.

function saveFavourites(evt) {
  const id = evt.currentTarget.id;

  const favoriteObject = getTvShowObject(id);

  if (localStorageFavourites.indexOf(favoriteObject) === -1) {
    localStorageFavourites.push(favoriteObject);
    setLocalStorage(localStorageFavourites);
    renderFavourites(localStorageFavourites);
  } else {
    alert('Ya has añadido esta serie a favoritos');
  }
}

//8.Función que nos pinta el contenido de favoritos.

function renderFavourites(favouritesArr) {
  favElem.innerHTML = '';
  for (let favouriteItem of favouritesArr) {
    if (favouriteItem.show.image !== null) {
      favElem.innerHTML += `<li id=${favouriteItem.show.id}><img src='${favouriteItem.show.image.medium}' alt='Poster'</img><p>${favouriteItem.show.name}</p><button type="button">Borrar</button></li>`;
    } else {
      favElem.innerHTML += `<li id=${favouriteItem.show.id}><img src='https://via.placeholder.com/210x295/ffffff/666666/?text=TV' alt='Poster'</img><p>${favouriteItem.show.name}</p><button type="button">Borrar</button></li>`;
    }
  }
}

searchButton.addEventListener('click', conectToApi);
window.addEventListener('load', renderFavourites(localStorageFavourites));