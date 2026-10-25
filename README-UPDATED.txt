UNITRADE — COMPLETE WEBSITE + FIREBASE FIXES
============================================

This archive contains the complete frontend source and updated Firebase setup
files. Read START-HERE-FIREBASE.txt before deploying.

KEY FIXES
---------
- Profile saving is allowed before email verification. Email verification is
  still required for campus search and messaging.
- The Save profile button shows progress, blocks duplicate submissions, and
  reports whether the private users/{uid} write or publicProfiles/{uid} write
  failed.
- Required profile fields include full name, phone number, college, course,
  year of study, and student registration/roll number.
- Phone number and registration/roll number are private and are not copied to
  publicProfiles or new notification documents.
- College name and acronym use one field. Matching is case-insensitive for
  recognised aliases such as IITG, NITS, GU, LPU and common IIT aliases.
- Firestore rules require a verified email and complete private campus profile
  for student discovery and messaging. The rules deny unspecified collections.
- Sign-in supports Firebase Email/Password and Google, provided those providers
  are enabled in Firebase Console.

FILES
-----
- index.html: website markup
- style.css: main website styling
- script.js: marketplace and account signup/sign-in logic
- social.js: campus profiles, student search, chat and notifications
- social.css: campus profile and chat styling
- firebase-config.js: Firebase Web app configuration; verify the project ID
- firestore.rules: Firestore access rules to review and publish
- storage.rules: optional Storage rules for upload features
- START-HERE-FIREBASE.txt: beginner step-by-step Firebase and deployment guide
- FIREBASE-FIX-STEPS.txt: troubleshooting checklist
- RELEASE-NOTES-ACCOUNT-UPDATE.txt: change summary

BEFORE DEPLOYING
----------------
1. Confirm firebase-config.js points to the intended Firebase project.
2. Enable Email/Password and Google under Authentication > Sign-in method.
3. Add the exact deployed hostname under Authentication > Settings > Authorized domains.
4. In the existing Firestore database, open Rules, replace with firestore.rules,
   and click Publish. Do not delete your existing collections.
5. Deploy all website files to the existing hosting project.
6. Test registration, email verification, profile saving and two-account messaging.

VALIDATION AND LIMITATIONS
--------------------------
JavaScript syntax checks passed for script.js, social.js and firebase-config.js.
The HTML was checked for duplicate IDs and local script references. This is not
an end-to-end test against the live Firebase project. Email delivery, deployed
rules, hosting configuration and all user flows must still be tested in your
own project. Do not treat email verification as proof of college enrollment.
