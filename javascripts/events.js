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