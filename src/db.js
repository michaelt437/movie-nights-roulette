import firebase from 'firebase'

// Get a Firestore instance
export const db = firebase
  .initializeApp({
    projectId: "movie-night-1a687",
  })
  .firestore();

// Export types that exists in Firestore
// export { TimeStamp, GeoPoint }
