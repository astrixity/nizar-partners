/* =================================
   Form Module
   Contact Form Validation & Handling
   ================================= */

const Form = {
  /**
   * Initialize form handling
   */
  init() {
    this.form = document.getElementById('contact-form');
    
    // Only proceed if form exists on current page
    if (!this.form) {
      return;
    }
    
    this.messageContainer = this.form.querySelector('.form-message');

    this.setupFormValidation();
    this.setupFormSubmission();
  },

  /**
   * Setup real-time form validation
   */
  setupFormValidation() {
    const inputs = this.form.querySelectorAll('.form-input, .form-textarea');

    inputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      // Clear error on input
      input.addEventListener('input', () => {
        if (input.parentElement.classList.contains('has-error')) {
          this.clearFieldError(input);
        }
      });
    });
  },

  /**
   * Validate a single field
   * @param {HTMLElement} field - Input element
   * @returns {boolean} Is valid
   */
  validateField(field) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.form-error');
    let errorMessage = '';

    // Clear previous error
    this.clearFieldError(field);

    // Check if field is required
    if (field.hasAttribute('required') && !field.value.trim()) {
      errorMessage = 'This field is required';
    }
    // Validate email
    else if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        errorMessage = 'Please enter a valid email address';
      }
    }
    // Validate phone (if provided)
    else if (field.type === 'tel' && field.value.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(field.value.trim().replace(/\s/g, ''))) {
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Show error if validation failed
    if (errorMessage) {
      this.showFieldError(field, errorMessage);
      return false;
    }

    return true;
  },

  /**
   * Show field error
   * @param {HTMLElement} field - Input element
   * @param {string} message - Error message
   */
  showFieldError(field, message) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.form-error');

    formGroup.classList.add('has-error');
    if (errorElement) {
      errorElement.textContent = message;
    }
    field.setAttribute('aria-invalid', 'true');
  },

  /**
   * Clear field error
   * @param {HTMLElement} field - Input element
   */
  clearFieldError(field) {
    const formGroup = field.parentElement;
    const errorElement = formGroup.querySelector('.form-error');

    formGroup.classList.remove('has-error');
    if (errorElement) {
      errorElement.textContent = '';
    }
    field.removeAttribute('aria-invalid');
  },

  /**
   * Validate entire form
   * @returns {boolean} Is valid
   */
  validateForm() {
    const requiredFields = this.form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  },

  /**
   * Setup form submission
   */
  setupFormSubmission() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validate form
      if (!this.validateForm()) {
        this.showMessage('Please correct the errors above', 'error');
        return;
      }

      // Get form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());

      // Submit form
      await this.submitForm(data);
    });
  },

  /**
   * Submit form data
   * @param {Object} data - Form data
   */
  async submitForm(data) {
    const submitButton = this.form.querySelector('button[type="submit"]');

    // Disable submit button
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span> Sending...';

    try {
      // Simulate API call (replace with actual endpoint)
      // For now, just log the data and show success message
      console.log('Form data:', data);

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      this.showMessage(
        'Thank you for your message! We will get back to you shortly.',
        'success'
      );

      // Reset form
      this.form.reset();

      // Clear any errors
      const formGroups = this.form.querySelectorAll('.form-group');
      formGroups.forEach(group => {
        group.classList.remove('has-error');
        const errorElement = group.querySelector('.form-error');
        if (errorElement) {
          errorElement.textContent = '';
        }
      });

    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage(
        'Sorry, there was an error sending your message. Please try again or contact us directly.',
        'error'
      );
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }
  },

  /**
   * Show form message
   * @param {string} message - Message text
   * @param {string} type - Message type (success/error)
   */
  showMessage(message, type) {
    if (!this.messageContainer) return;

    this.messageContainer.textContent = message;
    this.messageContainer.className = `form-message form-message--${type}`;

    // Scroll to message
    this.messageContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Clear message after 10 seconds
    setTimeout(() => {
      this.messageContainer.textContent = '';
      this.messageContainer.className = 'form-message';
    }, 10000);
  }
};

// Make globally available
window.Form = Form;
window.ContactForm = Form; // Alias for backwards compatibility

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Form;
}
