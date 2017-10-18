(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
const tmdb = require('./tmdb');

const apiKeys = () => {
  return new Promise((resolve, reject) => {
    $.ajax('./db/apiKeys.json').done((data) => {
      resolve(data.apiKeys);
    }).fail((error) => {
      reject(error);
    });
  });
};

const retrieveKeys = () => {
  apiKeys().then((results) => {
    tmdb.setKey(results.tmdb.apiKey);
  }).catch((error) => {
    console.log('error in key retrieval', error);
  });
};

module.exports = { retrieveKeys };
},{"./tmdb":5}],2:[function(require,module,exports){
'use strict';

const domString = (movieArray, imgConfig) => {
  let domString = '';
  for (let i = 0; i < movieArray.length; i++) {
    if (i % 3 === 0) {
      domString += `<div class="row">`;
    }
    domString += `<div class="col-sm-6 col-md-4">`;
    domString += `<div class='thumbnail'>`;
    domString += `<img src='${imgConfig.base_url}/w342/${movieArray[i].poster_path}' alt=''>`;
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

const clearDom = () => {
  $('#movies').empty();
};

module.exports = { domString, clearDom };
},{}],3:[function(require,module,exports){
'use strict';
const tmdb = require('./tmdb');

const pressEnter = () => {
  $(document).keypress((e) => {
    if (e.key === 'Enter') {
      let searchText = $('#search-bar').val();
      let search = searchText.replace(/\s/g, '%20');
      tmdb.searchMovies(search);
    }
  });
};

module.exports = { pressEnter };
},{"./tmdb":5}],4:[function(require,module,exports){
'use strict';
const events = require('./events');
const apiKeys = require('./apiKeys');

apiKeys.retrieveKeys();

events.pressEnter();
},{"./apiKeys":1,"./events":3}],5:[function(require,module,exports){
'use strict';
const dom = require('./dom');
let tmdbKey;
let imgConfig;

//promise search movies
const searchTMDB = (search) => {
  return new Promise((resolve, reject) => {
    $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&language=en-US&page=1&include_adult=false
&query=${search}`).done((data) => {
        resolve(data.results);
      }).fail((error) => {
        reject(error);
      });
  });
};

//execute search TMDB
const searchMovies = (search) => {
  searchTMDB(search).then((data) => {
    showResults(data);
  }).catch((error) => {
    console.log('error in movie search', error);
  });
};

//sets  tmbdKey
const setKey = (apiKey) => {
  tmdbKey = apiKey;
  getConfig();
};

const showResults = (movieArray) => {
  dom.clearDom();
  dom.domString(movieArray, imgConfig);
};

//configuration route
const tmdbConfiguration = () => {
  return new Promise((resolve, reject) => {
    $.ajax(`https://api.themoviedb.org/3/configuration?api_key=${tmdbKey}`).done((data) => {
      resolve(data.images);
    }).fail((error) => {
      reject(error);
    });
  });
};

//executes tmdbConfiguration
const getConfig = () => {
  tmdbConfiguration().then((results) => {
    imgConfig = results;
  }).catch((error) => {
    console.log(error);
  });
};

module.exports = { setKey, searchMovies };

},{"./dom":2}]},{},[4]);
