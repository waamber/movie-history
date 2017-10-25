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