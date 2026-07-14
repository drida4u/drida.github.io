// ============================================================
// PHONE / OTP LOGIN
// ------------------------------------------------------------
// Flow: user types phone number -> we send an OTP via Firebase ->
// user types the code -> we verify it -> they're logged in and
// sent to my-courses.html.
// ============================================================

// Holds the in-progress sign-in attempt between "send OTP" and "verify OTP".
let confirmationResult;

// Invisible reCAPTCHA: required by Firebase Phone Auth to block spam.
// "size: invisible" means the user never sees or solves a puzzle -
// it runs quietly in the background.
const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  size: 'invisible'
});

const phoneInput = document.getElementById('phone');
const sendOtpBtn = document.getElementById('send-otp');
const otpSection = document.getElementById('otp-section');
const otpInput = document.getElementById('otp');
const verifyBtn = document.getElementById('verify-otp');
const statusMsg = document.getElementById('status-msg');

sendOtpBtn.addEventListener('click', () => {
  const phoneNumber = phoneInput.value.trim();

  // Firebase requires the full international format, e.g. +919876543210
  if (!phoneNumber.startsWith('+')) {
    statusMsg.textContent = 'Please include the country code, e.g. +91 for India.';
    return;
  }

  statusMsg.textContent = 'Sending OTP...';

  auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      otpSection.style.display = 'block';
      statusMsg.textContent = 'OTP sent. Enter the code you received by SMS.';
    })
    .catch((error) => {
      statusMsg.textContent = 'Could not send OTP: ' + error.message;
    });
});

verifyBtn.addEventListener('click', () => {
  const code = otpInput.value.trim();
  statusMsg.textContent = 'Verifying...';

  confirmationResult.confirm(code)
    .then((result) => {
      const user = result.user;
      // Save/update this user's basic profile. Note: the security
      // rules only allow a user to write their OWN phone/lastLogin -
      // they can never set or change which courses they're enrolled in.
      return db.collection('users').doc(user.uid).set({
        phone: user.phoneNumber,
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    })
    .then(() => {
      window.location.href = 'my-courses.html';
    })
    .catch((error) => {
      statusMsg.textContent = 'Incorrect code, please try again: ' + error.message;
    });
});
