/* -------------------------------------------------------------
   PAUL CHINNU J - PORTFOLIO INTERACTIVE LOGIC & ANIMATIONS
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initSplashScreen();
  initCustomCursor();
  initCanvasParticles();
  initNavbarScroll();
  initMobileNav();
  initPortfolioFilters();
  initModalLightbox();
  initSmoothScroll();
  initScrollAnimations();
  initContactForm();
});

/* 0. Fullscreen Intro / Splash Screen Controller */
function initSplashScreen() {
  const splash = document.getElementById('splash-screen');
  const progressFill = document.getElementById('splash-progress-fill');
  const percentText = document.getElementById('splash-percent');
  const enterBtn = document.getElementById('splash-enter-btn');

  if (!splash) return;

  // Lock scrolling during splash display
  document.body.classList.add('loading-scroll-lock');
  window.scrollTo(0, 0);

  let progress = 0;
  let dismissed = false;

  function dismissSplash() {
    if (dismissed) return;
    dismissed = true;

    if (progressFill) progressFill.style.width = '100%';
    if (percentText) percentText.textContent = '100%';

    splash.classList.add('fade-out');

    setTimeout(() => {
      document.body.classList.remove('loading-scroll-lock');
      splash.style.display = 'none';
    }, 850);
  }

  // Animated progress counter over ~2 seconds
  const duration = 2000;
  const intervalTime = 30;
  const increment = 100 / (duration / intervalTime);

  const timer = setInterval(() => {
    if (dismissed) {
      clearInterval(timer);
      return;
    }

    progress += increment;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      setTimeout(dismissSplash, 200);
    }

    if (progressFill) progressFill.style.width = `${Math.floor(progress)}%`;
    if (percentText) percentText.textContent = `${Math.floor(progress)}%`;
  }, intervalTime);

  // Enter button click listener
  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dismissSplash();
    });
  }

  // Click anywhere on splash to dismiss immediately
  splash.addEventListener('click', () => {
    dismissSplash();
  });
}

/* 1. Custom Magnetic Cursor */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let posX = 0, posY = 0;
  let mouseX = 0, mouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function animateFollower() {
    posX += (mouseX - posX) / 6;
    posY += (mouseY - posY) / 6;
    follower.style.left = `${posX}px`;
    follower.style.top = `${posY}px`;
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Add hover effect to interactive elements
  const hoverables = document.querySelectorAll('a, button, .skill-card, .skill-banner-card, .meta-entry, .cert-card, .filter-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovered'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovered'));
  });

  // Card hover badge state
  const cards = document.querySelectorAll('.portfolio-card, .service-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => document.body.classList.add('card-hovered'));
    card.addEventListener('mouseleave', () => document.body.classList.remove('card-hovered'));
  });
}

/* 2. Ambient Canvas Particles Engine */
function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 25), 50);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.4 ? '#ff2a4b' : '#7a0010';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function renderParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(renderParticles);
  }

  renderParticles();
}

/* 3. Sticky Navbar & Active Indicator */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* 4. Mobile Drawer Navigation */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    toggleBtn.innerHTML = mobileNav.classList.contains('open') ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) lucide.createIcons();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
      if (window.lucide) lucide.createIcons();
    });
  });
}

/* 5. Portfolio Category Filter */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* 6. Modal Lightbox for Projects & Services */
function initModalLightbox() {
  const backdrop = document.getElementById('project-modal');
  const closeBtn = document.querySelector('.modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-desc');

  if (!backdrop) return;

  const cards = document.querySelectorAll('.portfolio-card, .service-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.dataset.title || card.querySelector('.portfolio-title, .service-title')?.innerText;
      const category = card.dataset.category || card.querySelector('.portfolio-category, .service-num')?.innerText;
      const desc = card.dataset.desc || "High-impact creative project executed with focus on target engagement, brand aesthetics, and digital performance.";
      const imgSrc = card.querySelector('img')?.src || "public/assets/work-ad.jpg";

      modalTitle.innerText = title;
      modalCategory.innerText = category;
      modalDesc.innerText = desc;
      modalImg.src = imgSrc;

      backdrop.classList.add('active');
    });
  });

  closeBtn?.addEventListener('click', () => backdrop.classList.remove('active'));
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.classList.remove('active');
  });
}

/* 7. Smooth Scroll Anchor Links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* 8. Intersection Observer Reveal Animations */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.glass-panel, .section-title, .section-tag, .timeline-item, .skill-card, .service-card, .portfolio-card, .cert-card, .funnel-card');

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* 9. Interactive Contact Form */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('contact-toast');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const message = form.querySelector('[name="message"]').value;

    if (name && email && message) {
      if (toast) {
        toast.style.display = 'block';
        toast.innerText = `Thank you, ${name}! Your message has been prepared. Opening your email app...`;
        setTimeout(() => { toast.style.display = 'none'; }, 4000);
      }

      // Open mailto link with user message prefilled
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Hi Paul,\n\n${message}\n\nBest regards,\n${name}\n${email}`);
      window.location.href = `mailto:chinnudhanush25@gmail.com?subject=${subject}&body=${body}`;

      form.reset();
    }
  });
}
