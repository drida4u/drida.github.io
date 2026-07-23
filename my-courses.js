// ============================================================
// MY COURSES PAGE
// ------------------------------------------------------------
// Shows only the courses this logged-in user is enrolled in.
// The actual YouTube playlist (an array of links, one per session)
// lives in a separate "courseContent" collection that Firestore
// Rules only release if this user's own profile lists that course
// in enrolledCourses. So even if someone reads this JavaScript,
// they can't see links they're not enrolled in - the real
// protection happens on Firebase's side, not in this file.
//
// courseContent/{courseId} document shape:
//   { videos: ["https://youtube.com/...", "https://youtube.com/..."] }
// Add/reorder links any time in the Firebase Console - no code
// changes needed. (Older courses may still have the previous single
// "link" field; that's handled below too, shown as "Session 1".)
// ============================================================

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  const phoneEl = document.getElementById('user-phone');
  if (phoneEl) phoneEl.textContent = 'Logged in as ' + user.phoneNumber;
  loadMyCourses(user.uid);
});

function loadMyCourses(uid) {
  const list = document.getElementById('course-list');
  list.innerHTML = 'Loading your courses...';

  db.collection('users').doc(uid).get()
    .then((userDoc) => {
      const enrolledCourses = (userDoc.exists && userDoc.data().enrolledCourses) || [];

      if (enrolledCourses.length === 0) {
        list.innerHTML = '<p>You are not enrolled in any courses yet. Contact Drida to get enrolled.</p>';
        return;
      }

      list.innerHTML = '';
      enrolledCourses.forEach((courseId) => {
        Promise.all([
          db.collection('courses').doc(courseId).get(),
          db.collection('courseContent').doc(courseId).get()
        ]).then(([courseDoc, contentDoc]) => {
          if (!courseDoc.exists) return;
          const course = courseDoc.data();
          const content = contentDoc.exists ? contentDoc.data() : {};

          // Support both the new "videos" array (a real playlist) and
          // the older single "link" field, so nothing breaks for a
          // course that hasn't been updated to the new shape yet.
          const videos = Array.isArray(content.videos) && content.videos.length
            ? content.videos
            : (content.link ? [content.link] : []);

          // Convert any YouTube URL to an embeddable src
          function toEmbedUrl(url) {
            try {
              const u = new URL(url);
              let id = u.searchParams.get('v'); // youtube.com/watch?v=ID
              if (!id && u.hostname === 'youtu.be') id = u.pathname.slice(1); // youtu.be/ID
              if (!id && u.pathname.includes('/embed/')) return url; // already embed URL
              return id ? 'https://www.youtube.com/embed/' + id : null;
            } catch { return null; }
          }

          const playlistHtml = videos.length
            ? videos.map((url, i) => {
                const embedSrc = toEmbedUrl(url);
                return embedSrc
                  ? `<div style="margin-bottom:1.25rem;">
                       <p style="font-size:0.85rem;font-weight:600;color:var(--muted);margin-bottom:0.4rem;">Session ${i + 1}</p>
                       <div style="position:relative;padding-bottom:56.25%;height:0;border-radius:10px;overflow:hidden;background:#000;">
                         <iframe src="${embedSrc}" title="Session ${i + 1}"
                           style="position:absolute;inset:0;width:100%;height:100%;border:none;"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowfullscreen loading="lazy"></iframe>
                       </div>
                     </div>`
                  : `<p><a href="${url}" target="_blank" rel="noopener noreferrer">Session ${i + 1}</a></p>`;
              }).join('')
            : '<p style="color:var(--muted);">Videos for this course will appear here once added.</p>';

          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description || ''}</p>
            ${playlistHtml}
          `;
          list.appendChild(card);
        });
      });
    })
    .catch((error) => {
      list.innerHTML = '<p>Something went wrong loading your courses: ' + error.message + '</p>';
    });
}

const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('drida-user');
    auth.signOut().then(() => {
      window.location.href = 'index.html';
    });
  });
}
