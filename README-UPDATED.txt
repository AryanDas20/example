UNITRADE — UPDATED CAMPUS MARKETPLACE PACKAGE

Included updates
- Firebase config set to the web app details supplied for project example-fb860. The page loads the Firebase 13.1.0 compatibility SDK to match the existing global Firebase code style.
- Email/password sign-up and sign-in use Firebase Authentication; password reset uses Firebase email.
- Sign-up sends an email-verification link. Verified email is required for publishing/contact actions.
- Phone number is required profile information; phone verification, SMS and reCAPTCHA are removed from the authentication flow. Student registration number is also required and remains private.
- Profile includes name, optional private phone number, college name or recognised acronym in one field, course, department, year, hostel/campus area, city, short bio, required private phone and required private student registration number.
- Campus-scoped listing queries use a normalized collegeKey. Firestore rules restrict listing/profile reads to the signed-in user's campus key.
- Student search is case-insensitive and uses the saved campus acronym/canonical key.
- Chat layout fixes scrolling, uses a multi-line composer, clears input immediately, and scrolls immediately after send.
- Sender can edit or delete their own messages; message actions are restricted by Firestore rules.
- Student profile cards show public details and a chat button; phone, email and student ID are not shown on public profiles.
- Detailed notification center shows message/product-interest context and sender identity. Phone/email are shown only to the notification recipient.
- Product cards use category-specific icons and separate category-colored backgrounds.

IMPORTANT Firebase setup
1. This package now points to project example-fb860 using the config you supplied. Confirm this is the intended project before deployment.
2. Firebase Console → Authentication → Sign-in method: enable Email/Password and Google. Phone provider is not needed.
3. Authentication → Settings → Authorized domains: add localhost and the actual deployed hostname (for the older deployment referenced in the project guide, this is unitradeneo.vercel.app if you still use that domain).
4. Email verification requires the configured Firebase email template/action URL to be valid. Test delivery and spam placement.
5. No phone OTP is used by this build. Email verification remains enabled.
6. Deploy firestore.rules and storage.rules from this package to the same Firebase project. Test them in the Rules Playground/Emulator before production.
7. Campus listings now require collegeKey. Older listing documents without collegeKey will not appear until migrated. Old chat documents can be upgraded when both participants already have matching campus keys; otherwise test with a new conversation. Do not loosen rules just to show legacy records.
8. Use the official campus name consistently. Recognised aliases are normalised; the short name is indexed for search. A production deployment should use a centrally managed campus directory rather than free-text campus identity.
9. Firebase Web API keys are public identifiers, not secrets; security comes from Authentication, Firestore/Storage rules, abuse controls and server-side validation.

Security / commercial readiness caveats
- The browser cannot guarantee transactional purchases or secure payment settlement. No real payment gateway, escrow, order fulfillment or dispute resolution is included.
- Email may be present in a recipient's private notification document for direct contact context; optional phone details remain private to the user profile. Review consent, retention, privacy policy and applicable Indian data protection obligations.
- Email verification does not itself prove a person is a student. Student-ID/institution verification and moderation need a trusted backend/admin workflow. Phone verification and SMS OTP are not part of this build.
- Campus key consistency is still dependent on user-entered campus fields. For strict production isolation, replace free-text campus entry with a server-managed campus directory or trusted custom claims.
- Test two accounts in separate browsers: email verification, cross-campus listing denial, cross-campus search denial, message send/edit/delete, notification visibility, profile privacy and listing ownership.
- The code was syntax-checked only; it has not been run against your live Firebase project. Email delivery, rules, domains, database indexes and auth providers must be tested in your project. SMS/phone OTP is intentionally removed.

AUTH UPDATE (2026-10-25)
- Removed SMS/phone OTP UI, reCAPTCHA setup, OTP request and confirmation handlers.
- Phone number is optional profile information and is not used as an authentication gate.
- Email/password and Google sign-in remain available. Email verification is still required for campus messaging and marketplace actions.
- Updated Firestore rules so verified campus accounts no longer need phoneVerified=true. Deploy firestore.rules in Firebase Console before using the updated website.
- This ZIP has been syntax-checked locally; live Firebase/Vercel behavior still needs to be tested after deployment.
