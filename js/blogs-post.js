// Blogs post interactions
class BlogsPost {
    constructor() {
        this.init();
    }

    init() {
        this.setupCopyButtons();
        this.setupShareButtons();
        this.updateCurrentYear();
        this.setupCodeHighlighting();
    }

    setupCopyButtons() {
        // Copy code buttons
        document.querySelectorAll('.copy-code').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const codeBlock = e.target.closest('.code-block');
                const code = codeBlock.querySelector('code').textContent;
                
                navigator.clipboard.writeText(code).then(() => {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    btn.style.color = 'var(--success-color)';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.color = '';
                    }, 2000);
                });
            });
        });

        // Copy link button
        const copyLinkBtn = document.getElementById('copyLinkBtn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    const originalHTML = copyLinkBtn.innerHTML;
                    copyLinkBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    copyLinkBtn.style.color = 'var(--success-color)';
                    
                    setTimeout(() => {
                        copyLinkBtn.innerHTML = originalHTML;
                        copyLinkBtn.style.color = '';
                    }, 2000);
                });
            });
        }
    }

    setupShareButtons() {
        document.querySelectorAll('.share-btn[data-platform]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.target.dataset.platform;
                const url = encodeURIComponent(window.location.href);
                const title = encodeURIComponent(document.title);
                const text = encodeURIComponent("Check out this cybersecurity analysis by Ranjit Pandey");
                
                let shareUrl = '';
                
                switch(platform) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                        break;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }

    updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    setupCodeHighlighting() {
        // Simple syntax highlighting for code blocks
        document.querySelectorAll('code.language-python').forEach(code => {
            const html = code.innerHTML
                .replace(/(".*?")/g, '<span class="code-string">$1</span>')
                .replace(/(def|class|import|from|as|if|else|elif|for|while|try|except|return|yield|async|await)/g, 
                        '<span class="code-keyword">$1</span>')
                .replace(/(self|True|False|None)/g, '<span class="code-constant">$1</span>')
                .replace(/(#[^\n]*)/g, '<span class="code-comment">$1</span>');
            code.innerHTML = html;
        });
        
        document.querySelectorAll('code.language-bash').forEach(code => {
            const html = code.innerHTML
                .replace(/(sudo|apt|pip|git|python|bash)/g, '<span class="code-command">$1</span>')
                .replace(/(--?\w+)/g, '<span class="code-option">$1</span>');
            code.innerHTML = html;
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new BlogsPost();
});
