# :movie_camera: BUSCADOR DE SERIES   :movie_camera:


>### Module 2 - final evaluation - laugeeme :rocket:

El ejercicio consiste en desarrollar una aplicación web de búsqueda de series de TV, que nos permite des/marcar las series como favoritas y guardarlas en local storage.

<div align="center">
       <img src="./_src/assets/images/web.png" width="600px"</img>
</div>


>## Herramientas  :wrench:

Para el desarrollo de este ejercicio hemos utilizado la siguiente [API](http://www.tvmaze.com/api#show-search)

Los lenguajes de programación utilizados son:
   - `HTML`
   - `CSS`
   - `JavaScript`


 >## Estructura del proyecto  :house:

Nuestro **gulpfile.js** usa un JSON de configuración con las rutas de los archivos a generar/vigilar.

La estructura de carpetas tiene esta pinta:

```
/
`- _src
   |- api
   |  |- data.json // para crearnos un servidor de datos local
   |- assets
   |  |- icons
   |  |- images
   |  |- js
   |  |  `-main
   |  |- scss
   |  |   `|- components
   |  |    |       `- _aside
   |  |    |       `- _header
   |  |    |       `- _main
   |  |     - core
   |  |    |       `- _reset
   |  |    |       `- _settings
   |  |    |- main
   |  |
   |  |- templates
   |  |   `|- partials
   |  |    |      `- _aside
   |  |    |       `- _header
   |  |    |       `- _main
   |  |    |
   |  |    |-index


```

>## Usage :clipboard:
1. Clona o descarga el repositorio en tu local.
2. Instala [Node.js](https://nodejs.org/es/) con npm install sino lo tienes ya.
3. Arranca el kit con [Gulp](https://gulpjs.com/).
4. ¡A trabajar!




:end:
