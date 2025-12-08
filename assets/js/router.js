// Simple SPA Router for Nizar & Partners website

let currentPage = '';

async function navigateTo(pageName) {
    // Prevent reloading the same page
    if (pageName === currentPage) {
        return;
    }

    const pageContent = document.getElementById('page-content');

    // Fade out current content
    pageContent.classList.remove('fade-in');
    pageContent.classList.add('fade-out');

    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
        // Fetch new page content
        const response = await fetch(`pages/${pageName}.html`);

        if (!response.ok) {
            throw new Error(`Page not found: ${pageName}`);
        }

        const html = await response.text();

        // Update content
        pageContent.innerHTML = html;

        // Update current page
        currentPage = pageName;

        // Update URL hash
        window.location.hash = `#${pageName}`;

        // Update active navigation links
        updateActiveNavLinks(pageName);

        // Update page title
        updateTitle(pageName);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Fade in new content
        pageContent.classList.remove('fade-out');
        pageContent.classList.add('fade-in');

        // Reinitialize Lucide icons for new content
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Reinitialize form if on contact page
        if (pageName === 'contact' && typeof initContactForm === 'function') {
            initContactForm();
        }

    } catch (error) {
        console.error('Navigation error:', error);
        pageContent.innerHTML = `
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-4xl font-serif font-bold text-primary-900 mb-4">Page Not Found</h1>
                    <p class="text-neutral-600 mb-8">The page you're looking for doesn't exist.</p>
                    <a href="#home" class="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 inline-block">
                        Return Home
                    </a>
                </div>
            </div>
        `;
        pageContent.classList.remove('fade-out');
        pageContent.classList.add('fade-in');
    }
}

function updateActiveNavLinks(pageName) {
    // Update desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${pageName}`) {
            link.classList.add('text-accent');
        } else {
            link.classList.remove('text-accent');
        }
    });

    // Update mobile nav links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${pageName}`) {
            link.classList.add('text-accent');
        } else {
            link.classList.remove('text-accent');
        }
    });
}

function updateTitle(pageName) {
    const titles = {
        'home': 'Nizar & Partners | Advocates & Solicitors',
        'about': 'About Us | Nizar & Partners',
        'practice-areas': 'Practice Areas | Nizar & Partners',
        'team': 'Our Team | Nizar & Partners',
        'contact': 'Contact Us | Nizar & Partners'
    };

    document.title = titles[pageName] || 'Nizar & Partners';
}

// Handle browser back/forward buttons
window.addEventListener('hashchange', () => {
    const pageName = window.location.hash.slice(1) || 'home';
    navigateTo(pageName);
});

// Handle navigation link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const pageName = link.getAttribute('href').slice(1);
        navigateTo(pageName);
    }
});
