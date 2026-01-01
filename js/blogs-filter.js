// blogs-filter.js - Filter blogs posts by category

class blogsFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.blogs-filters .filter-btn');
        this.blogCards = document.querySelectorAll('.blogs-card');
        this.blogsGrid = document.querySelector('.blogs-grid');
        this.currentFilter = 'all';
        
        this.init();
    }
    
    init() {
        // Add click events to filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterPosts(button.dataset.category);
            });
        });
        
        // Check URL hash for initial filter
        this.checkURLHash();
        
        // Initialize count display
        this.updateCountDisplay('all');
    }
    
    filterPosts(category) {
        this.currentFilter = category;
        
        // Update active button
        this.updateActiveButton(category);
        
        // Filter posts with animation
        this.animateFilter(category);
        
        // Update URL
        this.updateURL(category);
        
        // Update count display
        this.updateCountDisplay(category);
        
        // Scroll to top of grid on mobile
        this.scrollToGrid();
    }
    
    updateActiveButton(category) {
        this.filterButtons.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.category === category) {
                button.classList.add('active');
            }
        });
    }
    
    animateFilter(category) {
        // Add filtering class for animations
        this.blogsGrid.classList.add('filtering');
        
        // Filter each card
        this.blogCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            // Remove previous filter classes
            card.classList.remove('filtered-in', 'filtered-out');
            
            // Apply appropriate class
            if (category === 'all' || cardCategory === category) {
                setTimeout(() => {
                    card.classList.add('filtered-in');
                }, 50);
            } else {
                card.classList.add('filtered-out');
            }
        });
        
        // Remove filtering class after animation
        setTimeout(() => {
            this.blogsGrid.classList.remove('filtering');
        }, 400);
    }
    
    updateCountDisplay(category) {
        const countElement = document.getElementById('blogsCount');
        if (!countElement) return;
        
        let count = 0;
        if (category === 'all') {
            // Count all non-coming-soon posts
            count = document.querySelectorAll('.blogs-card:not(.coming-soon)').length;
        } else {
            // Count posts in specific category (excluding coming-soon)
            count = document.querySelectorAll(`.blogs-card[data-category="${category}"]:not(.coming-soon)`).length;
        }
        
        countElement.textContent = count;
    }
    
    updateURL(category) {
        if (category === 'all') {
            history.replaceState(null, null, window.location.pathname);
        } else {
            history.replaceState(null, null, `#${category}`);
        }
    }
    
    checkURLHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash && this.isValidCategory(hash)) {
            const button = document.querySelector(`.filter-btn[data-category="${hash}"]`);
            if (button) {
                this.filterPosts(hash);
            }
        }
    }
    
    isValidCategory(category) {
        const validCategories = ['all', 'analysis', 'tutorial', 'tools', 'career'];
        return validCategories.includes(category);
    }
    
    scrollToGrid() {
        if (window.innerWidth < 768 && this.blogsGrid) {
            this.blogsGrid.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogsFilter = new blogsFilter();
});