/**
 * drida-effects.js — Modern hi-fi animations for the Drida website
 * Effects: scroll progress, counter, scroll reveal, sticky header,
 *          back-to-top, button ripple, hero parallax, pillar tilt,
 *          FAQ smooth open, image lazy-fade
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. SCROLL PROGRESS BAR (thin crimson line at very top)
  ───────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'drida-progress';
  progressBar.setAttribute('aria-hidden', 'true');
  document.body.prepend(progressBar);

  /* ─────────────────────────────────────────
     2. BACK-TO-TOP BUTTON
  ───────────────────────────────────────── */
  const btt = document.createElement('button');
  btt.id = 'back-to-top';
  btt.setAttribute('aria-label', 'Back to top');
  btt.innerHTML =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
  document.body.appendChild(btt);

  btt.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────
     3. SCROLL EVENT — progress bar + sticky header + back-to-top visibility
  ───────────────────────────────────────── */
  const header = document.querySelector('header');

  function onScroll() {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var pct = total > 0 ? (scrolled / total) * 100 : 0;

    // Progress bar
    progressBar.style.width = pct + '%';

    // Sticky header — compact after 80px
    if (scrolled > 80) {
      header && header.classList.add('header-scrolled');
    } else {
      header && header.classList.remove('header-scrolled');
    }

    // Back-to-top
    if (scrolled > 400) {
      btt.classList.add('visible');
    } else {
      btt.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ─────────────────────────────────────────
     4. HERO PARALLAX (subtle — moves the hero photo on scroll)
  ───────────────────────────────────────── */
  var heroPhoto = document.querySelector('.hero-photo img');

  if (heroPhoto) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      // Only while hero is visible (first ~88vh)
      if (scrolled < window.innerHeight) {
        heroPhoto.style.transform = 'translateY(' + (scrolled * 0.18) + 'px)';
      }
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     5. COUNTER ANIMATION
     HTML must have data-count="7000" data-suffix="+" on .stat-num
  ───────────────────────────────────────── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el, target, suffix, duration) {
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeOutCubic(progress);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ─────────────────────────────────────────
     6. INTERSECTION OBSERVER — scroll reveal + counter trigger
  ───────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');
  var statNums  = document.querySelectorAll('.stat-num[data-count]');

  var countersDone = false;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function (el) { observer.observe(el); });

  // Counter observer (fires once when .impact-stats enters view)
  var impactStats = document.querySelector('.impact-stats');
  if (impactStats && statNums.length) {
    var counterObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !countersDone) {
        countersDone = true;
        statNums.forEach(function (el) {
          var target = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, suffix, 1800);
        });
        counterObserver.disconnect();
      }
    }, { threshold: 0.3 });
    counterObserver.observe(impactStats);
  }

  /* ─────────────────────────────────────────
     7. BUTTON RIPPLE EFFECT
  ───────────────────────────────────────── */
  function addRipple(e) {
    var btn = e.currentTarget;
    var existing = btn.querySelector('.ripple');
    if (existing) existing.remove();

    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;
    var x = e.clientX - rect.left - size / 2;
    var y = e.clientY - rect.top  - size / 2;

    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText =
      'width:' + size + 'px;height:' + size + 'px;' +
      'left:' + x + 'px;top:' + y + 'px;';
    btn.appendChild(ripple);

    ripple.addEventListener('animationend', function () { ripple.remove(); });
  }

  var rippleBtns = document.querySelectorAll(
    '.btn-terra, .btn-white-pill, .btn, .btn-outline, .footer-subscribe-btn'
  );
  rippleBtns.forEach(function (btn) {
    btn.addEventListener('click', addRipple);
  });

  /* ─────────────────────────────────────────
     8. PILLAR CARD — 3D TILT ON MOUSE MOVE
  ───────────────────────────────────────── */
  var pillarCards = document.querySelectorAll('.pillar-card');

  pillarCards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width  / 2;
      var cy = rect.top  + rect.height / 2;
      var dx = (e.clientX - cx) / (rect.width  / 2);   // -1 … +1
      var dy = (e.clientY - cy) / (rect.height / 2);   // -1 … +1
      var tiltX = -dy * 8;   // degrees
      var tiltY =  dx * 8;
      card.style.transform =
        'perspective(600px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) scale(1.04)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'transform 0.45s ease';
      setTimeout(function () { card.style.transition = ''; }, 450);
    });
  });

  /* ─────────────────────────────────────────
     9. FAQ — SMOOTH OPEN / CLOSE ANIMATION
     (details/summary don't animate natively; we fake it)
  ───────────────────────────────────────── */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (details) {
    var summary = details.querySelector('summary');
    var content = details.querySelector('.faq-ans');

    if (!summary || !content) return;

    // Hide content initially — we control display via max-height
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.38s ease, opacity 0.3s ease, padding 0.3s ease';
    content.style.maxHeight = '0';
    content.style.opacity   = '0';

    summary.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = details.hasAttribute('open');

      if (isOpen) {
        // Close
        content.style.maxHeight = '0';
        content.style.opacity   = '0';
        content.style.paddingTop = '0';
        setTimeout(function () { details.removeAttribute('open'); }, 380);
      } else {
        // Open — set open first so content is in DOM, then animate
        details.setAttribute('open', '');
        var targetH = content.scrollHeight + 'px';
        // Force reflow
        content.getBoundingClientRect();
        content.style.maxHeight  = targetH;
        content.style.opacity    = '1';
        content.style.paddingTop = '0.6rem';
      }
    });
  });

  /* ─────────────────────────────────────────
     10. IMAGE LAZY-FADE — images fade in when loaded/visible
  ───────────────────────────────────────── */
  var lazyImgs = document.querySelectorAll('img[loading="lazy"], .card img, .program-img img, .about-photo-wrap img, .band-photo img');

  var imgObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        if (img.complete) {
          img.classList.add('img-loaded');
        } else {
          img.addEventListener('load', function () { img.classList.add('img-loaded'); }, { once: true });
        }
        imgObserver.unobserve(img);
      }
    });
  }, { threshold: 0.05 });

  lazyImgs.forEach(function (img) { imgObserver.observe(img); });

  /* ─────────────────────────────────────────
     11. STEP NUMBER STAGGER REVEAL
  ───────────────────────────────────────── */
  var steps = document.querySelectorAll('.step');
  steps.forEach(function (step, i) {
    step.classList.add('reveal');
    step.style.transitionDelay = (i * 0.12) + 's';
    observer.observe(step);
  });

  /* ─────────────────────────────────────────
     12. CARD GRID STAGGER REVEAL
  ───────────────────────────────────────── */
  var cards = document.querySelectorAll('.card');
  cards.forEach(function (card, i) {
    card.classList.add('reveal');
    card.style.transitionDelay = (i % 3 * 0.1) + 's';
    observer.observe(card);
  });

})();

  /* ─────────────────────────────────────────
     13. CHAT SUPPORT WIDGET (Coming Soon)
     Floating bubble — bottom right.
     Update phone number before go-live.
  ───────────────────────────────────────── */
  (function () {
    var PHONE   = '918075471581';          // ← UPDATE before go-live
    var EMAIL   = 'drida4u@gmail.com';
    var WA_TEXT = encodeURIComponent("Hi Drida! I'd like some support.");

    // Inject button
    var btn = document.createElement('button');
    btn.id = 'drida-chat-btn';
    btn.setAttribute('aria-label', 'Support — coming soon');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    document.body.appendChild(btn);

    // Inject popup
    var popup = document.createElement('div');
    popup.id = 'drida-chat-popup';
    popup.setAttribute('hidden', '');
    popup.innerHTML =
      '<div class="chat-popup-header">' +
        '<span>Support</span>' +
        '<button id="drida-chat-close" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="chat-popup-body">' +
        '<div class="chat-soon-badge">Coming Soon</div>' +
        '<p>Live chat is on its way! For now, reach us at:</p>' +
        '<a class="chat-contact-link" href="mailto:' + EMAIL + '">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' +
          EMAIL +
        '</a>' +
        '<a class="chat-contact-link" href="tel:+' + PHONE + '">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
          '+' + PHONE.replace('91','91 ') +
        '</a>' +
        '<a class="chat-contact-link chat-wa-link" href="https://wa.me/' + PHONE + '?text=' + WA_TEXT + '" target="_blank" rel="noopener">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>' +
          'WhatsApp Us' +
        '</a>' +
      '</div>';
    document.body.appendChild(popup);

    // Toggle
    btn.addEventListener('click', function () {
      if (popup.hasAttribute('hidden')) {
        popup.removeAttribute('hidden');
      } else {
        popup.setAttribute('hidden', '');
      }
    });
    document.getElementById('drida-chat-close').addEventListener('click', function () {
      popup.setAttribute('hidden', '');
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !popup.contains(e.target)) {
        popup.setAttribute('hidden', '');
      }
    });
  }());
