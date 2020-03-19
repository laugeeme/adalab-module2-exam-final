'use strict';

const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const ulElem = document.querySelector('.tvShows-list');
const favElem = document.querySelector('.favourites');
const inputValue = document.querySelector('.searchInput');
const searchButton = document.querySelector('.buttonSearch');

let tvShowsList = null;

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
    ulElem.innerHTML += `<li id='${item.show.id}' class='tvShow-list_item'><img src='${item.show.image.medium}' alt='Poster'</img><p class='show-title'>${item.show.name}</p></li>`;
  }
}

searchButton.addEventListener('click', conectToApi);

//# sourceMappingURL=main.js.map
