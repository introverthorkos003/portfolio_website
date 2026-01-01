// projects-filter.js - Project filtering functionality
class ProjectFilter {
    constructor() {
        this.container = document.getElementById('all-projects');
        if (!this.container) return;
        
        this.init();
    }

    init() {
        this.projects = document.querySelectorAll('.project-detail');
        this.setupCategories();
        this.setupHashNavigation();
        this.setupEventListeners();
    }

    setupCategories() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                categoryBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                
                // Filter projects
                const category = btn.dataset.category;
                this.filterProjects(category);
                
                // Update URL
                this.updateUrl(category);
            });
        });
    }

    filterProjects(category) {
        let visibleCount = 0;
        
        this.projects.forEach(project => {
            const categories = project.dataset.categories;
            
            if (category === 'all' || categories.includes(category)) {
                project.style.display = 'block';
                project.removeAttribute('aria-hidden');
                visibleCount++;
                
                // Add animation
                project.style.animation = 'fadeIn 0.5s ease';
                setTimeout(() => {
                    project.style.animation = '';
                }, 500);
            } else {
                project.style.display = 'none';
                project.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Announce results to screen readers
        this.announceResults(visibleCount, category);
    }

    announceResults(count, category) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        announcement.textContent = `Showing ${count} projects in ${category} category`;
        
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 3000);
    }

    updateUrl(category) {
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        history.replaceState(null, '', url);
    }

    setupHashNavigation() {
        // Check for hash in URL
        if (window.location.hash) {
            const targetProject = document.querySelector(window.location.hash);
            if (targetProject) {
                setTimeout(() => {
                    targetProject.scrollIntoView({ behavior: 'smooth' });
                    
                    // Highlight project
                    targetProject.style.animation = 'highlightPulse 2s';
                    targetProject.setAttribute('tabindex', '-1');
                    targetProject.focus();
                    
                    setTimeout(() => {
                        targetProject.removeAttribute('tabindex');
                        targetProject.style.animation = '';
                    }, 2000);
                }, 100);
            }
        }
        
        // Check for category in URL params
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
            if (categoryBtn) {
                categoryBtn.click();
            }
        }
    }

    setupEventListeners() {
        // Lazy load project images
        this.setupLazyLoading();
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Clear filters on Escape
                const allBtn = document.querySelector('.category-btn[data-category="all"]');
                if (allBtn) allBtn.click();
            }
        });
    }

    setupLazyLoading() {
        const projectImages = document.querySelectorAll('.project-screenshot img');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (!img.src && img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        projectImages.forEach(img => {
            if (!img.complete) {
                imageObserver.observe(img);
            }
        });
    }
}

// Initialize project filter
document.addEventListener('DOMContentLoaded', () => {
    new ProjectFilter();
});