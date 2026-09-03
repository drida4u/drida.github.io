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

  // ── Per-category payment recipients ──────────────────────
  // Each category can have its own UPI ID AND its own WhatsApp
  // number for the "send your screenshot" step after payment.
  // Replace every placeholder below (id + whatsapp) before go-live.
  // If a category's "whatsapp" is left blank, it falls back to
  // the shared whatsappNumber above.
  paymentCategories: {
    courses: {
      id:       'drida@ybl',              // ← replace with real UPI ID
      name:     'Smitha Haridas',
      label:    'Pay for Course',
      whatsapp: '918075471581'            // ← replace with real number
    },
    crystal: {
      id:       'drida.crystal@ybl',      // ← replace with real UPI ID
      name:     'Drida Crystal',
      label:    'Pay for Drida Crystal',
      whatsapp: '918075471581'            // ← Smitha's number for now; replace when a dedicated crystal contact is ready
    },
    kasar: {
      id:       'kasar.naturals@ybl',     // ← replace with real UPI ID
      name:     'Kasar Naturals',
      label:    'Pay for Kasar Naturals',
      whatsapp: '918075471581'            // ← Smitha's number for now; replace when a dedicated kasar contact is ready
    },
    nighties: {
      id:       'eksel4u@ybl',            // ← replace with real UPI ID
      name:     'EK.SEL4U',
      label:    'Pay for EK.SEL4U Nightwear',
      whatsapp: '918075471581'            // ← Smitha's number for now; replace when a dedicated nighties contact is ready
    },
    trips: {
      id:       'drida.trips@ybl',        // ← replace with real UPI ID
      name:     'Drida Yatras',
      label:    'Pay for Trip',
      whatsapp: '918075471581'            // ← Smitha's number for now; replace when a dedicated trips contact is ready
    }
  },

};
