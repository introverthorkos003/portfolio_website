// contact-form.js - Form handling with validation
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;
        
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupEventListeners();
    }

    setupValidation() {
        // Add ARIA attributes
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const errorId = input.id + 'Error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                input.setAttribute('aria-describedby', errorId);
            }
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const errorId = field.id + 'Error';
        const errorElement = document.getElementById(errorId);
        
        let isValid = true;
        
        switch(field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                break;
            case 'text':
            case 'textarea':
                isValid = value.length > 0;
                break;
            case 'select-one':
                isValid = value !== '';
                break;
        }
        
        if (field.id === 'captcha') {
            isValid = value === '10';
        }
        
        // Update UI
        if (isValid) {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
            if (errorElement) errorElement.classList.remove('show');
        } else {
            field.classList.add('error');
            field.setAttribute('aria-invalid', 'true');
            if (errorElement) errorElement.classList.add('show');
        }
        
        return isValid;
    }

    async submitForm(formData) {
        // Simulate API call - replace with actual backend
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', Object.fromEntries(formData));
                resolve({ success: true, message: 'Message sent successfully!' });
            }, 1500);
        });
    }

    showMessage(type, text) {
        // Remove existing messages
        const existingMsg = this.form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();
        
        // Create new message
        const message = document.createElement('div');
        message.className = `form-message form-message--${type}`;
        message.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${text}</span>
        `;
        
        this.form.insertBefore(message, this.form.firstChild);
        
        // Auto-remove after 5 seconds
        if (type === 'success') {
            setTimeout(() => message.remove(), 5000);
        }
    }

    setupEventListeners() {
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                input.classList.remove('error');
                input.setAttribute('aria-invalid', 'false');
                const errorId = input.id + 'Error';
                const errorElement = document.getElementById(errorId);
                if (errorElement) errorElement.classList.remove('show');
            });
        });
        
        // Form submission
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                this.showMessage('error', 'Please fix the errors above.');
                return;
            }
            
            // Disable submit button
            const submitBtn = this.form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Prepare form data
                const formData = new FormData(this.form);
                
                // Submit form (replace with actual API endpoint)
                const result = await this.submitForm(formData);
                
                if (result.success) {
                    this.showMessage('success', result.message);
                    this.form.reset();
                } else {
                    this.showMessage('error', result.message || 'Failed to send message.');
                }
            } catch (error) {
                console.error('Form error:', error);
                this.showMessage('error', 'An error occurred. Please try again.');
            } finally {
                // Re-enable submit button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // PGP key copy functionality
        const copyBtn = document.getElementById('copyPgpBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                const pgpKey = document.getElementById('pgpKey').textContent;
                try {
                    await navigator.clipboard.writeText(pgpKey);
                    
                    // Visual feedback
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy:', err);
                    alert('Failed to copy PGP key. Please select and copy manually.');
                }
            });
        }
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});