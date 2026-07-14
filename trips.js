// ============================================================
// PUBLIC TRIPS & EVENTS LOADER (homepage)
// ------------------------------------------------------------
// Pulls every document from the public "trips" collection and
// renders it as a card. Add a new trip in the Firebase Console
// and it shows up here automatically.
//
// trips/{tripId} document shape (all fields optional except title):
//   {
//     title:       "Munnar Nature Retreat",
//     description: "Yoga, nature walks and community bonding in the hills.",
//     date:        "15 Aug 2026",          display text, e.g. "15 Aug 2026" or "TBD"
//     location:    "Munnar, Kerala",
//     price:       1500,                   registration fee in rupees; omit for "Contact to Register"
//     upiId:       "drida@ybl",            your UPI ID — used to generate QR/deep-link
//     posterImage: "images/trip-munnar.png",
//     active:      true                    set false to hide without deleting
//   }
//
// Payment flow (same manual model as courses):
//   1. Visitor fills in name + phone, then sees a UPI QR / Pay button.
//   2. They pay; you see it in your UPI app.
//   3. You manually confirm their spot (WhatsApp / phone) and note them
//      down as registered — no Firestore changes needed for trips.
// ============================================================

function buildTripUpiBlock(trip) {
  const tripTitle = trip.title || 'Drida trip';
  const blockId = 'trip-' + Math.random().toString(36).slice(2, 8);

  window['_showTripUpi_' + blockId] = function () {
    const name  = (document.getElementById('tn-' + blockId) || {}).value || '';
    const phone = (document.getElementById('tp-' + blockId) || {}).value || '';
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and phone number so we can confirm your spot after payment.');
      return;
    }
    const note = encodeURIComponent(`${tripTitle} | ${name.trim()} | ${phone.trim()}`);
    const upiLink = `upi://pay?pa=${encodeURIComponent(trip.upiId)}&pn=${encodeURIComponent('Drida Foundation')}&am=${trip.price}&cu=INR&tn=${note}`;
    const qrSrc = trip.qrImage
      || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`;

    document.getElementById(blockId).innerHTML = `
      <img class="upi-qr" src="${qrSrc}" alt="Scan to pay via UPI" onerror="this.style.display='none'">
      <a class="btn" href="${upiLink}">Pay via UPI App</a>
      <p class="upi-note">Scan the QR or tap the button to pay ₹${trip.price}. We'll confirm your spot within a few hours of receiving payment.</p>
    `;
  };

  return `
    <div class="upi-pay" id="${blockId}">
      <p class="upi-note" style="margin-bottom:0.5rem;">Enter your details to register:</p>
      <input id="tn-${blockId}" class="upi-input" type="text" placeholder="Your full name" />
      <input id="tp-${blockId}" class="upi-input" type="tel"  placeholder="Your phone number" />
      <button class="btn" type="button" onclick="window['_showTripUpi_${blockId}']()">Register &amp; Pay ₹${trip.price}</button>
    </div>
  `;
}

function loadPublicTrips() {
  const list = document.getElementById('public-trip-list');
  if (!list || typeof db === 'undefined') return;

  db.collection('trips').get()
    .then((snapshot) => {
      const docs = snapshot.docs.filter((doc) => doc.data().active !== false);
      if (docs.length === 0) return; // keep the static fallback cards

      list.innerHTML = '';
      docs.forEach((doc) => {
        const trip = doc.data();

        const posterHtml = trip.posterImage
          ? `<img src="${trip.posterImage}" alt="${trip.title}" onerror="this.style.display='none'">`
          : '';

        // Date + location chips
        const metaHtml = (trip.date || trip.location) ? `
          <p class="trip-meta">
            ${trip.date     ? `<span class="trip-chip">&#128197; ${trip.date}</span>` : ''}
            ${trip.location ? `<span class="trip-chip">&#128205; ${trip.location}</span>` : ''}
          </p>` : '';

        const priceHtml = trip.price
          ? `<p class="price">&#8377;${trip.price}</p>`
          : '';

        const ctaHtml = (trip.upiId && trip.price)
          ? buildTripUpiBlock(trip)
          : trip.price
            ? `<a class="btn" href="#contact">Contact to Register</a>`
            : `<a class="btn" href="#contact">Contact Us</a>`;

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          ${posterHtml}
          <h3></h3>
          ${metaHtml}
          <p class="trip-desc"></p>
          ${priceHtml}
          ${ctaHtml}
        `;
        card.querySelector('h3').textContent = trip.title || 'Upcoming trip';
        card.querySelector('.trip-desc').textContent = trip.description || '';
        list.appendChild(card);
      });
    })
    .catch((error) => {
      console.error('Could not load trips, showing defaults instead:', error);
    });
}

loadPublicTrips();
