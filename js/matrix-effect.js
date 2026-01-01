// matrix-effect.js - Matrix rain effect for cyber theme
class MatrixEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.isRunning = false;
        this.chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        this.charArray = this.chars.split("");
        this.fontSize = 16;
        this.columns = 0;
        this.drops = [];
        this.resizeTimeout = null;
        
        this.init();
    }

    init() {
        // Check if user prefers reduced motion
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.prefersReducedMotion) {
            return;
        }
        
        // Only run if cyber theme is active
        if (document.documentElement.getAttribute('data-theme') === 'cyber') {
            this.createCanvas();
            this.setupMatrix();
            this.start();
        }
        
        // Listen for theme changes
        document.addEventListener('themechange', (e) => {
            if (e.detail.theme === 'cyber') {
                this.start();
            } else {
                this.stop();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    createCanvas() {
        // Check if canvas already exists
        this.canvas = document.getElementById('matrixCanvas');
        
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'matrixCanvas';
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.zIndex = '-1';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.opacity = '0.15';
            this.canvas.style.mixBlendMode = 'screen';
            document.body.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
    }

    setupMatrix() {
        // Performance mode detection
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (this.prefersReducedMotion) {
            return; // Don't run if user prefers reduced motion
        }
        
        this.handleResize();
    }

    handleResize() {
        if (!this.canvas || !this.ctx || this.prefersReducedMotion) return;
        
        // Debounce resize
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            
            // Adjust for performance on mobile
            const density = this.isMobile ? 0.5 : 1;
            this.columns = Math.floor(this.canvas.width / this.fontSize * density);
            
            // Initialize drops
            this.drops = new Array(this.columns);
            for (let i = 0; i < this.columns; i++) {
                this.drops[i] = Math.random() * -100; // Start above screen
            }
        }, 100);
    }

    draw() {
        if (!this.ctx || !this.canvas || this.prefersReducedMotion || !this.isRunning) return;
        
        // Semi-transparent black rectangle for trail effect
        this.ctx.fillStyle = 'rgba(5, 5, 15, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px "JetBrains Mono", monospace`;
        this.ctx.textAlign = 'center';
        
        for (let i = 0; i < this.drops.length; i++) {
            // Skip some columns on mobile for performance
            if (this.isMobile && i % 2 === 0) continue;
            
            const x = i * this.fontSize / (this.isMobile ? 0.5 : 1);
            const y = this.drops[i];
            
            // Only draw if within canvas bounds
            if (y > 0 && y < this.canvas.height + this.fontSize) {
                // Random character
                const charIndex = Math.floor(Math.random() * this.charArray.length);
                const text = this.charArray[charIndex];
                
                // Draw with subtle glow
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = '#00ff41';
                this.ctx.fillText(text, x, y);
                this.ctx.shadowBlur = 0;
                
                // Occasionally draw a bright leading character
                if (Math.random() > 0.97) {
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.fillText(text, x, y - this.fontSize);
                    this.ctx.fillStyle = '#00ff41';
                }
            }
            
            // Move drop
            this.drops[i] += this.fontSize * (this.isMobile ? 0.5 : 1);
            
            // Randomly reset drop
            if (this.drops[i] > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = Math.random() * -100;
            }
        }
    }

    animate() {
        if (!this.isRunning || this.prefersReducedMotion) return;
        
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    start() {
        if (this.isRunning || this.prefersReducedMotion) return;
        
        this.isRunning = true;
        
        // Create canvas if it doesn't exist
        if (!this.canvas) {
            this.createCanvas();
        }
        
        this.handleResize();
        this.animate();
    }

    stop() {
        this.isRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // Clear canvas
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    cleanup() {
        this.stop();
        
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
            this.canvas = null;
        }
        
        window.removeEventListener('resize', () => this.handleResize());
        window.removeEventListener('beforeunload', () => this.cleanup());
        document.removeEventListener('themechange', () => {});
    }
}

// Initialize matrix effect
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.matrixEffect = new MatrixEffect();
    });
} else {
    window.matrixEffect = new MatrixEffect();
}