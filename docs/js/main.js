// Main JavaScript functionality
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupCopyButtons();
    this.setupVideoModals();
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

  // Video modal functionality
  setupVideoModals() {
    document.querySelectorAll('button[data-video]').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-video');
        const title = btn.closest('.card').querySelector('h3').innerText || 'Відео демонстрація';
        this.openVideoModal(url, title);
      });
    });

    // Setup modal close events
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('closeBtn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeVideoModal());
    }
    
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target.id === 'modal') this.closeVideoModal();
      });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeVideoModal();
    });
  }

  openVideoModal(url, title) {
    const modal = document.getElementById('modal');
    const player = document.getElementById('player');
    const modalTitle = document.getElementById('modalTitle');
    
    if (modal && player && modalTitle) {
      modalTitle.innerText = title;
      player.src = url;
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  closeVideoModal() {
    const modal = document.getElementById('modal');
    const player = document.getElementById('player');
    
    if (modal && player) {
      player.src = '';
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Active navigation highlighting
  setupScrollHighlight() {
    window.addEventListener('scroll', () => {
      const sections = ['about', 'skills', 'projects', 'contact', 'cv', 'certificates'];
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
