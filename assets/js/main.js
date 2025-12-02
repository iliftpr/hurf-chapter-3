/**
 * HURF Chapter - Main JavaScript
 * Global functionality: navigation, smooth scroll, utilities
 */

(function() {
  'use strict';

  // ===== MOBILE MENU TOGGLE =====
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');

      // Update aria-expanded attribute for accessibility
      const isExpanded = navMenu.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded);

      // Change icon
      mobileMenuToggle.textContent = isExpanded ? '✕' : '☰';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = navMenu.contains(event.target) ||
                           mobileMenuToggle.contains(event.target);

      if (!isClickInside && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu when nav link is clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          navMenu.classList.remove('active');
          mobileMenuToggle.textContent = '☰';
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add 'scrolled' class when scrolled down
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
  });

  // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Don't prevent default for links that just have "#"
      if (href === '#') return;

      const targetElement = document.querySelector(href);

      if (targetElement) {
        e.preventDefault();

        const headerHeight = header ? header.offsetHeight : 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== ACTIVE NAV LINK HIGHLIGHTING =====
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      // Remove active class from all
      link.classList.remove('active');

      // Add active class to current page
      if (currentPath === linkPath || (currentPath.endsWith('/') && linkPath.endsWith('index.html'))) {
        link.classList.add('active');
      }
    });
  }

  setActiveNavLink();

  // ===== NEWSLETTER FORM HANDLING =====
  const newsletterForm = document.getElementById('newsletterForm');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');
      const email = emailInput.value;

      // Basic validation
      if (!email || !isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
      }

      // Here you would integrate with your email service (GoHighLevel, Mailchimp, etc.)
      // For now, just show success message
      showMessage('Thank you for subscribing!', 'success');
      emailInput.value = '';

      // TODO: Integrate with email service
      console.log('Newsletter subscription:', email);
    });
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Validate email address
   * @param {string} email - Email address to validate
   * @returns {boolean} - True if valid
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Show message to user
   * @param {string} message - Message text
   * @param {string} type - Message type ('success', 'error', 'info')
   */
  function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.textContent = message;
    messageEl.style.cssText = `
      position: fixed;
      top: calc(var(--header-height) + 20px);
      left: 50%;
      transform: translateX(-50%);
      background-color: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)'};
      color: white;
      padding: 1rem 2rem;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 10000;
      animation: fadeIn 0.3s ease-in-out;
      max-width: 90%;
      text-align: center;
    `;

    document.body.appendChild(messageEl);

    // Remove after 4 seconds
    setTimeout(() => {
      messageEl.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => {
        document.body.removeChild(messageEl);
      }, 300);
    }, 4000);
  }

  // Add fadeOut animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
      to {
        opacity: 0;
        transform: translateX(-50%) translateY(-10px);
      }
    }
  `;
  document.head.appendChild(style);

  // ===== LAZY LOADING FOR IMAGES =====
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ===== ANIMATION ON SCROLL =====
  if ('IntersectionObserver' in window) {
    const animateOnScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, {
      threshold: 0.1
    });

    document.querySelectorAll('.card, .stat-card, .initiative-card').forEach(el => {
      animateOnScrollObserver.observe(el);
    });
  }

  // ===== BACK TO TOP BUTTON =====
  const backToTopButton = document.createElement('button');
  backToTopButton.innerHTML = '↑';
  backToTopButton.setAttribute('aria-label', 'Back to top');
  backToTopButton.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    background-color: var(--patriot-red);
    color: white;
    border: none;
    border-radius: var(--radius-full);
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: var(--shadow-lg);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-base);
    z-index: 999;
  `;

  document.body.appendChild(backToTopButton);

  // Show/hide back to top button
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopButton.style.opacity = '1';
      backToTopButton.style.visibility = 'visible';
    } else {
      backToTopButton.style.opacity = '0';
      backToTopButton.style.visibility = 'hidden';
    }
  });

  // Scroll to top on click
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Hover effect
  backToTopButton.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-4px)';
  });

  backToTopButton.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
  });

  // ===== CONSOLE MESSAGE =====
  console.log('%c HURF Chapter Website ', 'background: #1A237E; color: #FFC107; font-size: 16px; padding: 10px;');
  console.log('%c Empowering Small Business in Our Communities ', 'background: #D32F2F; color: white; font-size: 12px; padding: 5px;');

})();
