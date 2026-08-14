// ── Theme toggle ────────────────────────────────────────────────────────────
// Cycles: light → pastel → dark → light
// Icons (CSS-driven): 🎨 in light, 🌙 in pastel, ☀ in dark
(() => {
  const STORAGE_KEY = 'drida-theme';
  const THEMES = ['light', 'pastel', 'pastel-dark', 'pastel-bright', 'pastel-green', 'claude', 'dark', 'terra'];
  const root = document.documentElement;

  function getTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.includes(saved)) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  applyTheme(getTheme());

  function wireToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'light';
      const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireToggle);
  } else {
    wireToggle();
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) applyTheme(e.matches ? 'dark' : 'light');
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
  // Also include divs that already have .reveal in their HTML (e.g. founder-spotlight)
  const revealTargets = document.querySelectorAll("main section, .card, .reveal");
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

// ---------- Pillar row: hover zoom (desktop) + swipe carousel (mobile) ----------
// On desktop (pointer: fine) the card you hover zooms forward and the others ease back.
// On mobile the cards become a horizontal scroll-snap carousel with dot indicators.
(() => {
  const cards = document.querySelectorAll(".pillar-card");
  if (!cards.length) return;
  const row = document.querySelector(".pillar-row");
  if (!row) return;

  // Desktop hover zoom — only on mouse/trackpad, not touch
  if (window.matchMedia("(pointer: fine)").matches) {
    const setActive = active => {
      cards.forEach(card => {
        card.classList.toggle("is-active", card === active);
        card.classList.toggle("is-dimmed", !!active && card !== active);
      });
    };
    cards.forEach(card => {
      card.addEventListener("mouseenter", () => setActive(card));
      card.addEventListener("mouseleave", () => setActive(null));
      card.addEventListener("focus",      () => setActive(card));
      card.addEventListener("blur",       () => setActive(null));
    });
  }

  // Carousel dot indicators — JS injects them; CSS shows/hides per breakpoint
  const dots = document.createElement("div");
  dots.className = "pillar-dots";
  dots.setAttribute("aria-hidden", "true");
  dots.innerHTML = Array.from(cards).map((_, i) =>
    `<span class="pillar-dot${i === 0 ? " is-active" : ""}"></span>`
  ).join("");
  row.parentNode.insertBefore(dots, row.nextSibling);

  const allDots = dots.querySelectorAll(".pillar-dot");

  // Find which card's centre is closest to the scroll container's centre
  const updateDots = () => {
    const rowCentre = row.scrollLeft + row.offsetWidth / 2;
    let closest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs((card.offsetLeft + card.offsetWidth / 2) - rowCentre);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    allDots.forEach((d, i) => d.classList.toggle("is-active", i === closest));
  };
  row.addEventListener("scroll", updateDots, { passive: true });

  // Tap a dot → scroll that card to centre
  allDots.forEach((dot, i) => {
    dot.style.cursor = "pointer";
    dot.addEventListener("click", () => {
      cards[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
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