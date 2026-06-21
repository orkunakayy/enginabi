class HeroSlider {
  constructor() {
    this.slider = document.querySelector('.hero-slider');
    this.slides = document.querySelectorAll('.hero-slide');
    this.dotsContainer = document.querySelector('.slider-dots');
    this.prevBtn = document.querySelector('.slider-arrow-prev');
    this.nextBtn = document.querySelector('.slider-arrow-next');
    
    if (!this.slider || this.slides.length === 0) return;

    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    
    // Touch tracking variables
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.createDots();
    this.updateSlider();
    this.startAutoplay();

    // Arrows
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetAutoplay();
      });
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetAutoplay();
      });
    }

    // Touch events for swiping on mobile
    this.slider.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    this.slider.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      this.handleSwipe();
    }, { passive: true });

    // Pause autoplay on hover (desktop only)
    const container = document.querySelector('.hero-slider-container');
    if (container) {
      container.addEventListener('mouseenter', () => this.stopAutoplay());
      container.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';
    for (let i = 0; i < this.slideCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('slider-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        this.goToSlide(i);
        this.resetAutoplay();
      });
      this.dotsContainer.appendChild(dot);
    }
  }

  updateSlider() {
    this.slider.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    
    // Update active dot
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.slideCount;
    this.updateSlider();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
    this.updateSlider();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlider();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const difference = this.touchStartX - this.touchEndX;
    if (Math.abs(difference) > swipeThreshold) {
      if (difference > 0) {
        // Swiped Left -> Next Slide
        this.nextSlide();
      } else {
        // Swiped Right -> Previous Slide
        this.prevSlide();
      }
      this.resetAutoplay();
    }
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HeroSlider();
});
