// ============================================================
// GOOGLE SIGN-IN + PHONE COLLECTION
// ------------------------------------------------------------
// Flow:
//   1. User clicks "Sign in with Google" → Firebase Google popup
//   2. On success, check Firestore if they already have a phone number saved
//   3a. If yes → save to localStorage and redirect
//   3b. If no  → show phone number input (mandatory), save it, then redirect
//
// Why collect phone? Google accounts are free and people can have many,
// but phone numbers are a strong identity anchor. Drida can recognise the
// same member even if they switch Google accounts years later.
// ============================================================

const googleProvider = new firebase.auth.GoogleAuthProvider();
const statusMsg     = document.getElementById('status-msg');
const phoneStep     = document.getElementById('phone-step');
const googleStep    = document.getElementById('google-step');
const phoneInput    = document.getElementById('phone-input');
const phoneStatusMsg = document.getElementById('phone-status-msg');

// Where to send the user after login (set by ?return= query param)
const params    = new URLSearchParams(window.location.search);
const returnUrl = params.get('return') || 'my-courses.html';

// ── Google Sign-In ────────────────────────────────────────────
document.getElementById('google-signin-btn').addEventListener('click', function() {
  statusMsg.style.display = 'none';
  this.disabled = true;
  this.textContent = 'Signing in…';

  auth.signInWithPopup(googleProvider)
    .then(function(result) {
      const user = result.user;
      // Check Firestore for an existing phone number
      return db.collection('users').doc(user.uid).get().then(function(doc) {
        const data  = doc.exists ? doc.data() : {};
        // Block deleted accounts
        if (data.deleted === true) {
          auth.signOut();
          const btn = document.getElementById('google-signin-btn');
          btn.disabled = false;
          btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.5 33.1 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.8-1.8 13.4-4.7l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.1 0-9.5-2.9-11.3-7l-6.6 5.1C9.8 39.8 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.6 4.4-4.9 5.8l6.2 5.2C40.5 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/></svg> Sign in with Google';
          statusMsg.textContent = 'This account has been removed. Please contact Drida support.';
          statusMsg.style.display = 'block';
          return;
        }
        const phone = data.phone;
        if (phone) {
          // Returning user with phone already saved → straight to courses
          saveLocalAndRedirect(user, phone);
        } else {
          // New user or phone not yet collected → show phone step
          googleStep.style.display = 'none';
          phoneStep.style.display  = 'block';
          // Store user object temporarily to use after phone is saved
          window._pendingUser = user;
        }
      });
    })
    .catch(function(err) {
      const btn = document.getElementById('google-signin-btn');
      btn.disabled = false;
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20H24v8h11.3C33.5 33.1 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.6-8 19.6-20 0-1.3-.1-2.7-.4-4z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.8-1.8 13.4-4.7l-6.2-5.2C29.3 35.5 26.8 36 24 36c-5.1 0-9.5-2.9-11.3-7l-6.6 5.1C9.8 39.8 16.4 44 24 44z"/><path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.6 4.4-4.9 5.8l6.2 5.2C40.5 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-4z"/></svg> Sign in with Google';
      statusMsg.textContent = 'Sign-in failed. Please try again.';
      statusMsg.style.display = 'block';
    });
});

// ── Phone number save ─────────────────────────────────────────
document.getElementById('save-phone-btn').addEventListener('click', function() {
  const countryCode = document.getElementById('country-code').value;
  const localNumber = phoneInput.value.trim().replace(/\D/g, ''); // digits only
  const phone = countryCode + localNumber;
  phoneStatusMsg.style.display = 'none';

  if (localNumber.length < 7) {
    phoneStatusMsg.textContent = 'Please enter a valid phone number.';
    phoneStatusMsg.style.display = 'block';
    return;
  }

  const btn  = this;
  const user = window._pendingUser;
  btn.textContent = 'Saving…';
  btn.disabled    = true;

  db.collection('users').doc(user.uid).set({
    phone:     phone,
    name:      user.displayName || '',
    email:     user.email       || '',
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true })
    .then(function() {
      saveLocalAndRedirect(user, phone);
    })
    .catch(function(err) {
      btn.textContent = 'Save & Continue';
      btn.disabled    = false;
      phoneStatusMsg.textContent = 'Could not save. Please try again.';
      phoneStatusMsg.style.display = 'block';
    });
});

// Allow Enter in phone input
document.getElementById('phone-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') document.getElementById('save-phone-btn').click();
});

// ── Helper ────────────────────────────────────────────────────
function saveLocalAndRedirect(user, phone) {
  // Update Firestore lastLogin
  db.collection('users').doc(user.uid).set({
    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  // Save to localStorage so auth-nav.js can update the nav
  localStorage.setItem('drida-user', JSON.stringify({
    uid:   user.uid,
    phone: phone,
    name:  user.displayName || '',
    email: user.email       || ''
  }));

  window.location.href = returnUrl;
}
