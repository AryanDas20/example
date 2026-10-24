UNITRADE — UPDATED CAMPUS MARKETPLACE PACKAGE

Included updates
- Firebase config set to the web app details supplied for project example-fb860. The page loads the Firebase 13.1.0 compatibility SDK to match the existing global Firebase code style.
- Email/password sign-up and sign-in use Firebase Authentication; password reset uses Firebase email.
- Sign-up sends an email-verification link. Verified email is required for publishing/contact actions.
- Phone verification uses Firebase SMS + reCAPTCHA and links the verified phone to the signed-in account.
- Profile includes name, phone verification, official campus name, short name/acronym, course, department, year, hostel/campus area, city, short bio and optional private student ID.
- Campus-scoped listing queries use a normalized collegeKey. Firestore rules restrict listing/profile reads to the signed-in user's campus key.
- Student search is case-insensitive and uses the saved campus acronym/canonical key.
- Chat layout fixes scrolling, uses a multi-line composer, clears input immediately, and scrolls immediately after send.
- Sender can edit or delete their own messages; message actions are restricted by Firestore rules.
- Student profile cards show public details and a chat button; phone, email and student ID are not shown on public profiles.
- Detailed notification center shows message/product-interest context and sender identity. Phone/email are shown only to the notification recipient.
- Product cards use category-specific icons and separate category-colored backgrounds.

IMPORTANT Firebase setup
1. This package now points to project example-fb860 using the config you supplied. Confirm this is the intended project before deployment.
2. Firebase Console → Authentication → Sign-in method: enable Email/Password, Google and Phone.
3. Authentication → Settings → Authorized domains: add localhost and the actual deployed hostname (for the older deployment referenced in the project guide, this is unitradeneo.vercel.app if you still use that domain).
4. Email verification requires the configured Firebase email template/action URL to be valid. Test delivery and spam placement.
5. Phone OTP requires billing/usage settings appropriate to Firebase Phone Auth, valid E.164 numbers, reCAPTCHA, and test-phone configuration during development.
6. Deploy firestore.rules and storage.rules from this package to the same Firebase project. Test them in the Rules Playground/Emulator before production.
7. Campus listings now require collegeKey. Older listing documents without collegeKey will not appear until migrated. Old chat documents can be upgraded when both participants already have matching campus keys; otherwise test with a new conversation. Do not loosen rules just to show legacy records.
8. Use the official campus name consistently. Recognised aliases are normalised; the short name is indexed for search. A production deployment should use a centrally managed campus directory rather than free-text campus identity.
9. Firebase Web API keys are public identifiers, not secrets; security comes from Authentication, Firestore/Storage rules, abuse controls and server-side validation.

Security / commercial readiness caveats
- The browser cannot guarantee transactional purchases or secure payment settlement. No real payment gateway, escrow, order fulfillment or dispute resolution is included.
- Phone/email may be present in a recipient's private notification document for direct contact context; review consent, retention, privacy policy and applicable Indian data protection obligations.
- Email/phone verification does not itself prove a person is a student. Student-ID/institution verification and moderation need a trusted backend/admin workflow.
- Campus key consistency is still dependent on user-entered campus fields. For strict production isolation, replace free-text campus entry with a server-managed campus directory or trusted custom claims.
- Test two accounts in separate browsers: email verification, SMS verification, cross-campus listing denial, cross-campus search denial, message send/edit/delete, notification visibility, profile privacy and listing ownership.
- The code was syntax-checked only; it has not been run against your live Firebase project. Live SMS delivery, rules, domains, database indexes and auth providers must be tested in your project.

SMS ERROR DIAGNOSTICS PATCH (2026-10-25)
- social.js now shows the Firebase error code and a human-readable cause instead of hiding detail in a one-argument toast.
- reCAPTCHA is rendered before requesting an SMS, reset after a failed request, and the send button is disabled during the request.
- Phone errors such as auth/operation-not-allowed, auth/unauthorized-domain, auth/quota-exceeded, auth/too-many-requests, auth/captcha-check-failed and network errors receive targeted guidance. Full error code/message is also logged to DevTools Console.
- IMPORTANT: JavaScript cannot enable the Phone provider or billing from the client. Before real SMS tests, enable Phone in Firebase Authentication → Sign-in method, add the exact Vercel hostname under Authorized domains, check SMS region policy, and configure the billing/plan required by Firebase. If billing is not enabled, use Firebase fictional test phone numbers for development instead of expecting real SMS delivery.
- Use only the exact Firebase project whose config is in firebase-config.js. Test SMS on the deployed HTTPS Vercel domain, not an unlisted preview hostname.
