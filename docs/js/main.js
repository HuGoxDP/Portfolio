// Main JavaScript functionality
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupCopyButtons();
    this.setupScrollHighlight();
  }

  // Copy to clipboard functionality
  setupCopyButtons() {
    window.copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        this.showNotification('Скопійовано!');
      }).catch(err => {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.showNotification('Скопійовано!');
      });
    };
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--accent);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(124,58,237,0.3);
      animation: slideIn 0.3s ease;
    `;
    
    // Add CSS animation
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2500);
  }

  // Smooth scrolling for navigation links
  setupNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = target.offsetTop - navHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Active navigation highlighting
  setupScrollHighlight() {
    window.addEventListener('scroll', () => {
      const sections = ['hero', 'experience', 'projects', 'skills', 'contact', 'education'];
      const navHeight = document.querySelector('.nav').offsetHeight;
      
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (section && navLink) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= navHeight + 50 && rect.bottom >= navHeight + 50) {
            document.querySelectorAll('.nav-links a').forEach(link => 
              link.style.color = 'var(--muted)'
            );
            navLink.style.color = 'var(--accent)';
          }
        }
      });
    });
  }
}

// Print functionality
function printResume() {
  window.print();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
});

// Global functions for HTML onclick handlers
window.copyToClipboard = (text) => window.portfolioApp?.copyToClipboard(text);
window.printResume = printResume;
