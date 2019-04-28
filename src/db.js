import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

// Get a Firestore instance
export const db = firebase
  .initializeApp({
    apiKey: "AIzaSyBlQr2MFE2Q1iCKAQNQytjGWkeLwfgaz7g",
    authDomain: "movie-night-1a687.firebaseapp.com",
    databaseURL: "https://movie-night-1a687.firebaseio.com",
    projectId: "movie-night-1a687",
    messagingSenderId: "483410741596"
  })
  .firestore();

export const auth = firebase.auth;
export const fb = firebase;
// Export types that exists in Firestore
// export { TimeStamp, GeoPoint }
