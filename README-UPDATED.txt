UNITRADE UPDATED PACKAGE — CAMPUS CHAT, STUDENT SEARCH, PROFILE DETAILS

Files
- index.html, style.css, script.js: existing UniTrade site with listing deletion and campus-scoped listing support.
- social.js, social.css: new Firebase-backed student search, direct chat, conversation list, profile completion, and unread message-notification badge.
- firebase-config.js: existing Firebase web config (browser config, not a server secret).
- firestore.rules: updated rules for public profile search, private chats/messages, phone number in private user profile, and notification creation.
- storage.rules and UniTrade-Complete-Website-Guide.pdf: carried forward.

IMPORTANT SETUP
1. Back up your current deployment/repository.
2. Replace website files with the contents of this package and deploy on HTTPS.
3. In Firebase Console enable Google Authentication and create Cloud Firestore.
4. Review firestore.rules, publish it in Firebase Console, and test with Firebase Rules Simulator / Emulator before production.
5. Make sure Firebase Authentication authorized domains include your production hostname.
6. Open the deployed website, sign in with Google, and complete phone, college, course and year fields.
7. Create two test accounts with the same college and verify search/chat in two separate browsers.

New features
- Find students by name/course/hostel, limited to the selected college.
- Direct text chat with Firestore realtime message updates.
- Recent conversations.
- Unread message count and notification records for incoming messages.
- Required profile completion for phone, college, course and year.
- Delete own listings (Firestore ownership rules still apply).
- Campus filtering for cloud listings when a profile has a college.

Important commercial-launch limitations
- Phone numbers are stored in the private users/{uid} document and are included in a direct-message notification payload, not in searchable publicProfiles or public listings. The UI explains that phone information is not public. Review privacy consent, retention and applicable Indian privacy law before launch.
- Message notification badge currently counts unread notification documents. The existing notification modal in the original application remains separate; a full unified notification inbox/read-state workflow should be built and tested before launch.
- This package does not implement payment processing, escrow, verified student status, push notifications when the site is closed, moderation/admin console, rate limiting, abuse reporting backend, or transactional purchase/order state machine. Do not represent those as completed.
- Listing campus isolation is a UI query/filter plus public listing reads. For strong campus privacy, use trusted backend logic/custom claims and rules enforcing campus membership; client-side filtering alone is not a security boundary.
- Existing listing records created before this update may not contain college. Review/migrate them deliberately. Current compatibility filter still shows records with no college; remove that fallback after migrating existing records if strict campus separation is required.
- Browser Google config is not a service-account key, but it is not sufficient security by itself. Firestore rules and Auth configuration are essential.
- Firestore message ordering needs a composite index only if the console requests one. Check browser console and Firestore usage during testing.
- Run tests for account creation, two-user chats, cross-campus search, unauthorized listing deletion, notifications, and profile edits before taking real transactions.

The code was syntax-checked with Node. This does not substitute for testing against your live Firebase project, published rules, real accounts, or deployment.
