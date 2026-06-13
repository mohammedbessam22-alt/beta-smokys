# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Smokys Grill House** — a single-page static marketing website for a BBQ franchise. No build system, no package manager, no framework. Pure vanilla HTML/CSS/JS.

## Development

Open `index.html` directly in a browser, or serve it with any static file server:

```powershell
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

There are no build steps, no lint commands, and no tests.

## Architecture

### File structure
- `index.html` — entire single-page site; all sections live here
- `assets/css/style.css` — all styles; single file, ~2000 lines
- `assets/js/script.js` — all interactivity; single file, organized by feature block
- `assets/images/` — all static image assets

### External dependencies (CDN only)
- **Google Fonts**: Oswald, Roboto, Shadows Into Light — loaded in `<head>`
- **Ionicons 5.5.2** — icon library, loaded via `<script>` at bottom of `<body>`

### CSS design system (`style.css`)
All design tokens are CSS custom properties defined in `:root`:
- Brand palette: `--teal`, `--teal-dark`, `--teal-mid`, `--teal-light`, `--deep-teal`, etc.
- Typography: `--ff-heading` (Oswald), `--ff-body` (Roboto), `--ff-script` (Shadows Into Light)
- Z-index layer system: named variables (`--z-notifications`, `--z-loading`, `--z-modal`, etc.) — always use these, never raw z-index values
- Responsive breakpoints: mobile-first, at 480px / 550px / 768px / 992px / 1200px

Scroll reveal animations use three utility classes: `.reveal-up`, `.reveal-left`, `.reveal-right`. They start hidden and gain `.visible` via Intersection Observer in JS.

### JS architecture (`script.js`)
Each feature is a self-contained block, in this order:
1. **Loading screen** — hides after `window.load` + 900ms delay
2. **Scroll progress bar** — updates `width` on scroll
3. **Navbar toggle** — mobile hamburger, closes on nav-link click
4. **Sticky header + back-to-top** — adds `.active` class at 100px scroll
5. **Search box** — toggles `.active` on container and `body`
6. **Canvas smoke particles** — `SmokeParticle` class, `requestAnimationFrame` loop on the hero `<canvas>`
7. **Scroll reveal** — `IntersectionObserver` adds `.visible` to reveal-* elements
8. **Animated counters** — `IntersectionObserver` on `[data-target]` elements, cubic ease-out animation
9. **Menu filter** — filters `.menu-item` by `data-category` attribute
10. **Testimonials carousel** — dot-driven, auto-advances every 4.5s, resets timer on dot click
11. **Delivery boy parallax** — `translateX` driven by scroll direction delta
12. **Open/closed status** — computes live hours against hardcoded schedule, updates `#open-status`
13. **Toast notification** — `showToast()` utility, triggered by reservation form submit

### HTML conventions
- Section anchors: `id="home"`, `id="about"`, `id="food-menu"`, `id="franchise"`, `id="blog"`, `id="contact"` (footer)
- JS hooks use `data-*` attributes (`data-header`, `data-navbar`, `data-nav-link`, `data-search-btn`, etc.) — never select by class in JS
- Stats counters: `data-target="<number>"` + `data-suffix="<string>"` on the display element
- Menu items: `data-category="<brisket|ribs|chicken|sandwich>"` on `<li class="menu-item">`
