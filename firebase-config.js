
/* UniTrade Firebase configuration */
(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyDyBPI4gCPo6S6kbTyfByUNoQY32IsSbpY",
    authDomain: "example-fb860.firebaseapp.com",
    projectId: "example-fb860",
    storageBucket: "example-fb860.firebasestorage.app",
    messagingSenderId: "978072365632",
    appId: "1:978072365632:web:fc620da535a2231ca8cda5",
    measurementId: "G-TJ38Y50W30"
  };

  if (!window.firebase || !firebase.apps) {
    console.error("Firebase SDK failed to load.");
    window.unitradeFirebaseReady = false;
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  window.unitradeFirebaseReady = true;
  window.unitradeAuth = firebase.auth();
  window.unitradeDb = firebase.firestore();
  window.unitradeGoogleProvider =
    new firebase.auth.GoogleAuthProvider();
})();
