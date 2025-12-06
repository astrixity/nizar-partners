/* =================================
   Main Application
   Initialize all modules
   ================================= */

/**
 * Main App Object
 */
const App = {
  /**
   * Initialize the application
   */
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  },

  /**
   * Start the application
   */
  start() {
    console.log('🚀 Law Firm Website - Initializing...');

    try {
      // Initialize modules
      this.initializeModules();

      // Setup global event listeners
      this.setupGlobalListeners();

      // Performance monitoring (development only)
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        this.monitorPerformance();
      }

      console.log('✅ Application initialized successfully');
    } catch (error) {
      console.error('❌ Application initialization error:', error);
    }
  },

  /**
   * Initialize all modules
   */
  initializeModules() {
    // Router initializes itself automatically
    if (typeof Router !== 'undefined') {
      console.log('✓ Router auto-initialized');
    }

    // Initialize navigation
    if (typeof Navigation !== 'undefined') {
      Navigation.init();
      console.log('✓ Navigation initialized');
    }

    // Initialize form handling
    if (typeof Form !== 'undefined') {
      try {
        Form.init();
        console.log('✓ Form handling initialized');
      } catch (error) {
        console.log('ℹ Form not on current page');
      }
    }

    // Animations will be initialized by router on page load
    if (typeof Animations !== 'undefined') {
      console.log('✓ Animations ready for dynamic initialization');
    }
  },

  /**
   * Setup global event listeners
   */
  setupGlobalListeners() {
    // Handle window resize (debounced)
    if (typeof Utils !== 'undefined' && Utils.debounce) {
      window.addEventListener('resize', Utils.debounce(() => {
        this.handleResize();
      }, 250));
    }

    // Handle page visibility change
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
      console.log('✓ Connection restored');
    });

    window.addEventListener('offline', () => {
      console.log('⚠ Connection lost');
    });

    // Prevent orphaned console logs in production
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      console.log = () => {};
      console.warn = () => {};
    }
  },

  /**
   * Handle window resize
   */
  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && typeof Navigation !== 'undefined') {
      Navigation.closeMobileMenu();
    }

    // Log current breakpoint (development only)
    if (typeof Utils !== 'undefined' && Utils.getCurrentBreakpoint) {
      const breakpoint = Utils.getCurrentBreakpoint();
      console.log('Current breakpoint:', breakpoint);
    }
  },

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    if (document.hidden) {
      console.log('Page hidden');
    } else {
      console.log('Page visible');
    }
  },

  /**
   * Monitor performance metrics
   */
  monitorPerformance() {
    // Check if Performance API is available
    if (!window.performance || !window.performance.timing) {
      return;
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.group('📊 Performance Metrics');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`Connect Time: ${connectTime}ms`);
        console.log(`Render Time: ${renderTime}ms`);
        console.groupEnd();

        // Performance warning
        if (pageLoadTime > 3000) {
          console.warn('⚠ Page load time exceeds 3 seconds');
        }
      }, 0);
    });
  }
};

// Initialize app
App.init();

// Make App available globally for debugging
window.App = App;

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
