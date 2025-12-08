// Mobile Menu Navigation Handler

const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');

// Open mobile menu
function openMobileMenu() {
    mobileMenu.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden'); // Prevent scrolling when menu is open
}

// Close mobile menu
function closeMobileMenu() {
    mobileMenu.classList.add('translate-x-full');
    document.body.classList.remove('overflow-hidden');
}

// Toggle mobile menu
mobileMenuBtn.addEventListener('click', () => {
    openMobileMenu();
});

// Close button
mobileMenuClose.addEventListener('click', () => {
    closeMobileMenu();
});

// Close menu when clicking on a navigation link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// Close menu when clicking outside of it
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
        closeMobileMenu();
    }
});
