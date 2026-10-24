
NOTICE FOR THIS UPDATED PACKAGE: The old launch guide below is historical. This version removes phone/SMS OTP and uses email/password or Google sign-in plus email verification. Follow README-UPDATED.txt and the included current firestore.rules; do not enable Phone Auth just for this website.

SUPERSEDED GUIDE NOTICE — READ README-UPDATED.txt FIRST
======================================================
This older launch guide predates the Firebase-connected code in this ZIP. It contains historical statements that may say Firebase is not connected and references the earlier project/deployment. For the actual current files, Firebase project config, email verification, campus rules, chat and notification behavior, follow README-UPDATED.txt and inspect firebase-config.js. Do not copy old snippets or old rules over the files in this package.

UNITRADE: CLEAN RELEASE + FIREBASE / GOOGLE SIGN-IN PUBLIC LAUNCH GUIDE
=======================================================================
Website: https://unitradeneo.vercel.app/

IMPORTANT: THE CLEAN WEBSITE IS NOT CONNECTED TO FIREBASE YET.
-----------------------------------------------------------------------
This package removes the built-in starter catalogue and adds a migration
which deletes known old seeded records from this browser while preserving
records which do not look like the old seeds. The website still uses
localStorage today. The clean package is a frontend cleanup, not a completed
Firebase integration. That means data exists only in the browser that created
it. It is NOT a shared live marketplace until the JavaScript is connected to
Firebase Authentication and Cloud Firestore.

Do not announce real public transactions or collect sensitive data until the
Firebase code integration, database rules, reporting, and safety workflow have
been tested. Setting up a Firebase project in the console is not enough by
itself; the website code must actually use Firebase for sign-in and every
shared create/read/update/delete operation.

PART 1 — PUT THE CLEAN WEBSITE ON YOUR LIVE VERCEL ADDRESS
=========================================================
1. Download the UniTrade clean ZIP and extract it.
2. Keep index.html, style.css and script.js together in the same folder.
   Keep UniTrade-Complete-Website-Guide.pdf in that folder too, because the
   Product Guide buttons link to that file.
3. Make a backup of the current GitHub repository before replacing anything.
4. Open Vercel Dashboard and choose the project serving:
   https://unitradeneo.vercel.app/
5. Open the linked Git repository. Replace the existing website files with the
   clean files from this package. Preserve any unrelated project files.
6. Commit the change and push it to the production branch connected to Vercel.
   Vercel should create a new deployment automatically.
7. Open the Vercel deployment and wait for its status to say Ready.
8. Visit https://unitradeneo.vercel.app/ in a fresh/private browser window.
   The marketplace, requests, Vault, Lost & Found, favorites and Karma should
   start empty. Old sample records in an existing browser are removed by the
   clean-up migration when the new version runs. If the old page still appears,
   check Vercel Deployments, confirm the latest deployment says Ready, then
   hard-refresh the site or test in a private window.

If Vercel is not connected to GitHub, choose Add New > Project in Vercel,
import your GitHub repository, and deploy the folder containing index.html.
For plain HTML/CSS/JS, use the Other framework preset and do not set a build
command unless your repository already needs one.

PART 2 — CREATE A FIREBASE PROJECT
==================================
1. Visit https://console.firebase.google.com/ and sign in with your Google
   account.
2. Click Add project (or Create a project).
3. Give it a clear internal name, such as UniTrade Production.
4. Complete the on-screen steps. Google Analytics is optional for the first
   setup; it can be enabled later if you have a privacy notice and need it.
5. In the project overview, click the Web icon (</>) to register a web app.
6. Name it UniTrade Web and register it.
7. Firebase displays a web configuration object with fields such as apiKey,
   authDomain, projectId, storageBucket, messagingSenderId and appId. Copy it
   somewhere safe for the integration step. This web configuration is designed
   for the browser; it is not a service-account private key. Never put a
   Firebase Admin SDK service-account JSON/key in HTML, CSS, JavaScript, or
   Vercel public environment variables.

Official guide: https://firebase.google.com/docs/web/setup

PART 3 — ENABLE GOOGLE SIGN-IN
==============================
1. In Firebase Console, open Build > Authentication.
2. Click Get started if asked.
3. Open the Sign-in method / Sign-in providers tab.
4. Choose Google, enable it, choose a project support email, and Save.
5. Open Authentication Settings and find Authorized domains.
6. Add this exact hostname:
   unitradeneo.vercel.app
   Do NOT enter https:// and do NOT add a trailing slash.
7. If you will test on your own computer using a local server, also add
   localhost if it is not already listed.
8. Save and return to the website.

Official guide: https://firebase.google.com/docs/auth/web/google-signin

Important: Google sign-in will not become active merely by enabling this
provider. The website JavaScript still must initialize Firebase Auth and call
its sign-in and sign-out functions. The localStorage account flow in the clean
website is not the same as Firebase Authentication. Existing local browser
accounts do not automatically become Google/Firebase accounts.

BEFORE CONNECTING FIREBASE — IMPORTANT DISTINCTION
=================================================
Google sign-in tells Firebase which Google account signed in. It does not, by
itself, prove that the person is a student at a particular college. If UniTrade
will be restricted to a college, also define the institution's accepted email
domain or student-verification process. Enforce that policy in trusted backend
logic; a front-end-only check can be bypassed. Do not display a "verified
student" badge until verification actually succeeds.

The current clean website package is NOT yet connected to Firebase. Replacing
the website files removes the sample catalogue and starts the cleaned site,
but real Google authentication and shared cloud data will work only after the
website's script.js has been integrated with Firebase Auth and Firestore.
Simply creating a Firebase project in the console is not enough.

PART 4 — CREATE CLOUD FIRESTORE
===============================
1. In Firebase Console, open Build > Firestore Database.
2. Click Create database.
3. Start in production mode, not an open/test rule mode.
4. Pick a location appropriate for the expected users. For a campus audience
   in India, compare the available India/nearby regions and choose carefully.
   A Firestore database's location is difficult to change later.
5. Create the database.
6. Open the Rules tab and review the supplied firestore.rules file in this
   package. Paste/adapt it and click Publish only after understanding its
   restrictions. It is a starting policy, not a substitute for testing in the
   Firebase Rules Simulator or Emulator.

Never use this rule in production:
  allow read, write: if true;
It lets unauthorised people read or overwrite data. Also, being signed in is
not enough to grant permission to edit another user's item. Use owner checks.

Official rule guide:
https://firebase.google.com/docs/firestore/security/rules-structure

PART 5 — THE DATABASE SHAPE TO USE
==================================
Use these collections (a collection is like a folder of records):

users/{uid}
  name, email, photoURL, college, course, year, hostel, createdAt
  Keep the full profile private to its owner. Do not store passwords here.

listings/{listingId}
  ownerUid, title, description, category, mode, price, originalPrice,
  condition, hostelLabel, sellerDisplayName, status, imagePaths, createdAt
  Public fields only. Never include personal phone, email, student ID or
  private handover notes in publicly readable listing documents.

requests/{requestId}
  ownerUid, item, budget, requiredDate, hostelLabel, preference, description,
  status, createdAt

lostFound/{reportId}
  ownerUid, type, itemDescription, colour, broadLocation, date, category,
  status, createdAt
  Do not publish student-ID numbers, personal documents, exact private details,
  or identifying information about somebody else's belongings.

trades/{tradeId}
  senderUid, recipientUid, listing IDs, message, status, createdAt
  Only the two participants should be able to read a trade.

vaultItems/{resourceId}
  ownerUid, title, subject, semester, access, filePath, status, createdAt
  Share only files you own or are authorised to distribute. Paid access needs
  a trusted payment/entitlement process, not a client-side price label.

users/{uid}/notifications/{notificationId}
  title, message, read, createdAt

PART 6 — CONNECT THE WEBSITE CODE (THE MOST IMPORTANT PART)
==========================================================
Your current script.js is a browser-local application. To use Firebase, it
must be changed to use the Firebase JavaScript SDK. The console setup alone
will not sync the existing localStorage arrays to the cloud.

A. Use the Firebase modular SDK.
   In a static HTML project, the browser-module imports documented by Firebase
   can be used. For production, Firebase recommends using a module bundler,
   but the app can also be kept framework-free with browser modules if you
   prefer to stay with three HTML/CSS/JS files.

   The official Firebase web setup currently documents browser-module imports
   using SDK version 13.0.0. Keep the Firebase service imports on the same
   version. The SDK version can advance; check the linked official guide when
   you do a future upgrade. This shape is for the requested three-file site;
   Firebase recommends a module bundler for a more optimised production build.

   The SDK setup follows this shape (replace every placeholder with values from
   your Firebase Web app settings):

   import { initializeApp } from
     'https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js';
   import { getAuth, GoogleAuthProvider, signInWithPopup,
     signInWithRedirect, onAuthStateChanged, signOut } from
     'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
   import { getFirestore, collection, addDoc, getDocs, query,
     where, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from
     'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';

   const firebaseConfig = {
     apiKey: 'COPY_FROM_FIREBASE_CONSOLE',
     authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'COPY_FROM_FIREBASE_CONSOLE',
     messagingSenderId: 'COPY_FROM_FIREBASE_CONSOLE',
     appId: 'COPY_FROM_FIREBASE_CONSOLE'
   };
   const app = initializeApp(firebaseConfig);
   const auth = getAuth(app);
   const db = getFirestore(app);
   const googleProvider = new GoogleAuthProvider();

   This is an integration pattern, not a working connection until the real
   values are inserted and the app's account/data functions are wired to it.

B. Change the script tag in index.html to a module when using import statements:
   <script type="module" src="script.js"></script>

C. Replace local sign-in with Firebase Auth.
   - Google button calls signInWithPopup(auth, googleProvider) on desktop.
   - On mobile, the redirect flow may be preferable.
   - onAuthStateChanged(auth, user => ...) restores the actual login state.
   - signOut(auth) handles logout.
   - Save the returned Firebase uid and public profile fields in users/{uid}.
   Do not store an email/password or a password hash in localStorage for the
   real account system. Let Firebase Authentication handle credentials.

D. Replace every shared-data action with Firestore.
   - New listing: addDoc(collection(db, 'listings'), { ownerUid: user.uid,
     title, description, category, mode, price, status: 'active',
     createdAt: serverTimestamp() }).
   - Browse listings: query(collection(db, 'listings'),
     where('status', '==', 'active')) then getDocs(query).
   - Update own listing: updateDoc(doc(db, 'listings', listingId), changes).
   - Delete own listing: deleteDoc(doc(db, 'listings', listingId)).
   - Looking For, Lost & Found, Vault metadata and trade workflows also need
     Firestore writes and reads.
   - Favorites, recent searches, theme, and personal display settings may stay
     local if you want them device-specific, or move them to a private user
     document/subcollection if they should follow the user across devices.

E. Keep UI data ownership separate from personal profile fields. Firestore
   rules must match the fields in your documents and queries. For example, the
   public listing read rule in the supplied file expects status == 'active'.
   The code query must filter by that status. Firestore denies requests that do
   not satisfy the published rules.

F. The current in-app Contact action is not a real secure chat service yet.
   Do not claim real-time private messaging exists until you build and secure
   a chat collection or use a supported messaging service. Do not process real
   payments until a trusted payment provider/backend is connected.

PART 7 — STORAGE FOR LISTING IMAGES AND VAULT FILES
==================================================
1. Open Build > Storage and follow Firebase's setup flow.
2. Important: current Firebase documentation says Cloud Storage for Firebase
   requires the Blaze pay-as-you-go plan for bucket use. Check current pricing,
   attach billing only if you choose to enable uploads, and set budget alerts.
   Authentication and Firestore are separate services with their own current
   quotas/pricing; review the official pricing page before public launch.
3. Review storage.rules in this package. It allows image uploads under a
   user's own UID folder and restricts file type/size. Vault files are private
   to their owner in this starter policy.
4. In JavaScript, upload files to Firebase Storage, then store only the storage
   path and safe metadata in Firestore.
5. Do not expose private file URLs for files that should require access control.
6. Add file-size limits, content-type checks, and moderation. Do not let a user
   upload arbitrary executables or copyrighted textbooks without permission.

PART 8 — DEPLOY THE UPDATED CODE TO VERCEL
========================================
1. Open the Vercel project that already serves https://unitradeneo.vercel.app/.
   Do not create a new Vercel project unless you want a different public URL.
   Put the updated index.html, style.css, script.js, firestore.rules and
   storage.rules in the GitHub repository and root directory used by that project. The rules files can also be
   published through the Firebase Console or Firebase CLI; adding them to the
   repository alone does not publish them to Firebase.
2. Do not commit any service-account private key.
3. Commit and push the changes to the branch attached to Vercel.
4. Open Vercel > Deployments and wait for the new deployment to become Ready.
5. Open https://unitradeneo.vercel.app/ and test sign-in.
6. Once data functions use Firestore, create a listing in one browser, then
   sign in with another test account/browser and confirm it appears as intended.
7. Confirm a user cannot edit/delete another user's listing. Test this with two
   separate Google accounts before inviting the public.

PART 9 — EXISTING BROWSER DATA
==============================
localStorage belongs to one browser profile on one device. It does not upload
itself to Firebase. Accounts created by the old local sign-up form are not
Firebase accounts. If there is genuine user content you need to keep, review
it manually and write a one-time migration after the database schema and rules
are in place. Do not automatically upload private information from browsers.

PART 10 — BEFORE A PUBLIC COMMERCIAL LAUNCH
===========================================
[ ] Google provider enabled and exact Vercel domain authorized.
[ ] Firebase Auth replaces the local account/password code.
[ ] Shared listing/request/offer data uses Firestore.
[ ] Security rules are tested with the Firebase Emulator or Rules Simulator.
[ ] Storage upload/download rules are tested.
[ ] No sample content appears in any clean browser.
[ ] Privacy Policy and Terms of Service are published and linked.
[ ] Users can report listings/accounts and there is a real moderation response process.
[ ] No user emails, phone numbers, student IDs or private notes leak into public records.
[ ] Firebase budget/usage alerts are configured and costs are understood.
[ ] Backups/export and account deletion/data deletion processes are planned.
[ ] App Check, abuse limits, and monitoring are considered before scaling.
[ ] Real chat and payment flows are not advertised until they truly work.

If you get stuck, the next practical step is to create the Firebase project and
copy the Web app configuration values (not a service-account key). Then the
website code can be adapted against your exact project settings.


============================================================
UPDATED FIREBASE INTEGRATION PACKAGE NOTES
============================================================

This package has been updated to use Firebase Authentication with Google Sign-In and Cloud Firestore for the first shared cloud workflows (marketplace listings and Looking For requests). The existing HTML/CSS design and other feature views are preserved. Theme and interface preferences may remain local to the browser.

REQUIRED BEFORE DEPLOYMENT
1. Open firebase-config.js.
2. In Firebase Console > Project settings > Your apps > Web app > Config, copy the actual Web app values into firebase-config.js.
3. In Authentication > Sign-in method, enable Google.
4. In Authentication > Settings > Authorized domains, add unitrade-pied.vercel.app.
5. Create Cloud Firestore in production mode.
6. Review and publish firestore.rules only after checking them in Rules Playground / Emulator against the included code.
7. Deploy all files, including firebase-config.js, to Vercel.

IMPORTANT SCOPE NOTE
Google authentication, user profile creation, Firestore listing writes/reads, and Looking For request writes/reads are connected in this package. Favorites, trade offers, Lost & Found, Vault resources, notifications, reports, image/file uploads, and other specialist workflows still need their own cloud migration and matching rules before those features can be considered cross-device or production-ready. Existing localStorage records are not automatically imported into Firestore. Do not upload private student IDs or passwords.

Use a local static server or Vercel to test the site; do not rely on opening index.html directly with file://.
