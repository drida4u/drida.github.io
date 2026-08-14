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
// courseContent/{courseId} document shape — two options:
//
//  OPTION A — Playlist (recommended, simplest):
//   { playlist: "PLTClT_B0t4lAxxxxxxxx" }
//   Just the playlist ID (the part after ?list= in the YouTube URL).
//   New videos added to the YouTube playlist appear here automatically.
//
//  OPTION B — Individual videos:
//   { videos: ["https://youtube.com/watch?v=...", ...] }
//   List each session link. Add/reorder in Firebase Console anytime.
//
// (Older docs with a single "link" field still work — shown as Session 1.)
// ============================================================

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  const phoneEl = document.getElementById('user-phone');
  if (phoneEl) {
    // Show display name from Google if available, otherwise email or phone
    const saved = JSON.parse(localStorage.getItem('drida-user') || '{}');
    const label = saved.name || user.displayName || saved.email || saved.phone || '';
    phoneEl.textContent = label ? 'Welcome, ' + label : '';
  }
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

          // ── Determine what to render ──────────────────────────────
          // Priority: playlist field > videos array > legacy link field
          const playlistId = content.playlist
            ? content.playlist.replace(/^.*[?&]list=/, '').split('&')[0] // handle full URL or bare ID
            : null;

          const videos = !playlistId && Array.isArray(content.videos) && content.videos.length
            ? content.videos
            : (!playlistId && content.link ? [content.link] : []);

          // Convert any YouTube watch/share URL to an embeddable src
          function toEmbedUrl(url) {
            try {
              const u = new URL(url);
              let id = u.searchParams.get('v');
              if (!id && u.hostname === 'youtu.be') id = u.pathname.slice(1);
              if (!id && u.pathname.includes('/embed/')) return url;
              return id ? 'https://www.youtube.com/embed/' + id : null;
            } catch { return null; }
          }

          let playlistHtml;
          if (playlistId) {
            // Embed the whole playlist — one player, browse all sessions inside
            const embedSrc = `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0`;
            playlistHtml = `
              <div style="position:relative;padding-bottom:56.25%;height:0;border-radius:10px;overflow:hidden;background:#000;margin-top:0.75rem;">
                <iframe src="${embedSrc}" title="${course.title} — full playlist"
                  style="position:absolute;inset:0;width:100%;height:100%;border:none;"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen loading="lazy"></iframe>
              </div>
              <p style="font-size:0.78rem;color:var(--muted);margin-top:0.5rem;text-align:right;">
                <a href="https://www.youtube.com/playlist?list=${playlistId}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);">Open full playlist on YouTube ↗</a>
              </p>`;
          } else if (videos.length) {
            playlistHtml = videos.map((url, i) => {
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
            }).join('');
          } else {
            playlistHtml = '<p style="color:var(--muted);">Videos for this course will appear here once added.</p>';
          }

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
