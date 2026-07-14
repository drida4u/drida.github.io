// ============================================================
// PUBLIC COURSES LOADER (homepage)
// ------------------------------------------------------------
// Pulls every document from the public "courses" collection and
// renders it as a card, so that whenever you add a new course in
// the Firebase Console (after posting about it on Instagram/
// WhatsApp), it shows up here automatically - no code changes.
//
// courses/{courseId} document shape (all fields optional except title):
//   {
//     title: "Summer Yoga Batch",
//     description: "6-week morning batch, beginner friendly.",
//     price: 999,                YOUR FEE in rupees - omit for "Contact to Enroll" / Member Login
//     upiId: "drida@ybl",        your UPI ID - shown + turned into a QR code and a "Pay via UPI App" button
//     qrImage: "images/qr.jpg",  OPTIONAL - your own UPI QR screenshot, used instead of the auto-generated one
//     posterImage: "images/course-summer-yoga.jpg",  optional poster photo
//     active: true               set to false to hide a course without deleting it
//   }
//
// Payment flow (manual, no payment gateway / fees involved):
//   1. Visitor sees the price + your UPI ID + a QR code, and either
//      taps "Pay via UPI App" (on a phone, opens GPay/PhonePe/etc with
//      the amount pre-filled) or scans the QR with any UPI app.
//   2. They're asked to put their name + the course name in the UPI
//      payment note, so you can tell who paid for what.
//   3. You see the payment land in your UPI app/bank as usual, then
//      add that course's ID to the buyer's enrolledCourses array in
//      Firestore (Console -> users -> their doc) - same manual step
//      as today, just with a proper payment page instead of asking
//      people to transfer blind.
//
// If Firestore has no course documents yet (or fails to load), the
// four sample cards already written in index.html stay visible -
// so the page never looks broken or empty.
// ============================================================

// Build a UPI pay block that first collects the buyer's name + phone,
// then generates a QR / deep-link with those details in the note so
// Sara can match the payment to the right person. UPI ID is never
// shown on-screen - it's encoded inside the QR / deep-link only.
function buildUpiPayBlock(course) {
  const courseTitle = course.title || 'Drida course';
  const blockId = 'upi-' + Math.random().toString(36).slice(2, 8);

  // Called when the user submits the name+phone form.
  window['_showUpi_' + blockId] = function () {
    const name  = (document.getElementById('n-' + blockId)  || {}).value || '';
    const phone = (document.getElementById('p-' + blockId) || {}).value || '';
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and phone number so we can confirm your enrollment after payment.');
      return;
    }
    const note = encodeURIComponent(`${courseTitle} | ${name.trim()} | ${phone.trim()}`);
    const upiLink = `upi://pay?pa=${encodeURIComponent(course.upiId)}&pn=${encodeURIComponent('Drida Foundation')}&am=${course.price}&cu=INR&tn=${note}`;
    const qrSrc = course.qrImage
      || `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiLink)}`;

    document.getElementById(blockId).innerHTML = `
      <img class="upi-qr" src="${qrSrc}" alt="Scan to pay via UPI" onerror="this.style.display='none'">
      <a class="btn" href="${upiLink}">Pay via UPI App</a>
      <p class="upi-note">Scan the QR or tap the button to pay ₹${course.price}. After payment we’ll add you to the course — usually within a few hours.</p>
    `;
  };

  return `
    <div class="upi-pay" id="${blockId}">
      <p class="upi-note" style="margin-bottom:0.5rem;">Enter your details to proceed to payment:</p>
      <input id="n-${blockId}" class="upi-input" type="text" placeholder="Your full name" />
      <input id="p-${blockId}" class="upi-input" type="tel"  placeholder="Your phone number" />
      <button class="btn" type="button" onclick="window['_showUpi_${blockId}']()">Continue to Pay ₹${course.price}</button>
    </div>
  `;
}

function loadPublicCourses() {
  const list = document.getElementById('public-course-list');
  if (!list || typeof db === 'undefined') return;

  db.collection('courses').get()
    .then((snapshot) => {
      const docs = snapshot.docs.filter((doc) => doc.data().active !== false);
      if (docs.length === 0) return; // keep the static fallback cards

      list.innerHTML = '';
      docs.forEach((doc) => {
        const course = doc.data();

        const posterHtml = course.posterImage
          ? `<img src="${course.posterImage}" alt="${course.title}" onerror="this.style.display='none'">`
          : '';

        const priceHtml = course.price
          ? `<p class="price">&#8377;${course.price}</p>`
          : '';

        // UPI pay block if there's both a price and a UPI ID; "Contact
        // to Enroll" if there's a price but no UPI ID set yet;
        // otherwise treat it like the existing Drida Batches course -
        // access via member login, no payment involved.
        const ctaHtml = (course.upiId && course.price)
          ? buildUpiPayBlock(course)
          : course.price
            ? `<a class="btn" href="#contact">Contact to Enroll</a>`
            : `<a class="btn" href="login.html">Member Login</a>`;

        const card = document.createElement('div');
        card.className = 'card';
        // ID lets offering-tile links like #course-meditation jump straight here.
        // Derived from the course title: "Summer Yoga Batch" → "course-summer-yoga-batch"
        card.id = 'course-' + (course.title || doc.id)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        card.innerHTML = `
          ${posterHtml}
          <h3></h3>
          <p></p>
          ${priceHtml}
          ${ctaHtml}
        `;
        // Set title/description as text (not innerHTML) so a course
        // name typed in the Firebase Console can never inject HTML.
        card.querySelector('h3').textContent = course.title || 'Untitled course';
        card.querySelector('p').textContent = course.description || '';
        list.appendChild(card);
      });
    })
    .catch((error) => {
      console.error('Could not load public courses, showing defaults instead:', error);
    });
}

loadPublicCourses();
