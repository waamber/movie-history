'use strict';

const domString = (movieArray) => {
  let domString = '';
  for (let i = 0; i < movieArray.length; i++) {
    if (i % 3 === 0) {
      domString += `<div class="row">`;
    }
    domString += `<div class="col-sm-6 col-md-4">`;
    domString += `<div class='thumbnail'>`;
    domString += `<img src='https://media.giphy.com/media/aWRWTF27ilPzy/giphy.gif' alt=''>`;
    domString += `<div class='caption'>`;
    domString += `<h3>${movieArray[i].original_title}</h3>`;
    domString += `<p>${movieArray[i].overview}</p>`;
    domString += `<p><a href='#' class='btn btn-primary' role='button'>Review</a> <a href='#' class='btn btn-default' role='button'>Watchlist</a></p>`;
    domString += `</div>`;
    domString += `</div>`;
    domString += `</div>`;
    if (i % 3 === 2 || i === movieArray.length - 1) {
      domString += `</div>`;
    }
  }
  printToDom(domString);
};

const printToDom = (dom) => {
  $('#movies').append(dom);
};

module.exports = { domString, printToDom };