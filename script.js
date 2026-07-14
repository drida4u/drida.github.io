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