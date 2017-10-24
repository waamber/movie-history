'use strict';
const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseApi');

const pressEnter = () => {
  $(document).keypress((e) => {
    if (e.key === 'Enter') {
      let searchText = $('#search-bar').val();
      let search = searchText.replace(/\s/g, '%20');
      tmdb.searchMovies(search);
    }
  });
};

const googleAuth = () => {
  $('#googleBtn').click(() => {
    firebaseApi.authenticateGoogle().then((result) => {
      console.log('result', result);
    }).catch((error) => {
      console.log('error in authentication', error);
    });
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
    } else if (e.target.id === 'auth') {
      $('#search').addClass('hidden');
      $('#myMovies').addClass('hidden');
      $('#authScreen').removeClass('hidden');
    }
  });
};

module.exports = { pressEnter, myLinks, googleAuth };