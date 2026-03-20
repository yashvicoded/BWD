/* =============================================
   WANDERLUST JOURNEYS — SCRIPTS.JS
   Interactive features: navbar, filters, forms, animations
============================================= */

document.addEventListener('DOMContentLoaded', function () {

  // ---- NAVBAR SCROLL EFFECT ----
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ---- DESTINATION / TOUR FILTER ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const destItems = document.querySelectorAll('.dest-item');
  const noResults = document.getElementById('noResults');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');
      let visibleCount = 0;

      destItems.forEach(item => {
        const cat = item.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.4s ease forwards';
          visibleCount++;
        } else {
          item.classList.add('hidden');
        }
      });

      if (noResults) {
        noResults.classList.toggle('d-none', visibleCount > 0);
      }
    });
  });

  // ---- WISHLIST TOGGLE (Tour cards) ----
  document.querySelectorAll('.tour-wishlist').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      this.classList.toggle('active');
      const icon = this.querySelector('i');
      if (this.classList.contains('active')) {
        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
        showToast('Added to wishlist ♥');
      } else {
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
        showToast('Removed from wishlist');
      }
    });
  });

  // ---- BOOKING FORM SUBMISSION ----
  const bookingForm = document.getElementById('bookingForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('successMsg');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate required fields
      const required = bookingForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('is-invalid');
          field.addEventListener('input', () => field.classList.remove('is-invalid'), { once: true });
        }
      });

      if (!valid) {
        showToast('Please fill in all required fields', 'error');
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

      setTimeout(() => {
        bookingForm.style.display = 'none';
        successMsg.classList.remove('d-none');
      }, 1800);
    });
  }

  // ---- SCROLL FADE-IN ANIMATION ----
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Apply fade-in to cards and sections
  document.querySelectorAll(
    '.dest-card, .dest-card-v2, .tour-card, .why-card, .stat-item, .testimonial-card, .contact-info-card, .faq-card, .contact-form-card, .featured-tour-card'
  ).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // ---- NEWSLETTER FORM ----
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    const newsletterBtn = newsletterForm.querySelector('.btn-book');
    const emailInput = newsletterForm.querySelector('input[type="email"]');

    newsletterBtn.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.style.borderColor = '#dc3545';
        emailInput.focus();
        return;
      }
      newsletterBtn.innerHTML = '✓ Subscribed!';
      newsletterBtn.style.background = '#28a745';
      emailInput.value = '';
      emailInput.style.borderColor = '';
      setTimeout(() => {
        newsletterBtn.innerHTML = 'Subscribe';
        newsletterBtn.style.background = '';
      }, 3000);
    });
  }

  // ---- TOAST NOTIFICATION ----
  function showToast(message, type = 'success') {
    const existing = document.getElementById('wl-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'wl-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: ${type === 'error' ? '#dc3545' : '#1a1208'};
      color: #fff;
      padding: 0.85rem 1.6rem;
      border-radius: 50px;
      font-size: 0.88rem;
      font-family: 'DM Sans', sans-serif;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      z-index: 9999;
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
      border-left: 3px solid ${type === 'error' ? '#ff6b6b' : '#f4c67a'};
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  // ---- SMOOTH ANCHOR SCROLLING ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- ACTIVE NAV LINK on scroll ----
  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
          current = sec.getAttribute('id');
        }
      });
    });
  }

  // ---- GENERIC FORM SUBMISSIONS (custom trip, enquiry tabs) ----
  document.querySelectorAll('form:not(#bookingForm)').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
        setTimeout(() => {
          btn.innerHTML = '✓ Message Sent!';
          btn.style.background = '#28a745';
          btn.style.borderColor = '#28a745';
          this.reset();
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = btn.getAttribute('data-original') || 'Submit';
            btn.style.background = '';
            btn.style.borderColor = '';
          }, 4000);
        }, 1500);
      }
    });
  });

  // Store original button text
  document.querySelectorAll('form button[type="submit"]').forEach(btn => {
    btn.setAttribute('data-original', btn.innerHTML);
  });

});