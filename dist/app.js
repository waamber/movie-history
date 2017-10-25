(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');

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
    firebaseApi.setKey(results.firebaseKeys);
    firebase.initializeApp(results.firebaseKeys);
  }).catch((error) => {
    console.log('error in key retrieval', error);
  });
};


module.exports = { retrieveKeys };
},{"./firebaseApi":4,"./tmdb":6}],2:[function(require,module,exports){
'use strict';
const domString = (movieArray, imgConfig, divName, search) => {
  let domString = '';
  for (let i = 0; i < movieArray.length; i++) {
    if (i % 3 === 0) {
      domString += `<div class="row">`;
    }
    domString += `<div class="col-sm-6 col-md-4 movie">`;
    domString += `<div class='thumbnail'>`;
    if (!search) {
      domString += `<button class='btn btn-danger delete' data-firebase-id='${movieArray[i].id}'>X</button>`;
    }
    domString += `<img class="poster_path" src='${imgConfig.base_url}/w342/${movieArray[i].poster_path}' alt=''>`;
    domString += `<div class='caption'>`;
    domString += `<h3 class="title">${movieArray[i].title}</h3>`;
    domString += `<p class="overview">${movieArray[i].overview}</p>`;
    if (search) {
      domString += `<p>`;
      domString += `<a href='#' class='btn btn-primary' role='button'>Review</a>`;
      domString += `<a class='btn btn-default wishlistBtn' role='button'>Wishlist</a>`;
      domString += `</p>`;
    } else {
      domString += `<p>Rating: ${movieArray[i].rating}<p>`;
    }
    domString += `</div>`;
    domString += `</div>`;
    domString += `</div>`;
    if (i % 3 === 2 || i === movieArray.length - 1) {
      domString += `</div>`;
    }
  }
  printToDom(domString, divName);
};

const printToDom = (dom, divName) => {
  $(`#${divName}`).append(dom);
};

const clearDom = (divName) => {
  $(`#${divName}`).empty();
};

module.exports = { domString, clearDom };
},{}],3:[function(require,module,exports){
'use strict';
const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');
const dom = require('./dom');

const pressEnter = () => {
  $(document).keypress((e) => {
    if (e.key === 'Enter') {
      let searchText = $('#search-bar').val();
      let search = searchText.replace(/\s/g, '%20');
      tmdb.searchMovies(search);
    }
  });
};

const getMyMovies = () => {
  firebaseApi.getMovieList().then((results) => {
    dom.clearDom('moviesMine');
    dom.domString(results, tmdb.getImgConfig(), 'moviesMine', false);
  }).catch((error) => {
    console.log('getMovies error', error);
  });
};

const myLinks = () => {
  $(document).click((e) => {
    if (e.target.id === 'searches') {
      $('#search').removeClass('hidden');
      $('#myMovies').addClass('hidden');
      $('#authScreen').addClass('hidden');
    } else if (e.target.id === 'movieNav') {
      $('#search').addClass('hidden');
      $('#myMovies').removeClass('hidden');
      $('#authScreen').addClass('hidden');
      getMyMovies();
    } else if (e.target.id === 'auth') {
      $('#search').addClass('hidden');
      $('#myMovies').addClass('hidden');
      $('#authScreen').removeClass('hidden');
    }
  });
};

const googleAuth = () => {
  $('#googleBtn').click(() => {
    firebaseApi.authenticateGoogle().then((result) => {
    }).catch((error) => {
      console.log('error in authentication', error);
    });
  });
};

const wishListEvents = () => {
  $('body').on('click', '.wishlistBtn', (e) => {
    let parent = e.target.closest('.movie');
    let newMovie = {
      'title': $(parent).find('.title').html(),
      'overview': $(parent).find('.overview').html(),
      'poster_path': $(parent).find('.poster_path').attr('src').split('/').pop(),
      'rating': 0,
      'isWatched': false,
      'uid': ''
    };
    firebaseApi.saveMovie(newMovie).then((results) => {
      $(parent).remove();
    }).catch((error) => {
      console.log('error in saveMovie', error);
    });
  });
};

const reviewEvents = () => {
  $('body').on('click', '.review', (e) => {
    let parent = e.target.closest('.movie');
    let newMovie = {
      'title': $(parent).find('.title').html(),
      'overview': $(parent).find('.overview').html(),
      'poster_path': $(parent).find('.poster_path').attr('src').split('/').pop(),
      'rating': 0,
      'isWatched': true,
      'uid': ''
    };
    firebaseApi.saveMovie(newMovie).then((results) => {
      $(parent).remove();
    }).catch((error) => {
      console.log('error in saveMovie', error);
    });
  });
};

const deleteMovie = () => {
  $('body').on('click', '.delete', (e) => {
    let movieId = $(e.target).data('firebase-id');
    firebaseApi.deleteMovie(movieId).then((results) => {
      getMyMovies();
    }).catch((error) => {
      console.log(error);
    });
  });
};

const init = () => {
  myLinks();
  googleAuth();
  pressEnter();
  wishListEvents();
  reviewEvents();
  deleteMovie();
};

module.exports = { init };
},{"./dom":2,"./firebaseApi":4,"./tmdb":6}],4:[function(require,module,exports){
'use strict';
let firebaseKey = "";
let userUid = "";

const setKey = (key) => {
  firebaseKey = key;
};

let authenticateGoogle = () => {
  return new Promise((resolve, reject) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((authData) => {
        userUid = authData.user.uid;
        resolve(authData.user);
      }).catch((error) => {
        reject(error);
      });
  });
};

const getMovieList = () => {
  let movies = [];
  return new Promise((resolve, reject) => {
    $.ajax(`${firebaseKey.databaseURL}/movies.json?orderBy="uid"&equalTo="${userUid}"`).then((fbMovies) => {
      if (fbMovies != null) {
        Object.keys(fbMovies).forEach((key) => {
          fbMovies[key].id = key;
          movies.push(fbMovies[key]);
        });
      }
      resolve(movies);
    }).catch((error) => {
      reject(error);
    });
  });
};

const saveMovie = (movie) => {
  movie.uid = userUid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `${firebaseKey.databaseURL}/movies.json`,
      data: JSON.stringify(movie)
    }).then((result) => {
      resolve(result);
    }).catch((error) => {
      console.log('saveMove promise error', error);
    });
  });
};

const deleteMovie = (movieId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: "DELETE",
      url: `${firebaseKey.databaseURL}/movies/${movieId}.json`
    }).then((fbMovie) => {
      resolve(fbMovie);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = { setKey, authenticateGoogle, getMovieList, saveMovie, deleteMovie };
},{}],5:[function(require,module,exports){
'use strict';
const events = require('./events');
const apiKeys = require('./apiKeys');

apiKeys.retrieveKeys();
events.init();

},{"./apiKeys":1,"./events":3}],6:[function(require,module,exports){
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

const showResults = (movieArray) => {
  dom.clearDom('movies');
  dom.domString(movieArray, imgConfig, 'movies', true);
};

const getImgConfig = () => {
  return imgConfig;
};

module.exports = { setKey, searchMovies, getImgConfig };

},{"./dom":2}]},{},[5]);
