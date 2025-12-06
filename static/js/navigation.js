/* =================================
   Navigation Module
   Mobile Menu & Nav Behavior
   ================================= */

const Navigation = {
  /**
   * Initialize navigation
   */
  init() {
    this.header = document.querySelector('.header');
    this.mobileToggle = document.querySelector('.mobile-menu-toggle');
    this.nav = document.querySelector('.nav');
    this.navLinks = document.querySelectorAll('.nav__link');

    this.setupMobileMenu();
    this.setupScrollBehavior();
    this.setupNavLinks();
  },

  /**
   * Setup mobile menu toggle
   */
  setupMobileMenu() {
    if (!this.mobileToggle || !this.nav) return;

    this.mobileToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.nav.classList.contains('active') &&
          !this.nav.contains(e.target) &&
          !this.mobileToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.nav.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    const isOpen = this.nav.classList.toggle('active');
    this.mobileToggle.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll when menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  },

  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.nav.classList.remove('active');
    this.mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },

  /**
   * Setup navigation links
   */
  setupNavLinks() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Mobile menu will be closed by router
        // Add active state will be handled by router
      });
    });
  },

  /**
   * Setup scroll behavior for header
   */
  setupScrollBehavior() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add scrolled class when scrolled down
      if (currentScroll > 50) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  },

  /**
   * Update header transparency based on current page
   * @param {string} pageName - Current page name
   */
  updateHeaderTransparency(pageName) {
    if (pageName === 'home') {
      this.header.classList.add('header--transparent');
      // Remove scrolled class if at top
      if (window.pageYOffset <= 50) {
        this.header.classList.remove('scrolled');
      }
    } else {
      this.header.classList.remove('header--transparent');
      this.header.classList.add('scrolled');
    }
  }
};

// Make available globally for router
window.Navigation = Navigation;

// Export updateHeaderTransparency for router use
window.updateHeaderTransparency = (pageName) => {
  if (Navigation.header) {
    Navigation.updateHeaderTransparency(pageName);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
