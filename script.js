// ── Theme toggle ────────────────────────────────────────────────────────────
// Reads saved preference from localStorage. Falls back to device preference.
// Injects a sun/moon button into the nav on every page automatically.
(() => {
  const STORAGE_KEY = 'drida-theme';
  const root = document.documentElement;

  // SVG icons
  const sunSVG = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const moonSVG = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

  function isDark() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = dark ? sunSVG : moonSVG;
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  function injectButton() {
    const nav = document.querySelector('.topbar nav');
    if (!nav || document.getElementById('theme-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    nav.appendChild(btn);
    btn.addEventListener('click', () => {
      const nowDark = root.getAttribute('data-theme') === 'dark';
      localStorage.setItem(STORAGE_KEY, nowDark ? 'light' : 'dark');
      applyTheme(!nowDark);
    });
  }

  // Apply immediately on load, then inject button once DOM is ready
  applyTheme(isDark());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { injectButton(); applyTheme(isDark()); });
  } else {
    injectButton();
  }

  // Also react if user changes system preference while on the page
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches);
  });
})();

// ---------- Mobile hamburger nav ----------
// Injects a ☰ button into the topbar on every page. On phones the nav links
// collapse into a dropdown; the button animates to × when open.
(() => {
  function injectHamburger() {
    const topbar = document.querySelector('.topbar');
    const nav    = document.querySelector('.topbar nav');
    if (!topbar || !nav || document.getElementById('nav-toggle')) return;

    const ham = document.createElement('button');
    ham.id   = 'nav-toggle';
    ham.type = 'button';
    ham.setAttribute('aria-label', 'Open navigation menu');
    ham.setAttribute('aria-expanded', 'false');
    ham.innerHTML = '<span></span><span></span><span></span>';
    topbar.appendChild(ham);

    const close = () => {
      nav.classList.remove('nav-open');
      ham.classList.remove('is-open');
      ham.setAttribute('aria-expanded', 'false');
    };

    ham.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('nav-open');
      ham.classList.toggle('is-open', isOpen);
      ham.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on outside tap
    document.addEventListener('click', e => {
      if (!topbar.contains(e.target)) close();
    });

    // Close when a link inside the dropdown is tapped
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectHamburger);
  } else {
    injectHamburger();
  }
})();

// JavaScript adds behavior/interactivity. This runs after the page loads.

// Find the <span id="year"> in the HTML and fill it with the current year,
// so the footer copyright stays correct automatically.
const yearSpan = document.getElementById("year");
yearSpan.textContent = new Date().getFullYear();

// Example of interactivity: log a message when any nav link is clicked.
// Open the browser console (right-click page > Inspect > Console) to see it.
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    console.log("Navigating to:", link.getAttribute("href"));
  });
});

// ---------- Scroll-triggered reveal animations ----------
// Sections and cards fade + slide into view as you scroll down, instead
// of just appearing instantly - the "dynamic, not static" feel Sara asked
// for (modeled on isha.sadhguru.org / kasarnaturals.com). Runs on every
// page automatically - no need to edit each page's HTML.
(() => {
  const revealTargets = document.querySelectorAll("main section, .card");
  revealTargets.forEach(el => el.classList.add("reveal"));

  // Stagger cards inside the same grid so they don't all pop in at once.
  document.querySelectorAll(".card-grid").forEach(grid => {
    Array.from(grid.children).forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealTargets.forEach(el => observer.observe(el));
  } else {
    // No IntersectionObserver support - just show everything immediately.
    revealTargets.forEach(el => el.classList.add("is-visible"));
  }
})();

// ---------- Navbar reacts to scroll ----------
// Shrinks slightly and gains a stronger shadow once you scroll past the
// top of the page, like most modern sites' "shrinking sticky header".
(() => {
  const topbar = document.querySelector(".topbar");
  if (!topbar) return;
  window.addEventListener("scroll", () => {
    topbar.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });
})();

// ---------- Pillar row: hover/tap zoom ----------
// The card you point at (or tap, on touch) zooms forward and the other
// two ease back - the "navigate to a rectangle and it zooms in/out"
// effect from isha.sadhguru.org's Man/Mystic/Mission cards.
(() => {
  const cards = document.querySelectorAll(".pillar-card");
  if (!cards.length) return;

  const setActive = active => {
    cards.forEach(card => {
      card.classList.toggle("is-active", card === active);
      card.classList.toggle("is-dimmed", !!active && card !== active);
    });
  };

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => setActive(card));
    card.addEventListener("mouseleave", () => setActive(null));
    card.addEventListener("focus", () => setActive(card));
    card.addEventListener("blur", () => setActive(null));
    card.addEventListener("touchstart", () => setActive(card), { passive: true });
  });
})();

// ---------- Hero parallax ----------
// The hero heading/text drift upward slightly and fade a touch as you
// scroll past them, giving the header some depth instead of feeling flat.
(() => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const heroText = hero.querySelectorAll("h1, p");
  if (!heroText.length) return;
  window.addEventListener("scroll", () => {
    const offset = Math.min(window.scrollY, 300);
    heroText.forEach(el => {
      el.style.transform = `translateY(${offset * 0.15}px)`;
      el.style.opacity = Math.max(1 - offset / 380, 0.35);
    });
  }, { passive: true });
})();