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
