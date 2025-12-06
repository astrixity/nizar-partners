/* =================================
   Router Module
   Dynamic Page Loading with AJAX
   ================================= */

const Router = {
  currentPage: '',

  /**
   * Navigate to a page
   * @param {string} pageName - Page name to navigate to
   */
  async navigateTo(pageName) {
    if (this.currentPage === pageName) return;

    this.currentPage = pageName;
    const pageContent = document.getElementById('page-content');
    const mainElement = document.querySelector('.main');

    // Close mobile menu
    if (window.Navigation) {
      window.Navigation.closeMobileMenu();
    }

    // Update URL hash
    window.location.hash = pageName;

    // Update active nav links
    this.updateActiveNavLinks(pageName);

    // Show loading state
    pageContent.innerHTML = `
      <div class="loading-container">
        <div class="loader"></div>
        <p>Loading...</p>
      </div>
    `;

    try {
      // Fetch page content from static/pages/
      const response = await fetch(`/static/pages/${pageName}.html`);

      if (response.ok) {
        const content = await response.text();

        // Hide content immediately
        pageContent.style.opacity = '0';
        pageContent.classList.remove('page-transition');
        
        // Wait for fade out
        await new Promise(resolve => setTimeout(resolve, 150));

        // Set new content
        pageContent.innerHTML = content;

        // Scroll to top immediately
        window.scrollTo({ top: 0, behavior: 'auto' });

        // Update page title
        this.updateTitle(pageName);

        // Update header transparency
        if (window.updateHeaderTransparency) {
          window.updateHeaderTransparency(pageName);
        }

        // Update main element class for home page
        if (mainElement) {
          if (pageName === 'home') {
            mainElement.classList.add('main--home');
          } else {
            mainElement.classList.remove('main--home');
          }
        }

        // Re-initialize animations for new content
        if (window.Animations) {
          // First load: initialize, subsequent: reinit
          if (!window.Animations.observer) {
            window.Animations.init();
          } else {
            window.Animations.reinit();
          }
        }

        // Wait a brief moment for animations to set up
        await new Promise(resolve => setTimeout(resolve, 50));

        // Fade in content
        pageContent.classList.add('page-transition');
        pageContent.style.opacity = '1';

        // Re-initialize form if on contact page
        if (pageName === 'contact' && window.Form) {
          setTimeout(() => {
            window.Form.init();
          }, 150);
        }
      } else {
        // 404 error
        pageContent.innerHTML = `
          <div class="error-container">
            <h1>Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <button onclick="Router.navigateTo('home')" class="btn btn--primary">Go Home</button>
          </div>
        `;
      }
    } catch (error) {
      // Network error
      console.error('Error loading page:', error);
      pageContent.innerHTML = `
        <div class="error-container">
          <h1>Connection Error</h1>
          <p>Unable to load the page. Please check your connection.</p>
          <button onclick="Router.navigateTo('${pageName}')" class="btn btn--primary">Try Again</button>
        </div>
      `;
    }
  },

  /**
   * Update active navigation links
   * @param {string} pageName - Current page name
   */
  updateActiveNavLinks(pageName) {
    document.querySelectorAll('.nav__link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-nav') === pageName) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  },

  /**
   * Update page title
   * @param {string} pageName - Current page name
   */
  updateTitle(pageName) {
    const titles = {
      'home': 'Nizar & Partners | Advocates & Solicitors in Kuala Lumpur',
      'about': 'About Us | Nizar & Partners',
      'practice-areas': 'Practice Areas | Nizar & Partners',
      'our-people': 'Our People | Nizar & Partners',
      'articles': 'Articles | Nizar & Partners',
      'contact': 'Contact Us | Nizar & Partners'
    };
    document.title = titles[pageName] || titles['home'];
  },

  /**
   * Initialize the router
   */
  init() {
    // Handle hash changes (back/forward buttons)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.substring(1) || 'home';
      if (hash !== this.currentPage) {
        this.navigateTo(hash);
      }
    });

    // Load initial page on DOMContentLoaded
    window.addEventListener('DOMContentLoaded', () => {
      const hash = window.location.hash.substring(1) || 'home';
      this.navigateTo(hash);
    });
  }
};

// Make globally available
window.Router = Router;

// Initialize router
Router.init();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Router;
}
