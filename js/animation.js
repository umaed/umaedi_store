// animation.js - UMAEDI STORE

document.addEventListener('DOMContentLoaded', () => {
  // Loader fade out
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 800);
  }
});

// Scroll reveal animation
window.addEventListener('scroll', () => {
  const revealEls = document.querySelectorAll('.product-card, .member-card');
  const trigger = window.innerHeight * 0.85;
  
  revealEls.forEach(el => {
    if (!el.classList.contains('revealed')) {
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger) {
        el.classList.add('revealed');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    }
  });
});

// Add animation classes
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.luxury-fade-in').forEach(el => {
    el.style.animation = 'fadeInLuxury 0.8s ease-out 0.2s forwards';
  });
});