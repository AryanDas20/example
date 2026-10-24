/* UniTrade Firebase configuration for project: neotradeuni */
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDiuiUNFGqXxPpWHSFvL9PlmEVbe0yYeAw",
    authDomain: "neotradeuni.firebaseapp.com",
    projectId: "neotradeuni",
    storageBucket: "neotradeuni.firebasestorage.app",
    messagingSenderId: "366335596950",
    appId: "1:366335596950:web:4df842b47ee85b13eb65b7",
    measurementId: "G-S64RYCQ6LC"
  };

  if (!window.firebase || !firebase.apps) {
    console.error("UniTrade: Firebase SDK scripts did not load before firebase-config.js.");
    window.unitradeFirebaseReady = false;
    return;
  }

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  window.unitradeFirebaseReady = true;
  window.unitradeAuth = firebase.auth();
  window.unitradeDb = firebase.firestore();
  window.unitradeGoogleProvider = new firebase.auth.GoogleAuthProvider();
})();
