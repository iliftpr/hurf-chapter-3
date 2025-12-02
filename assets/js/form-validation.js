/**
 * HURF Chapter - Form Validation & Multi-Step Form Handling
 * For membership application and contact forms
 */

(function() {
  'use strict';

  // ===== MULTI-STEP FORM FUNCTIONALITY =====
  const membershipForm = document.getElementById('membershipForm');

  if (membershipForm) {
    const formSteps = membershipForm.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = membershipForm.querySelectorAll('.next-step-btn');
    const prevButtons = membershipForm.querySelectorAll('.prev-step-btn');
    const successMessage = document.getElementById('successMessage');

    let currentStep = 1;

    // Navigate to specific step
    function goToStep(stepNumber) {
      // Hide all steps
      formSteps.forEach(step => step.classList.remove('active'));
      progressSteps.forEach(step => {
        step.classList.remove('active', 'completed');
      });

      // Show current step
      const currentFormStep = membershipForm.querySelector(`[data-step="${stepNumber}"]`);
      if (currentFormStep) {
        currentFormStep.classList.add('active');
      }

      // Update progress bar
      progressSteps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < stepNumber) {
          step.classList.add('completed');
        } else if (stepNum === stepNumber) {
          step.classList.add('active');
        }
      });

      currentStep = stepNumber;

      // Scroll to top of form
      membershipForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Validate current step
    function validateStep(stepNumber) {
      const stepElement = membershipForm.querySelector(`.form-step[data-step="${stepNumber}"]`);
      if (!stepElement) return true;

      const requiredInputs = stepElement.querySelectorAll('[required]');
      let isValid = true;

      requiredInputs.forEach(input => {
        const formGroup = input.closest('.form-group');

        // Remove previous error state
        if (formGroup) {
          formGroup.classList.remove('error');
        }

        // Check validity
        if (!input.value || (input.type === 'email' && !isValidEmail(input.value))) {
          isValid = false;
          if (formGroup) {
            formGroup.classList.add('error');

            // Add error message if not exists
            if (!formGroup.querySelector('.form-error')) {
              const errorMsg = document.createElement('span');
              errorMsg.className = 'form-error';
              errorMsg.textContent = input.type === 'email' ? 'Please enter a valid email address' : 'This field is required';
              input.parentNode.appendChild(errorMsg);
            }
          }
        }
      });

      return isValid;
    }

    // Next button click handlers
    nextButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentFormStep = this.closest('.form-step');
        const stepNumber = parseInt(currentFormStep.getAttribute('data-step'));

        if (validateStep(stepNumber)) {
          goToStep(stepNumber + 1);
        }
      });
    });

    // Previous button click handlers
    prevButtons.forEach(button => {
      button.addEventListener('click', function() {
        const currentFormStep = this.closest('.form-step');
        const stepNumber = parseInt(currentFormStep.getAttribute('data-step'));
        goToStep(stepNumber - 1);
      });
    });

    // Form submission
    membershipForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate final step
      if (!validateStep(currentStep)) {
        return;
      }

      // Collect form data
      const formData = new FormData(this);
      const data = {};

      // Convert FormData to object
      for (let [key, value] of formData.entries()) {
        if (key === 'interests') {
          if (!data[key]) {
            data[key] = [];
          }
          data[key].push(value);
        } else {
          data[key] = value;
        }
      }

      // Log data (for development)
      console.log('Membership Application Data:', data);

      // TODO: Send data to GoHighLevel
      // Example:
      // fetch('YOUR_GOHIGHLEVEL_WEBHOOK_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Hide form and show success message
      formSteps.forEach(step => step.classList.remove('active'));
      document.querySelector('.progress-bar').style.display = 'none';
      successMessage.classList.remove('hidden');

      // Scroll to success message
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Remove error state on input
    membershipForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
      input.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        if (formGroup) {
          formGroup.classList.remove('error');
        }
      });
    });
  }

  // ===== CONTACT FORM VALIDATION =====
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate all fields
      let isValid = true;
      const requiredInputs = this.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        const formGroup = input.closest('.form-group');

        // Remove previous error state
        if (formGroup) {
          formGroup.classList.remove('error');
          const existingError = formGroup.querySelector('.form-error');
          if (existingError) {
            existingError.remove();
          }
        }

        // Validate
        let fieldIsValid = true;

        if (!input.value.trim()) {
          fieldIsValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
          fieldIsValid = false;
        }

        if (!fieldIsValid) {
          isValid = false;
          if (formGroup) {
            formGroup.classList.add('error');
            const errorMsg = document.createElement('span');
            errorMsg.className = 'form-error';
            errorMsg.textContent = input.type === 'email' ? 'Please enter a valid email address' : 'This field is required';
            input.parentNode.appendChild(errorMsg);
          }
        }
      });

      if (!isValid) {
        return;
      }

      // Collect form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      console.log('Contact Form Data:', data);

      // TODO: Send data to GoHighLevel
      // fetch('YOUR_GOHIGHLEVEL_WEBHOOK_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });

      // Show success message
      showSuccessMessage('Thank you for contacting us! We\'ll respond within 24 hours.');

      // Reset form
      this.reset();
    });

    // Remove error on input
    contactForm.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
      input.addEventListener('input', function() {
        const formGroup = this.closest('.form-group');
        if (formGroup) {
          formGroup.classList.remove('error');
          const existingError = formGroup.querySelector('.form-error');
          if (existingError) {
            existingError.remove();
          }
        }
      });
    });
  }

  // ===== UTILITY FUNCTIONS =====

  /**
   * Validate email format
   * @param {string} email - Email address to validate
   * @returns {boolean} - True if valid
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Show success message
   * @param {string} message - Message to display
   */
  function showSuccessMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'bg-success text-white p-6 rounded-lg mb-6 fade-in';
    messageEl.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-3xl">✓</span>
        <p class="text-lg font-semibold">${message}</p>
      </div>
    `;

    // Insert before form
    const form = contactForm || membershipForm;
    if (form) {
      form.parentNode.insertBefore(messageEl, form);

      // Remove after 5 seconds
      setTimeout(() => {
        messageEl.remove();
      }, 5000);
    }
  }

})();
