'use strict';

/* =============================================
   LOADING SCREEN
   ============================================= */
const loadingScreen = document.getElementById('loading-screen');

window.addEventListener('load', () => {
  setTimeout(() => loadingScreen.classList.add('hidden'), 900);
});


/* =============================================
   SCROLL PROGRESS BAR
   ============================================= */
const scrollProgress = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = ((scrollTop / docHeight) * 100) + '%';
}, { passive: true });


/* =============================================
   NAVBAR TOGGLE
   ============================================= */
const navbar        = document.querySelector('[data-navbar]');
const navbarLinks   = document.querySelectorAll('[data-nav-link]');
const menuToggleBtn = document.querySelector('[data-menu-toggle-btn]');

menuToggleBtn.addEventListener('click', function () {
  navbar.classList.toggle('active');
  this.classList.toggle('active');
});

navbarLinks.forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuToggleBtn.classList.remove('active');
  });
});


/* =============================================
   STICKY HEADER + BACK TO TOP
   ============================================= */
const header     = document.querySelector('[data-header]');
const backTopBtn = document.querySelector('[data-back-top-btn]');

window.addEventListener('scroll', () => {
  if (window.scrollY >= 100) {
    header.classList.add('active');
    backTopBtn.classList.add('active');
  } else {
    header.classList.remove('active');
    backTopBtn.classList.remove('active');
  }
}, { passive: true });


/* =============================================
   SEARCH BOX
   ============================================= */
const searchBtn       = document.querySelector('[data-search-btn]');
const searchContainer = document.querySelector('[data-search-container]');
const searchSubmitBtn = document.querySelector('[data-search-submit-btn]');
const searchCloseBtn  = document.querySelector('[data-search-close-btn]');

[searchBtn, searchSubmitBtn, searchCloseBtn].forEach(el => {
  el.addEventListener('click', () => {
    searchContainer.classList.toggle('active');
    document.body.classList.toggle('active');
  });
});


/* =============================================
   CANVAS SMOKE PARTICLES (Hero Background)
   ============================================= */
const canvas = document.getElementById('smoke-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  const hero = canvas.parentElement;
  canvas.width  = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const PARTICLE_COUNT = 40;

class SmokeParticle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = canvas.height + Math.random() * 40;
    this.size  = Math.random() * 60 + 20;
    this.speedY = -(Math.random() * 0.5 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.07 + 0.02;
    this.maxY   = -(this.size * 2);
    this.drift  = (Math.random() - 0.5) * 0.1;
  }

  update() {
    this.y     += this.speedY;
    this.x     += this.speedX + this.drift;
    this.size  += 0.15;
    this.opacity -= 0.0002;

    if (this.y < this.maxY || this.opacity <= 0) this.reset();
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );
    gradient.addColorStop(0,   `rgba(14, 110, 100, ${this.opacity})`);
    gradient.addColorStop(0.5, `rgba(8,  80,  74,  ${this.opacity * 0.5})`);
    gradient.addColorStop(1,   `rgba(4,  40,  38,  0)`);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = new SmokeParticle();
  p.y = Math.random() * canvas.height;
  particles.push(p);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

animateParticles();


/* =============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================= */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


/* =============================================
   ANIMATED COUNTERS (Stats Section)
   ============================================= */
const statEls = document.querySelectorAll('[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el     = entry.target;
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '+';
    const duration = 1800;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = target * eased;

      el.textContent = (Number.isInteger(target)
        ? Math.floor(current)
        : current.toFixed(1)) + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statEls.forEach(el => counterObserver.observe(el));


/* =============================================
   MENU FILTER
   ============================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItems  = document.querySelectorAll('.menu-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.dataset.filter;

    menuItems.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;

      if (match) {
        item.classList.remove('hidden');
        item.classList.add('fade-in');
      } else {
        item.classList.add('hidden');
        item.classList.remove('fade-in');
      }
    });
  });
});


/* =============================================
   TESTIMONIALS CAROUSEL
   ============================================= */
const slides      = document.querySelectorAll('.carousel-slide');
const dots        = document.querySelectorAll('.carousel-dot');
let currentSlide  = 0;
let carouselTimer = null;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active-slide');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active-slide');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startCarousel() {
  carouselTimer = setInterval(nextSlide, 4500);
}

function resetCarousel(index) {
  clearInterval(carouselTimer);
  goToSlide(index);
  startCarousel();
}

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => resetCarousel(i));
});

startCarousel();


/* =============================================
   DELIVERY BOY PARALLAX ON SCROLL
   ============================================= */
const deliveryBoy = document.querySelector('[data-delivery-boy]');

if (deliveryBoy) {
  let move       = -80;
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const rect = deliveryBoy.getBoundingClientRect();
    if (rect.top < 500 && rect.top > -250) {
      const current = window.scrollY;
      move += current > lastScroll ? 1 : -1;
      lastScroll = current;
      deliveryBoy.style.transform = `translateX(${move}px)`;
    }
  }, { passive: true });
}


/* =============================================
   OPEN / CLOSED STATUS (Footer)
   ============================================= */
function updateOpenStatus() {
  const statusEl = document.getElementById('open-status');
  if (!statusEl) return;

  const now    = new Date();
  const hour   = now.getHours();
  const day    = now.getDay(); // 0=Sun, 6=Sat

  let open = false;
  if (day >= 1 && day <= 5 && hour >= 11 && hour < 22) open = true;
  if (day === 6 && hour >= 10 && hour < 23) open = true;
  if (day === 0 && hour >= 11 && hour < 21) open = true;

  statusEl.textContent = open ? '● Open Now' : '● Closed';
  statusEl.className   = 'footer-list-item open-status ' + (open ? 'open' : 'closed');
}

updateOpenStatus();


/* =============================================
   TOAST NOTIFICATION
   ============================================= */
const toast = document.getElementById('toast');

function showToast(message, duration = 3500) {
  toast.querySelector('.toast-msg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

const reservationForm = document.getElementById('reservation-form');
if (reservationForm) {
  reservationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    showToast('Reservation confirmed! We\'ll see you at Smokys.');
    this.reset();
  });
}


/* =============================================
   HERO PARALLAX ON SCROLL
   ============================================= */
const heroSection = document.querySelector('.hero');

if (heroSection) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < heroSection.offsetHeight) {
      heroSection.style.backgroundPositionY = `calc(50% + ${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}
