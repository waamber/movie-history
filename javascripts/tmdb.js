'use strict';
const dom = require('./dom');
let tmdbKey;

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
};

const showResults = (movieArray) => {
  dom.clearDom();
  dom.domString(movieArray);
};

module.exports = { setKey, searchMovies };
