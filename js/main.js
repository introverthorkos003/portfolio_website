// main.js - Unified JavaScript for entire portfolio
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setCurrentYear();
        this.setupMobileMenu();
        this.setActiveNavLink();
        this.setupSmoothScrolling();
        this.initTheme();
        this.setupImageLoading();
    }

    setCurrentYear() {
        try {
            const yearElement = document.getElementById('currentYear');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        } catch (error) {
            console.error('Error setting current year:', error);
        }
    }

    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuToggle || !navLinks) return;
        
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
            menuToggle.innerHTML = isExpanded 
                ? '<i class="fas fa-times" aria-hidden="true"></i>'
                : '<i class="fas fa-bars" aria-hidden="true"></i>';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
                menuToggle.focus();
            }
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
            });
        });
    }

   setActiveNavLink() {
    try {
        // Normalize current path
        let currentPath = window.location.pathname;

        // Remove trailing slash except root
        if (currentPath.length > 1 && currentPath.endsWith('/')) {
            currentPath = currentPath.slice(0, -1);
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            let linkPath = link.getAttribute('href');

            // Normalize link path
            if (linkPath.length > 1 && linkPath.endsWith('/')) {
                linkPath = linkPath.slice(0, -1);
            }

            const isActive = linkPath === currentPath;

            link.classList.toggle('active', isActive);
            link.setAttribute('aria-current', isActive ? 'page' : null);
        });
    } catch (error) {
        console.error('Error setting active nav link:', error);
    }
}


    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#' || targetId === '#!') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const position = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: position,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, targetId);
                    
                    // Focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                    setTimeout(() => target.removeAttribute('tabindex'), 1000);
                }
            });
        });
    }

    initTheme() {
        try {
            // Load saved theme or default to light
            const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
            this.applyTheme(savedTheme);
            
            // Setup theme toggle button if exists
            const themeToggle = document.getElementById('navThemeToggle');
            if (themeToggle) {
                this.updateThemeButton(themeToggle, savedTheme);
                themeToggle.addEventListener('click', () => {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'light' ? 'cyber' : 'light';
                    this.switchTheme(newTheme);
                });
                
                // Keyboard support
                themeToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const currentTheme = document.documentElement.getAttribute('data-theme');
                        const newTheme = currentTheme === 'light' ? 'cyber' : 'light';
                        this.switchTheme(newTheme);
                    }
                });
            }
            
            // Listen for theme changes from terminal
            document.addEventListener('themechange', (e) => {
                this.switchTheme(e.detail.theme);
            });
            
        } catch (error) {
            console.error('Error initializing theme:', error);
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Enable/disable cyber theme CSS
        const cyberTheme = document.getElementById('cyberThemeCSS');
        if (cyberTheme) {
            cyberTheme.disabled = theme !== 'cyber';
        } else if (theme === 'cyber') {
            // Create if doesn't exist
            const link = document.createElement('link');
            link.id = 'cyberThemeCSS';
            link.rel = 'stylesheet';
            link.href = '/css/cyber-theme.css';
            document.head.appendChild(link);
        }
    }

    switchTheme(theme) {
        this.applyTheme(theme);
        localStorage.setItem('portfolio-theme', theme);
        this.updateAllThemeButtons(theme);
        
        // Announce theme change for screen readers
        this.announceThemeChange(theme);
    }

    updateAllThemeButtons(theme) {
        // Update navbar button
        const navToggle = document.getElementById('navThemeToggle');
        if (navToggle) {
            this.updateThemeButton(navToggle, theme);
        }
        
        // Update terminal button if exists
        const termToggle = document.getElementById('themeToggle');
        if (termToggle && termToggle.querySelector('.btn-text')) {
            termToggle.querySelector('.btn-text').textContent = 
                theme === 'cyber' ? '$ default' : '$ whoami';
        }
    }

    updateThemeButton(button, theme) {
        const icon = button.querySelector('i');
        const text = button.querySelector('span');
        
        if (icon && text) {
            if (theme === 'cyber') {
                icon.className = 'fas fa-sun';
                icon.setAttribute('aria-hidden', 'true');
                text.textContent = 'Light Mode';
            } else {
                icon.className = 'fas fa-moon';
                icon.setAttribute('aria-hidden', 'true');
                text.textContent = 'Dark Mode';
            }
        }
    }

    announceThemeChange(theme) {
        // Create announcement for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = `Theme changed to ${theme} mode`;
        
        document.body.appendChild(announcement);
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 3000);
    }

    setupImageLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src && !img.src) {
                            img.src = img.dataset.src;
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            images.forEach(img => {
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    imageObserver.observe(img);
                    // Fallback if IntersectionObserver doesn't fire
                    setTimeout(() => {
                        if (!img.classList.contains('loaded') && img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                        }
                    }, 3000);
                }
            });
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
            });
        }
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Utility function for checking elements
function ensureElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
    return element;
}

// Add loading state class
document.documentElement.classList.add('js-loading');
window.addEventListener('load', () => {
    document.documentElement.classList.remove('js-loading');
    document.documentElement.classList.add('js-loaded');
});