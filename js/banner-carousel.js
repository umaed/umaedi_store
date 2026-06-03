/**
 * Banner Carousel System
 * Auto-scrolling carousel with manual navigation controls
 */

class BannerCarousel {
  constructor() {
    this.carousel = document.getElementById('bannerCarousel');
    this.prevBtn = document.getElementById('bannerPrev');
    this.nextBtn = document.getElementById('bannerNext');
    this.indicators = document.querySelectorAll('.indicator');
    
    if (!this.carousel) return; // Exit if carousel doesn't exist
    
    this.slides = document.querySelectorAll('.banner-slide');
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoScrollInterval = null;
    this.autoScrollDelay = 5000; // 5 seconds per banner
    this.isAutoScrolling = true;
    
    this.init();
  }

  init() {
    // Event listeners for navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Event listeners for indicators
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.goToSlide(index));
    });

    // Start auto-scrolling
    this.startAutoScroll();

    // Pause auto-scroll on hover
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoScroll());
    this.carousel.addEventListener('mouseleave', () => this.resumeAutoScroll());

    // Touch support for mobile swipe
    this.addTouchSupport();

    // Update carousel on initial load
    this.updateCarousel();
  }

  updateCarousel() {
    // Hide all slides
    this.slides.forEach((slide, index) => {
      slide.style.display = 'none';
      slide.classList.remove('inactive');
    });

    // Show current slide
    if (this.slides[this.currentIndex]) {
      this.slides[this.currentIndex].style.display = 'block';
    }

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.remove('active');
      if (index === this.currentIndex) {
        indicator.classList.add('active');
      }
    });
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateCarousel();
    this.resetAutoScroll();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
    this.resetAutoScroll();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoScroll();
  }

  startAutoScroll() {
    if (this.autoScrollInterval) return;
    
    this.autoScrollInterval = setInterval(() => {
      if (this.isAutoScrolling) {
        this.nextSlide();
      }
    }, this.autoScrollDelay);
  }

  pauseAutoScroll() {
    this.isAutoScrolling = false;
  }

  resumeAutoScroll() {
    this.isAutoScrolling = true;
  }

  resetAutoScroll() {
    // Clear and restart auto-scroll when manually navigating
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
    this.startAutoScroll();
  }

  addTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;

    this.carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
          // Swiped left - show next banner
          this.nextSlide();
        } else {
          // Swiped right - show previous banner
          this.prevSlide();
        }
      }
    };

    this.handleSwipe = handleSwipe;
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BannerCarousel();
});
