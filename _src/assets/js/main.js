'use strict';

const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const ulElem = document.querySelector('.tvShows-list');
const favElem = document.querySelector('#favouritesList');
const inputValue = document.querySelector('.searchInput');
const searchButton = document.querySelector('.buttonSearch');

let tvShowsList = [];
const favourites = readLocalStorage();

//1.Función llamar a la Api

function conectToApi() {
  const inputName = inputValue.value;
  ulElem.innerHTML = '';

  fetch(`${urlBase}` + inputName)
    .then(response => response.json())
    .then(data => {
      tvShowsList = data;
      renderTvShows(tvShowsList);
      renderFavourites(favourites);
    });
}

//2.Función pintar la película (añadimos ID para comprobar luego que no la tenemos si ya la hemos añadido a favoritos)

function renderTvShows(tvShowsArr) {
  for (let item of tvShowsArr) {
    if (item.show.image !== null) {
      ulElem.innerHTML += `<li id='${item.show.id}' class='tvShow-list_item'><img src='${item.show.image.medium}' alt='Poster'</img><p class='show-title'>${item.show.name}</p></li>`;
    } else {
      ulElem.innerHTML += `<li id='${item.show.id}' class='tvShow-list_item'><img src='https://via.placeholder.com/210x295/ffffff/666666/?text=TV' alt='Poster'</img><p class='show-title'>${item.show.name}</p></li>`;
    }
    addClickListeners();
  }
}

//3.Función para añadir listener a los li para guardar en favoritos. La ejecutamos donde pinta las películas, es decir en el paso 2.

function addClickListeners() {
  const tvShowLiElements = document.querySelectorAll('.tvShow-list_item');

  for (let tvShowLi of tvShowLiElements) {
    tvShowLi.addEventListener('click', saveFavourites);
  }
}

//4.Función que setea el LocalStorage.

function setLocalStorage(favourites) {
  localStorage.setItem('tvShowInfo', JSON.stringify(favourites));
  // meter por cada indice su id y su valor, en local storage para que carguen con todas las busquedas
}

//5.Función que recoge el valor de LocalStorage, lee y parsea la info.

function readLocalStorage() {
  let localInfo = JSON.parse(localStorage.getItem('tvShowInfo'));
  if (localInfo !== null) {
    return localInfo;
  } else {
    return (localInfo = []);
  }
}

//6. Función que guarda favoritos al hacer click.

function saveFavourites(evt) {
  const index = parseInt(evt.currentTarget.id);

  if (favourites.indexOf(index) === -1) {
    favourites.push(index);
    setLocalStorage(favourites);
    renderFavourites(favourites);
  } else {
    alert('Ya has añadido esta serie a favoritos');
  }
}

//7.Función que relaciona el favorito con su ID ,lo lee y devuelve el objeto para pintar en favoritos.

function getTvShowObject(idTvShow) {
  for (let item of tvShowsList) {
    if (item.show.id === idTvShow) {
      return item;
    }
  }
}

//8.Función que nos pinta el contenido de favoritos.

function renderFavourites(favouritesArr) {
  favElem.innerHTML = '';
  for (let favourite of favouritesArr) {
    let tvShowObject = getTvShowObject(favourite);

    if (tvShowObject) {
      favElem.innerHTML += `<li id=${tvShowObject.show.id}><img src='${tvShowObject.show.image.medium}' alt='Poster'</img><p>${tvShowObject.show.name}</p><button type="button">Borrar</button></li>`;
    }
  }
}

searchButton.addEventListener('click', conectToApi);
