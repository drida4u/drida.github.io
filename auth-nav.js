// ============================================================
// AUTH NAV — included on every page (no Firebase needed)
// ------------------------------------------------------------
// login.js saves {phone, uid} to localStorage on successful login.
// logout clears it. This file reads that to update the nav instantly
// on every page without loading the Firebase SDK.
// ============================================================

(function () {
  function updateNav() {
    const saved = localStorage.getItem('drida-user');
    const loginLink = document.querySelector('nav a[href="login.html"]');
    if (!loginLink) return;

    if (saved) {
      loginLink.textContent = 'My Courses';
      loginLink.href = 'my-courses.html';

      if (!document.getElementById('nav-logout')) {
        const logoutA = document.createElement('a');
        logoutA.id = 'nav-logout';
        logoutA.href = '#';
        logoutA.textContent = 'Log Out';
        logoutA.style.cssText = 'font-size:0.82rem;opacity:0.65;';
        logoutA.addEventListener('click', function (e) {
          e.preventDefault();
          localStorage.removeItem('drida-user');
          // Also sign out of Firebase if it's loaded on this page
          if (typeof auth !== 'undefined') {
            auth.signOut().catch(function(){});
          }
          window.location.href = 'index.html';
        });
        loginLink.parentNode.insertBefore(logoutA, loginLink.nextSibling);
      }
    } else {
      loginLink.textContent = 'Login';
      loginLink.href = 'login.html';
      const existing = document.getElementById('nav-logout');
      if (existing) existing.remove();
    }
  }

  // Run immediately if DOM is ready, else wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNav);
  } else {
    updateNav();
  }
})();
