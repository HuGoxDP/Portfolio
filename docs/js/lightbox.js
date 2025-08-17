// Lightbox functionality for project images
class ProjectLightbox {
  constructor() {
    this.currentImages = [];
    this.currentIndex = 0;
    this.projectImages = {
      'physics-ar': [
        { src: './PhysicsAR/PhysicsAR_Preview.png', alt: 'Physics AR - Превью' },
        { src: './PhysicsAR/CameraScene.jpg', alt: 'Камера сцена' },
        { src: './PhysicsAR/FieldMenu.jpg', alt: 'Меню полів' },
        { src: './PhysicsAR/ScenarioSelectionMenu.jpg', alt: 'Меню сценаріїв' },
        { src: './PhysicsAR/Scenario1.jpg', alt: 'Сценарій 1' },
        { src: './PhysicsAR/Scenario2.jpg', alt: 'Сценарій 2' },
        { src: './PhysicsAR/Scenario3.jpg', alt: 'Сценарій 3' },
        { src: './PhysicsAR/Scenario4.jpg', alt: 'Сценарій 4' },
        { src: './PhysicsAR/Scenario5.jpg', alt: 'Сценарій 5' },
        { src: './PhysicsAR/ChangableField.jpg', alt: 'Змінне поле' },
        { src: './PhysicsAR/ChangableFieldAllvariants.jpg', alt: 'Всі варіанти поля' },
        { src: './PhysicsAR/ScenarioDescription.jpg', alt: 'Опис сценарію' },
        { src: './PhysicsAR/ScenarioGameplay1.jpg', alt: 'Геймплей сценарію' }
      ],
      'meme-quiz': [
        { src: './Memzy/MemeQuize_Preview.png', alt: 'Meme Quiz - Превью' },
        { src: './Memzy/MainMenu.jpg', alt: 'Головне меню' },
        { src: './Memzy/Gameplay.jpg', alt: 'Геймплей' },
        { src: './Memzy/Settings.jpg', alt: 'Налаштування' },
        { src: './Memzy/FirstType.jpg', alt: 'Перший тип питання' },
        { src: './Memzy/SecondType.jpg', alt: 'Другий тип питання' },
        { src: './Memzy/ThirdType.jpg', alt: 'Третій тип питання' },
        { src: './Memzy/GameModeSelectMenu.jpg', alt: 'Меню режимів гри' },
        { src: './Memzy/GameplayRightAnswer.jpg', alt: 'Правильна відповідь' },
        { src: './Memzy/LoadingMenu.jpg', alt: 'Меню завантаження' },
        { src: './Memzy/QuizPackLoader.jpg', alt: 'Завантажувач квіз-паків' },
        { src: './Memzy/ResultMenu.jpg', alt: 'Меню результатів' },
        { src: './Memzy/ResultMenu2.jpg', alt: 'Меню результатів 2' }
      ],
      'flappy-bird': [
        { src: './Flappybird/FlappyBird_Preview.png', alt: 'FlappyBird - Превью' },
        { src: './Flappybird/MainMenu.jpg', alt: 'Головне меню' },
        { src: './Flappybird/Game.jpg', alt: 'Гра' },
        { src: './Flappybird/Gameplay.jpg', alt: 'Геймплей' },
        { src: './Flappybird/ScoreMenu.jpg', alt: 'Меню результатів' }
      ]
    };
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Close lightbox on click outside or close button
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('lightbox') || e.target.classList.contains('lightbox-close')) {
        this.close();
      }
    });

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

  open(projectName, startIndex = 0) {
    this.currentImages = this.projectImages[projectName] || [];
    this.currentIndex = startIndex;
    if (this.currentImages.length > 0) {
      this.updateImage();
      document.getElementById('lightbox').classList.add('show');
      document.body.style.overflow = 'hidden';
    }
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
    const counter = document.querySelector('.image-counter');
    const title = document.querySelector('.image-title');
    const current = this.currentImages[this.currentIndex];
    
    if (img && current) {
      img.src = current.src;
      img.alt = current.alt;
    }
    
    if (counter) {
      counter.textContent = `${this.currentIndex + 1} / ${this.currentImages.length}`;
    }
    
    if (title) {
      title.textContent = current.alt;
    }
  }
}

// Video Modal functionality
class VideoModal {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Close modal on click outside or close button
    document.addEventListener('click', (e) => {
      if (e.target.id === 'videoModal' || e.target.classList.contains('close')) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.getElementById('videoModal').classList.contains('show')) {
        this.close();
      }
    });
  }

  open(videoUrl) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    
    if (iframe) {
      iframe.src = videoUrl;
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  close() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoFrame');
    
    if (iframe) {
      iframe.src = '';
    }
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// Initialize lightbox and video modal
document.addEventListener('DOMContentLoaded', () => {
  window.projectLightbox = new ProjectLightbox();
  window.videoModal = new VideoModal();
});

// Global functions for HTML onclick handlers
window.openLightbox = (projectName, index) => {
  if (window.projectLightbox) {
    window.projectLightbox.open(projectName, index);
  }
};

window.closeLightbox = () => {
  if (window.projectLightbox) {
    window.projectLightbox.close();
  }
};

window.prevImage = () => {
  if (window.projectLightbox) {
    window.projectLightbox.prev();
  }
};

window.nextImage = () => {
  if (window.projectLightbox) {
    window.projectLightbox.next();
  }
};

window.openVideoModal = (videoUrl) => {
  if (window.videoModal) {
    window.videoModal.open(videoUrl);
  }
};

window.closeVideoModal = () => {
  if (window.videoModal) {
    window.videoModal.close();
  }
};

window.showAllImages = (projectName) => {
  if (window.projectLightbox) {
    window.projectLightbox.open(projectName, 0);
  }
};

