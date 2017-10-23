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

module.exports = { pressEnter, myLinks };