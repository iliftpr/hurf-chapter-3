/**
 * HURF Chapter - Hero Tabs Functionality
 * Multi-tab hero section with auto-rotation
 */

(function() {
  'use strict';

  // Get all tab buttons and content
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Auto-rotation settings
  let autoRotateInterval;
  let currentTabIndex = 0;
  const AUTO_ROTATE_DELAY = 8000; // 8 seconds
  let isAutoRotateActive = true;

  // Check if hero tabs exist on this page
  if (tabButtons.length === 0 || tabContents.length === 0) {
    return; // Exit if no tabs found
  }

  /**
   * Switch to a specific tab
   * @param {string} tabName - The name of the tab to switch to
   */
  function switchTab(tabName) {
    // Remove active class from all buttons and content
    tabButtons.forEach(button => button.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    // Add active class to selected button and content
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`tab-${tabName}`);

    if (selectedButton && selectedContent) {
      selectedButton.classList.add('active');
      selectedContent.classList.add('active');

      // Update current tab index for auto-rotation
      const buttonIndex = Array.from(tabButtons).indexOf(selectedButton);
      if (buttonIndex !== -1) {
        currentTabIndex = buttonIndex;
      }
    }
  }

  /**
   * Switch to next tab in sequence
   */
  function nextTab() {
    currentTabIndex = (currentTabIndex + 1) % tabButtons.length;
    const nextButton = tabButtons[currentTabIndex];
    const tabName = nextButton.getAttribute('data-tab');
    switchTab(tabName);
  }

  /**
   * Start auto-rotation of tabs
   */
  function startAutoRotate() {
    if (!isAutoRotateActive) return;

    autoRotateInterval = setInterval(() => {
      nextTab();
    }, AUTO_ROTATE_DELAY);
  }

  /**
   * Stop auto-rotation of tabs
   */
  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }

  /**
   * Pause auto-rotation temporarily
   */
  function pauseAutoRotate() {
    isAutoRotateActive = false;
    stopAutoRotate();
  }

  /**
   * Resume auto-rotation
   */
  function resumeAutoRotate() {
    isAutoRotateActive = true;
    stopAutoRotate(); // Clear any existing interval
    startAutoRotate();
  }

  // Add click event listeners to tab buttons
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      switchTab(tabName);

      // Pause auto-rotation when user manually clicks a tab
      pauseAutoRotate();

      // Resume auto-rotation after 30 seconds of inactivity
      setTimeout(() => {
        resumeAutoRotate();
      }, 30000);
    });
  });

  // Pause auto-rotation when user hovers over tab content
  const heroTabsSection = document.querySelector('.hero-tabs');
  if (heroTabsSection) {
    heroTabsSection.addEventListener('mouseenter', () => {
      stopAutoRotate();
    });

    heroTabsSection.addEventListener('mouseleave', () => {
      if (isAutoRotateActive) {
        startAutoRotate();
      }
    });
  }

  // Pause auto-rotation when page is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoRotate();
    } else if (isAutoRotateActive) {
      startAutoRotate();
    }
  });

  // Initialize: Start auto-rotation
  startAutoRotate();

  // Mobile accordion behavior (for responsive design)
  function setupMobileAccordion() {
    if (window.innerWidth <= 768) {
      // On mobile, tabs work as click-to-expand accordion
      // This is handled by the same click events above
    }
  }

  // Run on load and resize
  setupMobileAccordion();
  window.addEventListener('resize', setupMobileAccordion);

  // Keyboard navigation for accessibility
  tabButtons.forEach((button, index) => {
    button.addEventListener('keydown', (e) => {
      let targetIndex = index;

      // Arrow key navigation
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = index - 1 < 0 ? tabButtons.length - 1 : index - 1;
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = tabButtons.length - 1;
      }

      if (targetIndex !== index) {
        tabButtons[targetIndex].focus();
        const tabName = tabButtons[targetIndex].getAttribute('data-tab');
        switchTab(tabName);
        pauseAutoRotate();
      }
    });
  });

})();
