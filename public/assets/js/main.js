'use strict';

const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const ulElem = document.querySelector('.tvShows-list');
const favElem = document.querySelector('.favourites');
const inputValue = document.querySelector('.searchInput');
const searchButton = document.querySelector('.buttonSearch');

let tvShowsList = [];
let favourites = [];

//1.Función llamar a la Api

function conectToApi() {
  const inputName = inputValue.value;
  ulElem.innerHTML = '';

  fetch(`${urlBase}` + inputName)
    .then(response => response.json())
    .then(data => {
      tvShowsList = data;
      renderTvShows(tvShowsList);
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







function saveFavourites() {
  
}
searchButton.addEventListener('click', conectToApi);

//# sourceMappingURL=main.js.map
