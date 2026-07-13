// animation.js - UMADIGI STORE

document.addEventListener('DOMContentLoaded', () => {
  if (!sessionStorage.getItem('umadigi_splash_seen')) {
    showUmadigiSplash();
    sessionStorage.setItem('umadigi_splash_seen', '1');
  }

  // Loader fade out
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 250);
  }
});

function showUmadigiSplash() {
  const savedLogo = localStorage.getItem('umadigi_brand_logo');
  const logoSrc = savedLogo || '/assets/img/brand.png' || '/assets/img/umadigi-logo.svg';
  const splash = document.createElement('div');
  splash.className = 'umadigi-splash';
  splash.innerHTML = `
    <div class="splash-card">
      <img src="${logoSrc}" alt="UMADIGI STORE">
      <strong>UMADIGI STORE</strong>
      <span>Smart shopping for digital creators</span>
    </div>
  `;
  document.body.appendChild(splash);

  setTimeout(() => {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 480);
  }, 1150);
}

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
