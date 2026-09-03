// ── Theme toggle ────────────────────────────────────────────────────────────
// Simple Light / Dark switch. Each page has its own chakra colour FAMILY
// (a full matching light-theme name + dark-theme name, both built with the
// same depth as the original light/dark and pastel/pastel-dark pairs in
// style.css). The toggle only ever flips light↔dark WITHIN a page's family
// — it never mixes families, so every page keeps its own identity colour
// whichever mode the visitor is in.
// Rainbow order reused across pages: red → orange → yellow → green → blue
// → indigo → violet → (repeats).
(() => {
  const STORAGE_KEY = 'drida-theme-mode'; // stores 'light' or 'dark' only
  const root = document.documentElement;

  // Order follows the ACTUAL nav click-through sequence (not filename order):
  // Home → Offerings(=meditation.html) → Courses → Experiences(=trips.html)
  // → Products → About Us(=about.html, merged with old Drida Family)
  // → Drida Stories(=stories.html) → Support
  //
  // Reverted (2026-08-14): the "shift colours right by 1" rotation tried
  // earlier today put "claude" on Offerings and didn't read well there, so
  // this is back to each page's original colour. The vivid yellow/green
  // accent update (yellow-dark's gold, green-dark's apple-green pulled into
  // the light "yellow"/"pastel-green" themes) is unrelated and stays.
  const FAMILY_BY_PAGE = {
    'index.html':          { light: 'light',         dark: 'dark' },        // 1 red     — Home
    '':                    { light: 'light',         dark: 'dark' },        //   red (root path)
    'meditation.html':     { light: 'orange',        dark: 'orange-dark' }, // 2 orange  — Offerings (legacy page)
    'offerings.html':      { light: 'orange',        dark: 'orange-dark' }, // 2 orange  — Offerings
    'courses.html':        { light: 'yellow',        dark: 'yellow-dark' }, // 3 yellow  — Courses
    'trips.html':          { light: 'pastel-green',  dark: 'green-dark' },  // 4 green   — Experiences
    'products.html':       { light: 'pastel-bright', dark: 'blue-dark' },   // 5 blue    — Products
    'meetups.html':        { light: 'indigo',        dark: 'indigo-dark' }, //   retired page, kept matching about.html
    'about.html':          { light: 'indigo',        dark: 'indigo-dark' }, // 6 indigo  — About Us (merged w/ Drida Family)
    'login.html':          { light: 'light',         dark: 'dark' },       //   red (cycle repeats) — Login
    'support.html':        { light: 'terra',         dark: 'claude' },     //   terracotta/plum — Support
    'my-courses.html':     { light: 'yellow',        dark: 'yellow-dark' },//   yellow (not in main nav)
    'privacy-policy.html': { light: 'pastel-green',  dark: 'green-dark' }, //   green (not in main nav)
    'stories.html':        { light: 'violet',        dark: 'violet-dark' },// 7 violet  — Drida Stories
  };
  const DEFAULT_FAMILY = { light: 'light', dark: 'dark' };

  function getPageFamily() {
    // Clean URLs (e.g. /offerings, added via .htaccess) no longer end in
    // ".html", so normalise back to the .html key this table uses before
    // looking it up — otherwise every page silently fell back to red.
    let page = location.pathname.split('/').pop();
    if (page && !page.endsWith('.html')) page = page + '.html';
    return FAMILY_BY_PAGE[page] || DEFAULT_FAMILY;
  }

  function getMode() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyMode(mode) {
    const family = getPageFamily();
    root.setAttribute('data-theme', family[mode]);
  }

  applyMode(getMode());

  function wireToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = getMode();
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      applyMode(next);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireToggle);
  } else {
    wireToggle();
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) applyMode(e.matches ? 'dark' : 'light');
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

// ---------- Course card "selected" state ----------
// Left accent border stays a subtle neutral shade by default (see
// .course-card in style.css) and only switches to the theme accent colour
// when a card is hovered, keyboard-focused, or tapped/selected — same rule
// on every page that uses .course-card.
(() => {
  const cards = document.querySelectorAll(".course-card");
  if (!cards.length) return;
  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      // Don't hijack clicks on the card's own link/button.
      if (e.target.closest("a, button")) return;
      cards.forEach(c => { if (c !== card) c.classList.remove("selected"); });
      card.classList.toggle("selected");
    });
  });
})();

// ---------- Footer newsletter form ----------
// No backend/list service wired up yet, so submissions open a pre-filled
// email to Drida's inbox (drida4u@gmail.com) with the entered details,
// same as every other "contact us" link on the site. Swap this out for a
// real form service (Google Form / Mailchimp / etc.) once one is chosen.
(() => {
  const form = document.getElementById("newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const subject = encodeURIComponent("Newsletter Signup — Drida");
    const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}`);
    window.location.href = `mailto:drida4u@gmail.com?subject=${subject}&body=${body}`;
  });
})();

// ---------- Click-to-enlarge image lightbox (site-wide) ----------
// Any content image inside <main> opens full-size in a popup on click.
// Deliberately scoped to <main> only so header/footer logos, nav icons and
// the fixed watermark bubble stay untouched — an <img class="no-lightbox">
// on any element opts it out individually if a future image needs that.
// Images that are already the clickable content of a link are also
// skipped, since a lightbox would fight with the link's own navigation.
(() => {
  function openLightbox(src, alt) {
    const overlay = document.createElement("div");
    overlay.className = "img-lightbox-overlay";
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    const closeBtn = document.createElement("button");
    closeBtn.className = "img-lightbox-close";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "×";
    overlay.appendChild(img);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    function close() {
      overlay.remove();
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    }
    function onKey(e) { if (e.key === "Escape") close(); }
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
  }

  document.addEventListener("click", (e) => {
    const img = e.target.closest("img");
    if (!img) return;
    if (!img.closest("main")) return;
    if (img.closest("a, button")) return;
    if (img.classList.contains("no-lightbox")) return;
    openLightbox(img.currentSrc || img.src, img.alt);
  });
})();