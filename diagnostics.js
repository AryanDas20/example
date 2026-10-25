/* UniTrade deployment diagnostics. This file intentionally does not expose private profile data. */
(() => {
  'use strict';
  const id = 'unitradeHealthNotice';
  function notice(title, message, kind = 'warning') {
    let box = document.getElementById(id);
    if (!box) {
      box = document.createElement('section');
      box.id = id;
      box.setAttribute('role', 'status');
      box.setAttribute('aria-live', 'polite');
      box.style.cssText = 'position:fixed;left:14px;right:14px;bottom:14px;z-index:20000;max-width:850px;margin:auto;padding:14px 16px;border:1px solid #f0b45b;border-radius:14px;background:#171d2b;color:#f8fbff;box-shadow:0 12px 40px #0008;font:14px/1.5 system-ui,sans-serif;';
      document.body.appendChild(box);
    }
    box.replaceChildren();
    const strong = document.createElement('strong');
    strong.textContent = title;
    strong.style.display = 'block';
    strong.style.marginBottom = '4px';
    const text = document.createElement('div');
    text.textContent = message;
    box.append(strong, text);
    if (kind === 'error') box.style.borderColor = '#ff6f88';
    if (!box.querySelector('button')) {
      const close = document.createElement('button');
      close.type = 'button';
      close.textContent = 'Dismiss';
      close.style.cssText = 'margin-top:8px;border:1px solid #65718a;border-radius:8px;background:transparent;color:inherit;padding:5px 10px;cursor:pointer;';
      close.addEventListener('click', () => box.remove());
      box.appendChild(close);
    }
  }

  // Keep a JS initialization failure from leaving the full-screen loader over every control.
  window.setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('is-hidden')) {
      loader.classList.add('is-hidden');
      console.warn('[UniTrade] Loader fallback activated. Check the Console for an initialization error.');
    }
  }, 3500);

  window.addEventListener('error', (event) => {
    const message = event?.message || 'A script or resource failed to load.';
    console.error('[UniTrade runtime error]', message, event?.filename || '', event?.lineno || '');
    notice('UniTrade encountered a JavaScript error', `${message} Open browser DevTools → Console for the file and line number.`, 'error');
  });
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const message = reason?.message || String(reason || 'Unknown asynchronous error');
    console.error('[UniTrade rejected promise]', reason);
    notice('A UniTrade action failed', `${message} If this mentions permission-denied, check the deployed Firestore rules.`, 'error');
  });

  window.addEventListener('load', () => {
    if (!window.unitradeFirebaseReady) {
      const reason = window.unitradeFirebaseError || 'Firebase did not initialise. The static interface may load, but account, shared listing, and messaging features need Firebase.';
      notice('Firebase is not connected', `${reason} Check firebase-config.js, the Firebase SDK network requests, and your Vercel domain in Firebase Authentication → Settings → Authorized domains.`);
    }
    if (window.unitradeAppError) {
      notice('UniTrade could not initialize all controls', window.unitradeAppError, 'error');
    }
  });
})();
