# Drida Website — Full Project Summary
*Use this document to resume work in a new Claude conversation.*

---

## 1. What Is This Project?

**Drida** (formerly PV, rebranded 2025) is a non-profit organisation founded by **Smitha Haridas** that offers meditation, yoga, and fitness courses with a focus on women's empowerment, and provides free education for children in need.

**Website:** https://drida4u.github.io  
**Current repo:** Local files on Sara's Mac at `/Users/sara/Desktop/drida_code/website/`  
**Hosting:** GitHub Pages (not yet pushed — Sara pushes manually when ready)  
**Email:** drida4u@gmail.com  
**WhatsApp (Smitha mam):** +91 80754 71581  
**YouTube:** https://youtube.com/@drida_life  
**Instagram:** https://www.instagram.com/d_r_i_d_a_/  
**Facebook:** https://www.facebook.com/profile.php?id=61579257953722  

---

## 2. Tech Stack (Current Static Site)

| Layer | Technology |
|---|---|
| Structure | HTML5 (7 pages) |
| Styling | CSS custom properties, no framework |
| Interactivity | Vanilla JS (script.js) |
| Auth | Firebase Authentication (phone OTP) |
| Database | Firebase Firestore |
| Hosting | GitHub Pages |
| Fonts | Cormorant Garamond (headings) + Inter (body) + Poppins (brand) |

**CSS version:** v15  
**JS version:** v3  
**Theme system:** `data-theme` attribute on `<html>`, toggled by JS, persisted in `localStorage('drida-theme')`  
**Anti-FOUC:** Inline script in `<head>` reads localStorage before page paints  

---

## 3. The 7 HTML Pages

| File | Purpose |
|---|---|
| `index.html` | Main homepage |
| `courses.html` | All courses with filter/sort bar |
| `trips.html` | Pilgrimages and events |
| `products.html` | Kasar Naturals, crystals, EK.SEL4U nightwear |
| `meetups.html` | 14 batch meet-up video recordings |
| `login.html` | Firebase phone OTP login |
| `my-courses.html` | Enrolled courses (post-login) |

---

## 4. Key Design Decisions

- **Accent colour:** `#cc2828` (Drida red), gradient: red → orange → golden yellow
- **Light theme:** Warm parchment cream `#faf7f3` — NOT pure white
- **Dark theme:** Deep warm purple-black, toggled via `[data-theme="dark"]`
- **Logo bubble:** Fixed centred watermark in background with pulsing solar halo
  - Light mode: regular `drida_logo.svg`
  - Dark mode: `drida_logo_white.svg`
- **Section types:**
  - `.section-warm` — full-width warm cream/purple band
  - `.section-deep` — dark impact section
  - `.band-cta` — gradient CTA band (used for free batch enrolment)
  - `.band-dark` — dark volunteer/donate bands
- **Pillar cards:** 3 overlapping portrait cards (Meditation/Yoga/Fitness), desktop hover-zoom, mobile scroll-snap carousel with dot indicators

---

## 5. All Completed Changes (Across Sessions)

### Session 1 (earlier context — summarised)
- Built the full static site from scratch (all 7 pages)
- Implemented light/dark theme toggle with anti-FOUC
- Built pillar row with hover zoom + mobile carousel + dot indicators
- Added Firebase Auth skeleton (phone OTP login page)
- Added course filter/sort bar on courses.html (filter by Free/Paid/Live/Coming Soon, sort by Latest/A–Z, default: Latest First)
- Fixed `.card img` to use `object-fit: cover` (no black gaps on photo cards)
- Fixed `.course-poster` to use `object-fit: contain` + `max-height: 360px` (no cropping of info-heavy posters)
- Fixed light theme halo opacity (cream bg needs ~2× opacity vs dark bg)
- Fixed white logo appearing in light mode (only `[data-theme="dark"]` gets `drida_logo_white.svg`)
- Fixed dark theme visibility: badge colours, founder highlight bg, section-warm bg, offering photo borders

### This Session (v14 → v15)
- **Secondary topstrip** added to all 7 pages — thin strip above main nav with YouTube/Instagram/WhatsApp/Facebook icons + "Free Batch" shortcut + gradient "Donate" button. Scrolls away on scroll (main nav sticks). Works in light + dark mode.
- **Botanical dividers** made more prominent — full-width hairline rules flanking the leaf ornament, opacity bumped from 0.75 → 0.90
- **Rich multi-column footer** added to all 7 pages (replacing 2-line minimal footer):
  - Top: white logo + tagline + "Subscribe on YouTube" gradient button
  - 4 columns: Explore / Offerings / Get Involved / Connect
  - Bottom bar: copyright (auto year) + 4 circular social icons + legal links
  - Always dark background regardless of page theme
  - Fully responsive (2 columns tablet, 1 column mobile)

---

## 6. Pending Items (Still To Do on Static Site)

| Item | Notes |
|---|---|
| Firebase credentials | `firebaseConfig` in login.html still has placeholder values — replace with real Firebase project keys |
| YouTube embedding | Enable "Allow embedding" on each video in YouTube Studio → Content → Edit → Show More → License & Distribution |
| Meetups.html content | Embed actual 14 batch meet-up video recordings (get YouTube video IDs from Smitha mam) |
| UPI QR code | Replace `drida@ybl` placeholder with Smitha mam's actual UPI ID before go-live |
| ⚠️ Refund policy — confirm with Smitha mam | `privacy-policy.html` has draft refund terms (full refund before course starts, 50% within 2 sessions, no refund after). Smitha mam must review and confirm the actual terms she wants before going live |
| Custom domain | Buy domain (~₹800–1,200/year) and add CNAME to GitHub Pages settings |
| Admin dashboard | `admin.html` for Smitha mam to view enrolled/dropped users (reads Firestore) |
| Drida members list | Ask Smitha mam for Excel (name, mobile, email) to pre-populate Firestore |
| Firestore security rules | Tighten rules before launch (currently open) |
| **Push to GitHub** | **ONLY when Sara explicitly asks — do not push automatically** |

---

## 7. Critical Standing Rules (Do Not Violate)

1. **Do NOT push to GitHub** until Sara explicitly says so
2. **UPI ID placeholder** `drida@ybl` — replace with real UPI ID only before go-live
3. **Do NOT remove** the `logo-float-bubble` from any page
4. **Do NOT change things** without asking Sara first

---

---

# PART 2 — WordPress Migration Plan

*This is a separate topic for a new conversation/project.*

---

## Why Consider WordPress?

The current static site works well as an MVP but has one major long-term problem: **Smitha mam cannot manage it herself**. Every content change (new course, updated price, new event) needs Sara to edit HTML and push to GitHub. For a non-profit to be self-sufficient, the CMS must be accessible to non-technical users.

The original reason for NOT using WordPress was the cost of a phone OTP plugin (₹3,000–8,000/year). Once Drida has funds and is willing to pay this, WordPress becomes the clearly better long-term choice.

---

## What WordPress Gives You (That Static Site Cannot Easily Do)

| Feature | Static Site | WordPress |
|---|---|---|
| Smitha mam edits content herself | ❌ Needs Sara | ✅ Built-in CMS |
| Add new courses without code | ❌ | ✅ |
| Student enrollment management | ❌ Must build from scratch | ✅ WooCommerce |
| Payment collection + receipts | ❌ Must build | ✅ Razorpay + WooCommerce |
| Admin dashboard (view students) | ❌ Must build admin.html | ✅ WordPress admin |
| Email to enrolled students | ❌ Manual | ✅ Plugins |
| Course progress / certificates | ❌ Very hard to build | ✅ LMS plugins |
| Blog / news / announcements | ❌ Static HTML | ✅ Built-in |
| Phone OTP login | ✅ Firebase (free) | ✅ Paid plugin |
| Hosting cost | ✅ Free (GitHub Pages) | ₹3,000–5,000/year |

---

## Recommended WordPress Stack for Drida

### Core
- **WordPress** (free, self-hosted)
- **WooCommerce** (free plugin) — handles products, payments, orders, customers
- **Razorpay for WooCommerce** (free plugin) — India payment gateway (UPI, cards, net banking)

### Phone OTP Login
- **WooCommerce Phone Number OTP Login** or **OTP Login for WooCommerce** — ₹3,000–8,000/year
- Alternative: integrate Firebase Auth into WordPress via a custom plugin (keep phone OTP free but needs dev work)

### Course/LMS (pick one)
- **TutorLMS** (free tier available) — cleaner UI, works well with WooCommerce
- **LearnDash** (₹8,000+/year) — more powerful, overkill for Drida's current scale
- **LifterLMS** (free tier) — good middle ground

### Design
- **Astra** or **Kadence** theme (free, fast, highly customisable) — replicate the warm cream + red Drida brand
- OR use **Elementor** page builder (free) to visually rebuild the current site design

### Hosting
- **Hostinger Business** (~₹250–400/month = ₹3,000–5,000/year) — recommended for India, good support
- **SiteGround** (~₹400–600/month) — more reliable but pricier
- Avoid shared GoDaddy/Bluehost — slow in India

---

## Estimated Yearly Cost

| Item | Cost (INR/year) |
|---|---|
| Hosting (Hostinger Business) | ₹3,500 |
| Domain (.com or .org) | ₹1,000 |
| Phone OTP plugin | ₹5,000 (mid-range) |
| LMS plugin (TutorLMS free tier) | ₹0 |
| Razorpay (2% per transaction) | Variable |
| **Total fixed** | **~₹9,500/year** |

That's roughly **₹800/month** for a fully managed, self-serve website.

---

## Migration Plan (Step by Step)

### Phase 1 — Setup (Week 1)
1. Buy hosting + domain
2. Install WordPress + WooCommerce + Razorpay plugin
3. Install Astra/Kadence theme
4. Set up basic Drida branding (colours, logo, fonts)

### Phase 2 — Design (Week 2)
5. Rebuild the homepage to match current Drida site feel
6. Rebuild header (with topstrip), footer (with 4 columns), navigation
7. Import all existing content (courses, trips, products descriptions)
8. Add all course pages as WooCommerce products

### Phase 3 — Auth + Enrollment (Week 3)
9. Install and configure phone OTP plugin
10. Set up WooCommerce checkout with Razorpay
11. Create product/course pages with enrollment flow
12. Test full registration → payment → my-courses flow

### Phase 4 — Content + Migration (Week 4)
13. Migrate all 14 batch meetup videos
14. Set up blog/announcements section
15. Import members list from Smitha mam's Excel
16. Send communications to existing members with new site link

### Phase 5 — Go Live
17. Point domain to new WordPress hosting
18. Test everything on mobile + desktop
19. Train Smitha mam on WordPress dashboard
20. Redirect old GitHub Pages URL if needed

---

## What To Keep From the Current Site

These assets can be directly reused in WordPress:
- All images in `images/` folder
- `drida_logo.svg` and `drida_logo_white.svg`
- All course content (descriptions, prices, dates)
- All trip/product descriptions
- Social media links and contact details
- The colour palette and brand identity

---

## Questions to Decide Before Starting WordPress

1. **Phone OTP or email/password?** Phone OTP needs the paid plugin. Email/password is free and built-in. If email is good enough, cost drops by ₹3,000–8,000/year.
2. **Which LMS?** TutorLMS (free, simpler) vs LearnDash (paid, more features)?
3. **Which hosting?** Hostinger (cheaper) vs SiteGround (more reliable)?
4. **Migrate immediately or run in parallel?** Recommended: build WordPress alongside, switch over when ready.
5. **Who will maintain it?** Smitha mam for content, Sara for occasional tech help?

---

*End of document. Start a new Claude conversation and paste this document to continue.*
