/* =================================
   Utilities Module
   Helper Functions
   ================================= */

const Utils = {
  /**
   * Debounce function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Get element's offset from top of page
   * @param {HTMLElement} element - Element
   * @returns {number} Offset in pixels
   */
  getOffset(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + window.pageYOffset;
  },

  /**
   * Check if element is in viewport
   * @param {HTMLElement} element - Element
   * @returns {boolean} Is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Format phone number
   * @param {string} phone - Phone number
   * @returns {string} Formatted phone
   */
  formatPhone(phone) {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');

    // Format as needed (example for Malaysian numbers)
    if (cleaned.startsWith('60')) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
    }

    return phone;
  },

  /**
   * Sanitize string (basic XSS prevention)
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Get query parameter from URL
   * @param {string} param - Parameter name
   * @returns {string|null} Parameter value
   */
  getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * Format date
   * @param {Date} date - Date object
   * @param {string} format - Format string (default: 'YYYY-MM-DD')
   * @returns {string} Formatted date
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  /**
   * Copy text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<boolean>} Success status
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  },

  /**
   * Check if user prefers reduced motion
   * @returns {boolean} Prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get current breakpoint
   * @returns {string} Breakpoint name
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth;

    if (width < 640) return 'mobile';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    return 'xl';
  },

  /**
   * Check if touch device
   * @returns {boolean} Is touch device
   */
  isTouchDevice() {
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0);
  },

  /**
   * Local storage wrapper with error handling
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('localStorage set error:', e);
        return false;
      }
    },

    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (e) {
        console.error('localStorage get error:', e);
        return null;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('localStorage remove error:', e);
        return false;
      }
    },

    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.error('localStorage clear error:', e);
        return false;
      }
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
