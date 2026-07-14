// ============================================================
// FIREBASE CONFIG
// ------------------------------------------------------------
// Paste the config block Firebase gave you (Project Settings ->
// Your apps -> the </> web app) below, replacing the placeholders.
// This file is loaded by every page that needs login/courses.
//
// Note: this config is NOT a secret. It's normal and safe for it
// to be visible in your website's code - real security comes from
// the Firestore Rules (see firestore.rules), not from hiding this.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyC8Oa3_OShU1H00qfrwzws6LQZlb3UscT0",
  authDomain: "drida-e7508.firebaseapp.com",
  projectId: "drida-e7508",
  storageBucket: "drida-e7508.firebasestorage.app",
  messagingSenderId: "762424413202",
  appId: "1:762424413202:web:c73bc974dbfb38e3b61ccb"
};

// Initialize Firebase once. Every page that includes this file
// (after the Firebase SDK scripts) can use `auth` and `db`.
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
