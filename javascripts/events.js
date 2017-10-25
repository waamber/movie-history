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
      firebaseApi.getMovieList().then((results) => {
        dom.clearDom('moviesMine');
        dom.domString(results, tmdb.getImgConfig(), 'moviesMine');
      }).catch((error) => {
        console.log('getMovies error', error);
      });
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

module.exports = { pressEnter, myLinks, googleAuth, wishListEvents };