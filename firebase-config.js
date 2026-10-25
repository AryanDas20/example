/* UniTrade Firebase Web SDK bootstrap. Replace this config only with the Web app config from your own Firebase project. */
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
  try {
    if (!window.firebase || !Array.isArray(window.firebase.apps)) {
      throw new Error('Firebase SDK did not load. Check the Firebase script URLs and browser network access.');
    }
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    if (typeof firebase.auth !== 'function' || typeof firebase.firestore !== 'function') {
      throw new Error('Firebase Authentication or Firestore SDK did not load.');
    }
    window.unitradeAuth = firebase.auth();
    window.unitradeDb = firebase.firestore();
    window.unitradeGoogleProvider = new firebase.auth.GoogleAuthProvider();
    window.unitradeFirebaseError = '';
    window.unitradeFirebaseReady = true;
    console.info('[UniTrade] Firebase initialized for project:', firebaseConfig.projectId);
  } catch (error) {
    window.unitradeFirebaseReady = false;
    window.unitradeFirebaseError = error && error.message ? error.message : String(error);
    console.error('[UniTrade] Firebase initialization failed:', window.unitradeFirebaseError);
  }
})();
