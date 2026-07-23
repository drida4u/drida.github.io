// ============================================================
// DRIDA SITE CONFIG — change here, reflects everywhere
// ============================================================
// Before go-live, replace the placeholder values below with
// the real ones. This file is loaded by every page that
// handles payments or contact.
// ============================================================

const DRIDA_CONFIG = {

  // ── UPI Payment IDs ──────────────────────────────────────
  // upi1: primary account (e.g. Smitha's personal UPI)
  // upi2: secondary account (e.g. Drida Foundation account)
  // Each course card can specify which one to use via the
  // showUpi() call — defaults to upi1 if not specified.
  upi1: {
    id:   'drida@ybl',             // ← replace with real UPI ID before go-live
    name: 'Smitha Haridas',        // shown to payer in their UPI app
    label: 'Pay to Smitha Ma\'am'  // button label shown on website
  },
  upi2: {
    id:   'drida.foundation@ybl',  // ← replace with real UPI ID before go-live
    name: 'Drida Foundation',
    label: 'Pay to Drida Foundation'
  },

  // ── Contact ───────────────────────────────────────────────
  whatsappNumber: '918075471581',  // used in wa.me links — no + sign
  email: 'drida4u@gmail.com',

};
