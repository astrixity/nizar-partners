/* =================================
   Animations Module - FIXED VERSION
   Scroll Reveal Animations with proper opacity handling
   ================================= */

const Animations = {
  observer: null,
  animatedElements: new Set(),

  /**
   * Initialize animations
   */
  init() {
    console.log('🎬 Animations: Initializing...');
    
    // Disconnect existing observer
    this.cleanup();

    // CRITICAL FIX: Set initial state for all animated elements
    this.setInitialState();

    // Setup new observer with scroll reveal
    this.setupScrollReveal();

    // Initial check for elements in viewport
    this.revealInViewport();
    
    console.log('✅ Animations: Initialized successfully');
    console.log('📊 Elements with [data-animate]:', document.querySelectorAll('[data-animate]').length);
  },

  /**
   * CRITICAL FIX: Set initial state for elements
   * This ensures elements start invisible before animations trigger
   */
  setInitialState() {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(element => {
      if (!this.animatedElements.has(element)) {
        // Force initial hidden state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'none'; // Prevent transition on initial set
      }
    });
    
    // Force reflow to ensure styles are applied
    document.body.offsetHeight;
    
    // Re-enable transitions
    elements.forEach(element => {
      if (!this.animatedElements.has(element)) {
        element.style.transition = '';
      }
    });
    
    console.log('🎯 Initial state set for', elements.length, 'elements');
  },

  /**
   * Cleanup existing observers
   */
  cleanup() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  },

  /**
   * Setup Intersection Observer for scroll reveal
   */
  setupScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      console.warn('⚠️ IntersectionObserver not supported, showing all elements');
      this.showAllElements();
      return;
    }

    const options = {
      root: null,
      rootMargin: '0px 0px -80px 0px', // Trigger slightly before element enters viewport
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          console.log('🎯 Animating element:', entry.target);
          
          // Animate the element
          this.animateElement(entry.target);

          // Stop observing
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements
    this.observeAnimatedElements();
  },

  /**
   * Animate a single element
   */
  animateElement(element) {
    // Mark as animated
    this.animatedElements.add(element);

    // Get animation type
    const animationType = element.getAttribute('data-animate') || 'fade-in-up';

    // Remove inline styles to let CSS take over
    element.style.opacity = '';
    element.style.transform = '';
    element.style.transition = '';

    // Add animation class
    element.classList.add(animationType);

    // Mark as done after animation
    const animationDuration = this.getAnimationDuration(element);
    setTimeout(() => {
      element.classList.add('animation-done');
    }, animationDuration);
  },

  /**
   * Observe elements that should be animated
   */
  observeAnimatedElements() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    console.log('👀 Observing', animatedElements.length, 'elements');
    
    animatedElements.forEach(element => {
      if (!this.animatedElements.has(element)) {
        this.observer.observe(element);
      }
    });
  },

  /**
   * Reveal elements already in viewport
   */
  revealInViewport() {
    const elements = document.querySelectorAll('[data-animate]');
    let revealed = 0;
    
    elements.forEach(element => {
      if (this.isInViewport(element) && !this.animatedElements.has(element)) {
        // Small delay to ensure CSS is loaded
        setTimeout(() => {
          this.animateElement(element);
        }, 50);
        
        revealed++;
      }
    });
    
    if (revealed > 0) {
      console.log('⚡ Revealed', revealed, 'elements already in viewport');
    }
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
      rect.top >= 0 &&
      rect.top <= windowHeight - 80
    );
  },

  /**
   * Get animation duration from element
   */
  getAnimationDuration(element) {
    const style = window.getComputedStyle(element);
    const duration = parseFloat(style.animationDuration) * 1000 || 800;
    const delay = parseFloat(style.animationDelay) * 1000 || 0;
    return duration + delay + 50;
  },

  /**
   * Fallback: Show all elements immediately
   */
  showAllElements() {
    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'none';
      this.animatedElements.add(element);
    });
  },

  /**
   * Reinitialize animations for newly loaded content
   */
  reinit() {
    console.log('🔄 Animations: Reinitializing for new content');
    
    // Set initial state for new elements
    this.setInitialState();
    
    // Setup observer for new elements if it exists
    if (this.observer) {
      this.observeAnimatedElements();
    } else {
      console.warn('⚠️ Observer not found, calling init() instead');
      this.init();
      return;
    }

    // Check for elements already in viewport
    this.revealInViewport();
  },

  /**
   * Force reveal an element
   */
  reveal(element, animationType = 'fade-in-up') {
    if (!element || this.animatedElements.has(element)) return;

    this.animatedElements.add(element);
    
    // Remove inline styles
    element.style.opacity = '';
    element.style.transform = '';
    element.style.transition = '';
    
    // Add animation class
    element.classList.add(animationType);

    const animationDuration = this.getAnimationDuration(element);
    setTimeout(() => {
      element.classList.add('animation-done');
    }, animationDuration);
  }
};

// Make globally available
window.Animations = Animations;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Animations;
}
