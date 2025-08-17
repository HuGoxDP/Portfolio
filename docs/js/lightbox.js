// Lightbox functionality for project images
class ProjectLightbox {
  constructor() {
    this.currentImages = [];
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.createLightboxHTML();
    this.bindEvents();
  }

  createLightboxHTML() {
    const lightboxHTML = `
      <div id="lightbox" class="lightbox">
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close">✕</button>
          <button class="lightbox-nav lightbox-prev" aria-label="Previous">‹</button>
          <img class="lightbox-image" src="" alt="">
          <button class="lightbox-nav lightbox-next" aria-label="Next">›</button>
          <div class="lightbox-info"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }

  bindEvents() {
    // Close lightbox
    document.getElementById('lightbox').addEventListener('click', (e) => {
      if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close')) {
        this.close();
      }
    });

    // Navigation
    document.querySelector('.lightbox-prev').addEventListener('click', () => this.prev());
    document.querySelector('.lightbox-next').addEventListener('click', () => this.next());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('lightbox').classList.contains('show')) {
        switch(e.key) {
          case 'Escape': this.close(); break;
          case 'ArrowLeft': this.prev(); break;
          case 'ArrowRight': this.next(); break;
        }
      }
    });
  }

  open(images, startIndex = 0) {
    this.currentImages = images;
    this.currentIndex = startIndex;
    this.updateImage();
    document.getElementById('lightbox').classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  close() {
    document.getElementById('lightbox').classList.remove('show');
    document.body.style.overflow = '';
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.currentImages.length) % this.currentImages.length;
    this.updateImage();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.currentImages.length;
    this.updateImage();
  }

  updateImage() {
    const img = document.querySelector('.lightbox-image');
    const info = document.querySelector('.lightbox-info');
    const current = this.currentImages[this.currentIndex];
    
    img.src = current.src;
    img.alt = current.alt;
    info.textContent = `${this.currentIndex + 1} / ${this.currentImages.length} - ${current.alt}`;
  }
}

// Project Gallery Manager
class ProjectGallery {
  constructor() {
    this.lightbox = new ProjectLightbox();
    this.init();
  }

  init() {
    this.setupProjectGalleries();
  }

  setupProjectGalleries() {
    const projects = document.querySelectorAll('.card');
    
    projects.forEach(project => {
      const projectName = project.querySelector('h3').textContent.trim();
      const images = this.getProjectImages(project);
      
      if (images.length > 0) {
        this.createGallery(project, images, projectName);
      }
    });
  }

  getProjectImages(project) {
    const images = [];
    const coverImg = project.querySelector('.cover');
    const screenImgs = project.querySelectorAll('.screens img');
    
    // Add cover image
    if (coverImg && !coverImg.src.includes('data:image/svg+xml')) {
      images.push({
        src: coverImg.src,
        alt: coverImg.alt || 'Project Preview'
      });
    }
    
    // Add screen images
    screenImgs.forEach(img => {
      if (!img.src.includes('data:image/svg+xml')) {
        images.push({
          src: img.src,
          alt: img.alt || 'Screenshot'
        });
      }
    });

    return images;
  }

  createGallery(project, images, projectName) {
    const screensContainer = project.querySelector('.screens');
    if (!screensContainer) return;

    // Replace screens container with new gallery
    const galleryHTML = this.createGalleryHTML(images, projectName);
    screensContainer.outerHTML = galleryHTML;

    // Bind click events
    const newGallery = project.querySelector('.project-gallery');
    newGallery.querySelectorAll('.gallery-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        this.lightbox.open(images, index);
      });
    });

    // Handle cover image click
    const coverImg = project.querySelector('.cover');
    if (coverImg) {
      coverImg.addEventListener('click', () => {
        this.lightbox.open(images, 0);
      });
    }
  }

  createGalleryHTML(images, projectName) {
    const visibleImages = images.slice(0, 4);
    const remainingCount = images.length - 4;

    let galleryHTML = '<div class="project-gallery">';
    
    visibleImages.forEach((img, index) => {
      galleryHTML += `
        <div class="gallery-item" data-index="${index}">
          <img src="${img.src}" alt="${img.alt}" loading="lazy">
          <div class="gallery-overlay">
            <span class="zoom-icon">🔍</span>
          </div>
        </div>
      `;
    });

    galleryHTML += '</div>';

    if (remainingCount > 0) {
      galleryHTML += `
        <button class="expand-btn" onclick="projectGallery.lightbox.open(${JSON.stringify(images).replace(/"/g, '&quot;')}, 4)">
          Переглянути всі ${images.length} зображень
        </button>
      `;
    }

    return galleryHTML;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.projectGallery = new ProjectGallery();
});
