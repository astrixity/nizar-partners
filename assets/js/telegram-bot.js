// Telegram Bot Configuration (obfuscated)
const SALT = 'NizarPartners2025';

// Simple deobfuscation function
function deobfuscate(encoded) {
    try {
        const decoded = atob(encoded);
        let result = '';
        for (let i = 0; i < decoded.length; i++) {
            result += String.fromCharCode(decoded.charCodeAt(i) ^ SALT.charCodeAt(i % SALT.length));
        }
        return result;
    } catch (e) {
        console.error('Deobfuscation failed');
        return '';
    }
}

// Obfuscated credentials
const TELEGRAM_BOT_TOKEN = deobfuscate('XUpQVgMCEhYJRU4ZEAdCXksPRRcSVQwXAEpLQR0RQU4GD0pOQ0caBRdL');
const TELEGRAM_CHAT_ID = deobfuscate('JloeGBkVFxoZGg4a');

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone') || 'Not provided';
            const subject = formData.get('subject') || 'No subject';
            const message = formData.get('message');

            // Format message for Telegram
            const telegramMessage = `
🔔 <b>New Contact Form Submission</b>

👤 <b>Name:</b> ${name}
📧 <b>Email:</b> ${email}
📱 <b>Phone:</b> ${phone}
📋 <b>Subject:</b> ${subject}

💬 <b>Message:</b>
${message}

⏰ <b>Submitted:</b> ${new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' })}
            `.trim();

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> Sending...';

            // Re-initialize lucide icons for the loader
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            try {
                // Send to Telegram
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: telegramMessage,
                        parse_mode: 'HTML'
                    })
                });

                const result = await response.json();

                if (result.ok) {
                    // Success
                    showMessage('success', '✅ Message sent successfully! We\'ll get back to you soon.');
                    contactForm.reset();
                } else {
                    // Telegram API error
                    console.error('Telegram API error:', result);
                    showMessage('error', '❌ Failed to send message. Please try again or contact us directly via email.');
                }
            } catch (error) {
                // Network or other error
                console.error('Error sending message:', error);
                showMessage('error', '❌ Failed to send message. Please try again or contact us directly via email.');
            } finally {
                // Restore button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;

                // Re-initialize lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        });
    }

    function showMessage(type, text) {
        const formMessage = document.getElementById('form-message');

        if (type === 'success') {
            formMessage.className = 'mb-6 p-4 rounded-lg bg-green-50 border-2 border-green-200 text-green-800';
        } else {
            formMessage.className = 'mb-6 p-4 rounded-lg bg-red-50 border-2 border-red-200 text-red-800';
        }

        formMessage.textContent = text;
        formMessage.classList.remove('hidden');

        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }
    }
});
