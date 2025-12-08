// Contact Form Validation and Handler

function initContactForm() {
    const form = document.getElementById('contact-form');

    if (!form) return; // Form not on current page

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form elements
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        const submitBtn = form.querySelector('button[type="submit"]');
        const messageDiv = document.getElementById('form-message');

        // Clear previous messages
        clearMessage();

        // Validate required fields
        if (!nameInput.value.trim()) {
            showMessage('Please enter your name.', 'error');
            nameInput.focus();
            return;
        }

        if (!emailInput.value.trim()) {
            showMessage('Please enter your email address.', 'error');
            emailInput.focus();
            return;
        }

        // Validate email format
        if (!isValidEmail(emailInput.value.trim())) {
            showMessage('Please enter a valid email address.', 'error');
            emailInput.focus();
            return;
        }

        if (!messageInput.value.trim()) {
            showMessage('Please enter your message.', 'error');
            messageInput.focus();
            return;
        }

        // Disable submit button
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 inline-block animate-spin"></i> Sending...';

        // Reinitialize icons for loader
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        showMessage('Thank you for your message! We will get back to you soon.', 'success');

        // Reset form
        form.reset();

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        // Reinitialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('form-message');
    if (!messageDiv) return;

    messageDiv.className = `p-4 rounded-lg mb-6 ${
        type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
    }`;

    messageDiv.innerHTML = `
        <div class="flex items-center gap-3">
            <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-5 h-5"></i>
            <span>${text}</span>
        </div>
    `;

    messageDiv.classList.remove('hidden');

    // Reinitialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            clearMessage();
        }, 5000);
    }
}

function clearMessage() {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.classList.add('hidden');
        messageDiv.innerHTML = '';
    }
}
