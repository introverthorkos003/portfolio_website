// theme-switcher.js - Terminal interface for theme switching
class TerminalSwitcher {
    constructor() {
        this.terminal = document.getElementById('themeTerminal');
        if (!this.terminal) return;
        
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }

    init() {
        this.setupElements();
        this.setupCommands();
        this.setupEventListeners();
        this.showWelcome();
    }

    setupElements() {
        this.overlay = document.querySelector('.terminal-overlay') || this.createOverlay();
        this.input = document.getElementById('terminalInput');
        this.content = this.terminal.querySelector('.terminal-content');
        this.closeBtn = this.terminal.querySelector('.terminal-close');
        this.minimizeBtn = this.terminal.querySelector('.terminal-minimize');
        
        // Create overlay if doesn't exist
        if (!document.querySelector('.terminal-overlay')) {
            this.createOverlay();
        }
    }

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'terminal-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        document.body.appendChild(overlay);
        return overlay;
    }

    setupCommands() {
        this.commands = {
            'whoami': () => this.handleWhoami(),
            'default': () => this.handleDefault(),
            'help': () => this.showHelp(),
            'clear': () => this.clearTerminal(),
            'exit': () => this.closeTerminal(),
            'ls': () => this.showFiles(),
            'pwd': () => this.showPwd(),
            'date': () => this.showDate(),
            'neofetch': () => this.showNeofetch(),
            'matrix': () => this.toggleMatrix(),
            'theme': () => this.showThemeInfo(),
            'about': () => this.showAbout(),
            'contact': () => this.showContact()
        };
    }

    handleWhoami() {
        this.addOutput('Switching to cybersecurity theme...');
        
        // Show loading animation
        this.showLoading();
        
        // Dispatch theme change event (main.js will handle it)
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('themechange', {
                detail: { theme: 'cyber' }
            }));
            
            this.addOutput('<span class="success">✓ Theme activated successfully!</span>', true);
            this.addOutput('Matrix effect initialized.', true);
            this.addOutput('Type "default" to return to normal theme.');
            this.addOutput('Type "matrix" to toggle matrix effect.');
        }, 800);
    }

    handleDefault() {
        this.addOutput('Returning to default theme...');
        
        // Show loading animation
        this.showLoading();
        
        document.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: 'light' }
        }));
        
        setTimeout(() => {
            this.addOutput('<span class="success">✓ Theme restored successfully!</span>', true);
        }, 500);
    }

    showHelp() {
        this.addOutput('Available commands:');
        this.addOutput('<code>whoami</code> - Switch to cybersecurity theme');
        this.addOutput('<code>default</code> - Return to normal theme');
        this.addOutput('<code>help</code> - Show this help message');
        this.addOutput('<code>clear</code> - Clear terminal');
        this.addOutput('<code>exit</code> - Close terminal');
        this.addOutput('<code>ls</code> - List directory contents');
        this.addOutput('<code>pwd</code> - Print working directory');
        this.addOutput('<code>date</code> - Show current date and time');
        this.addOutput('<code>neofetch</code> - Show system information');
        this.addOutput('<code>matrix</code> - Toggle matrix rain effect');
        this.addOutput('<code>theme</code> - Show current theme info');
        this.addOutput('<code>about</code> - About this portfolio');
        this.addOutput('<code>contact</code> - Contact information');
    }

    clearTerminal() {
        const lines = this.content.querySelectorAll('.terminal-line');
        lines.forEach(line => {
            if (!line.classList.contains('current-line')) {
                line.remove();
            }
        });
        this.addOutput('<span class="info">Terminal cleared.</span>', true);
    }

    closeTerminal() {
        this.terminal.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.terminal.setAttribute('aria-hidden', 'true');
        
        // Focus back on toggle button for accessibility
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.focus();
        }
    }

    openTerminal() {
        this.terminal.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.terminal.setAttribute('aria-hidden', 'false');
        
        // Focus on input for keyboard users
        if (this.input) {
            setTimeout(() => {
                this.input.focus();
            }, 100);
        }
    }

    showFiles() {
        this.addOutput('Portfolio Directory Structure:');
        this.addOutput('index.html          - Home page');
        this.addOutput('about.html          - About me page');
        this.addOutput('projects.html       - Projects showcase');
        this.addOutput('contact.html        - Contact form');
        this.addOutput('css/                - Stylesheets directory');
        this.addOutput('├── style.css       - Main styles');
        this.addOutput('├── cyber-theme.css - Cyber theme styles');
        this.addOutput('└── theme-switcher.css - Terminal styles');
        this.addOutput('js/                 - JavaScript directory');
        this.addOutput('├── main.js         - Core functionality');
        this.addOutput('├── theme-switcher.js - Terminal controller');
        this.addOutput('└── matrix-effect.js - Matrix rain effect');
        this.addOutput('images/             - Image assets');
        this.addOutput('assets/             - Certificates & resume');
    }

    showPwd() {
        this.addOutput('/home/Lykos/cybersecurity-portfolio');
    }

    showDate() {
        const now = new Date();
        this.addOutput(now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        }));
    }

    showNeofetch() {
        this.addOutput('┌──────────────────────────────────────┐');
        this.addOutput('│ Lykos\'s Cybersecurity Portfolio     │');
        this.addOutput('├──────────────────────────────────────┤');
        this.addOutput('│ OS: Kali Linux 2025.4                │');
        this.addOutput('│ Shell: zsh 5.9                       │');
        this.addOutput('│ Theme: Professional / Cyber          │');
        this.addOutput('│ Terminal: Web Terminal v1.0          │');
        this.addOutput('│ Uptime: Always learning              │');
        this.addOutput('│ Packages: Updating security projects │');
        this.addOutput('└──────────────────────────────────────┘');
    }

    toggleMatrix() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme !== 'cyber') {
            this.addOutput('<span class="error">Matrix effect only available in cyber theme.</span>', true);
            this.addOutput('Type "whoami" to switch to cyber theme first.');
            return;
        }
        
        if (window.matrixEffect && window.matrixEffect.isRunning) {
            window.matrixEffect.stop();
            this.addOutput('Matrix effect stopped.');
        } else {
            if (window.matrixEffect) {
                window.matrixEffect.start();
                this.addOutput('Matrix effect started.');
            } else {
                this.addOutput('<span class="error">Matrix effect not available.</span>', true);
            }
        }
    }

    showThemeInfo() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        this.addOutput(`Current theme: ${currentTheme}`);
        this.addOutput(`Theme saved: ${localStorage.getItem('portfolio-theme') || 'default (light)'}`);
        
        if (currentTheme === 'cyber') {
            this.addOutput('Features:');
            this.addOutput('  • Matrix rain effect');
            this.addOutput('  • Green/black color scheme');
            this.addOutput('  • Terminal-style interface');
            this.addOutput('  • Glowing elements');
        } else {
            this.addOutput('Features:');
            this.addOutput('  • Clean professional design');
            this.addOutput('  • Blue/white color scheme');
            this.addOutput('  • Responsive layout');
            this.addOutput('  • Accessible interface');
        }
    }

    showAbout() {
        this.addOutput('About Ranjit Pandey:');
        this.addOutput('Cybersecurity enthusiast,aspiring ethical hacker and Software Developer.');
        this.addOutput('Currently learning penetration testing and security tools.');
        this.addOutput('Currently learning react native');
        this.addOutput('');
        this.addOutput('Skills:');
        this.addOutput('  • Network Security');
        this.addOutput('  • Python Scripting');
        this.addOutput('  • Web Application Security');
        this.addOutput('  • Security Tools (Nmap, Wireshark, Metasploit)');
        this.addOutput('');
        this.addOutput('Visit about page for more information.');
    }

    showContact() {
        this.addOutput('Contact Information:');
        this.addOutput('  • Email: contact@pandeyranjit.com.np');
        this.addOutput('  • Security: info@pandeyranjit.com.np');
        this.addOutput('  • GitHub: github.com/lykos3');
        this.addOutput('  • LinkedIn: linkedin.com/in/lykos3');
        this.addOutput('');
        this.addOutput('PGP Key available on contact page.');
        this.addOutput('Type "exit" to close terminal and visit contact page');
    }

    showLoading() {
        const loadingLine = document.createElement('div');
        loadingLine.className = 'terminal-line loading';
        loadingLine.innerHTML = `
            <span class="prompt"></span>
            <span class="loading-text">[
                <span class="loading-dot">.</span>
                <span class="loading-dot">.</span>
                <span class="loading-dot">.</span>
            ]</span>
        `;
        
        const currentLine = this.content.querySelector('.current-line');
        this.content.insertBefore(loadingLine, currentLine);
        
        // Remove after animation
        setTimeout(() => {
            if (loadingLine.parentNode) {
                loadingLine.remove();
            }
        }, 800);
    }

    addOutput(text, isHTML = false) {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line';
        
        if (isHTML) {
            outputLine.innerHTML = text;
        } else {
            outputLine.textContent = text;
        }
        
        const currentLine = this.content.querySelector('.current-line');
        if (currentLine) {
            this.content.insertBefore(outputLine, currentLine);
        } else {
            this.content.appendChild(outputLine);
        }
        
        // Auto-scroll to bottom
        const terminalBody = this.terminal.querySelector('.terminal-body');
        if (terminalBody) {
            setTimeout(() => {
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }, 10);
        }
    }

    processCommand(command) {
        const cmd = command.trim().toLowerCase();
        if (!cmd) return;
        
        // Add command to history
        this.addToHistory(cmd);
        
        // Add command to terminal display
        this.addOutput(`<span class="prompt">user@portfolio:~$</span> <span class="command">${this.escapeHtml(cmd)}</span>`, true);
        
        try {
            // Process command
            if (this.commands[cmd]) {
                this.commands[cmd]();
            } else if (cmd.startsWith('echo ')) {
                const message = cmd.substring(5);
                this.addOutput(message);
            } else {
                this.addOutput(`<span class="error">Command not found:</span> ${this.escapeHtml(cmd)}. Type "help" for available commands.`, true);
            }
        } catch (error) {
            console.error('Command error:', error);
            this.addOutput(`<span class="error">Error executing command:</span> ${error.message}`, true);
        }
        
        // Clear input
        if (this.input) {
            this.input.value = '';
            this.input.focus();
        }
    }

    addToHistory(command) {
        if (command.trim()) {
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
        }
    }

    getPreviousCommand() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            return this.commandHistory[this.historyIndex];
        }
        return '';
    }

    getNextCommand() {
        if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            return this.commandHistory[this.historyIndex];
        } else if (this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            return '';
        }
        return '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupEventListeners() {
        // Terminal toggle button
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.openTerminal());
            toggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.openTerminal();
                }
            });
        }
        
        // Try terminal button
        const tryBtn = document.getElementById('tryTerminalBtn');
        if (tryBtn) {
            tryBtn.addEventListener('click', () => this.openTerminal());
        }
        
        // Overlay close
        this.overlay.addEventListener('click', () => this.closeTerminal());
        
        // Close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeTerminal());
        }
        
        // Minimize button
        if (this.minimizeBtn) {
            this.minimizeBtn.addEventListener('click', () => {
                this.terminal.classList.toggle('minimized');
                if (this.terminal.classList.contains('minimized')) {
                    this.addOutput('<span class="info">Terminal minimized. Click restore button to reopen.</span>', true);
                }
            });
        }
        
        // Input handling
        if (this.input) {
            this.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.processCommand(this.input.value);
                } else if (e.key === 'Escape') {
                    this.closeTerminal();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.input.value = this.getPreviousCommand();
                    this.input.setSelectionRange(this.input.value.length, this.input.value.length);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.input.value = this.getNextCommand();
                    this.input.setSelectionRange(this.input.value.length, this.input.value.length);
                }
            });
            
            // Prevent paste of malicious code
            this.input.addEventListener('paste', (e) => {
                const pastedText = e.clipboardData.getData('text');
                if (pastedText.length > 100) {
                    e.preventDefault();
                    this.addOutput('<span class="error">Pasted text too long. Maximum 100 characters allowed.</span>', true);
                }
            });
        }
        
        // Keyboard shortcut (Ctrl+`)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '`') {
                e.preventDefault();
                if (this.terminal.classList.contains('active')) {
                    this.closeTerminal();
                } else {
                    this.openTerminal();
                }
            }
            
            // Close terminal with Escape
            if (e.key === 'Escape' && this.terminal.classList.contains('active')) {
                this.closeTerminal();
            }
        });
        
        // Trap focus inside terminal when open
        this.terminal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            
            const focusableElements = this.terminal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        });
        
        // Konami code easter egg
        this.setupKonamiCode();
    }

    setupKonamiCode() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 
            'ArrowDown', 'ArrowDown', 
            'ArrowLeft', 'ArrowRight', 
            'ArrowLeft', 'ArrowRight', 
            'b', 'a', 'Enter'
        ];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    this.openTerminal();
                    this.addOutput('<span class="success">🎮 Konami code activated! Secret mode unlocked!</span>', true);
                    this.addOutput('Initializing advanced features...');
                    setTimeout(() => {
                        document.dispatchEvent(new CustomEvent('themechange', {
                            detail: { theme: 'cyber' }
                        }));
                        this.addOutput('Cyber theme activated with enhanced effects!');
                    }, 1000);
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    showWelcome() {
        const hasVisited = localStorage.getItem('terminalVisited');
        if (!hasVisited && this.content) {
            setTimeout(() => {
                this.addOutput('<span class="info">Welcome to Ranjit Pandey\'s Portfolio Terminal!</span>', true);
                this.addOutput('Type "help" to see available commands.', true);
                this.addOutput('Tip: Try typing "whoami" to unlock the cyber theme.', true);
                this.addOutput(' ');
                localStorage.setItem('terminalVisited', 'true');
            }, 500);
        }
    }
}

// Initialize terminal switcher
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.terminalSwitcher = new TerminalSwitcher();
    });
} else {
    window.terminalSwitcher = new TerminalSwitcher();
}