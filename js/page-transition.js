// page-transition.js - UMAEDI STORE smooth page transitions

// Add page transition effect to all internal links
document.addEventListener('DOMContentLoaded', () => {
  // Initialize page with enter animation
  const mainContent = document.getElementById('main-content') || document.querySelector('main');
  if (mainContent) {
    mainContent.style.animation = 'fadeInContent 0.8s ease-out';
  }

  // Add click handlers to navigation links
  const navLinks = document.querySelectorAll('.navbar-link, .luxury-cta');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Only apply transition for internal links
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        e.preventDefault();
        
        // Create overlay for smooth transition
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(191, 161, 74, 0.1) 0%, rgba(26, 26, 26, 0.15) 100%);
          z-index: 999;
          pointer-events: none;
          animation: overlayFade 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(overlay);
        
        // Add keyframe for overlay
        if (!document.querySelector('style[data-overlay]')) {
          const style = document.createElement('style');
          style.setAttribute('data-overlay', 'true');
          style.textContent = `
            @keyframes overlayFade {
              0% { opacity: 0; }
              50% { opacity: 1; }
              100% { opacity: 0; }
            }
          `;
          document.head.appendChild(style);
        }
        
        // Navigate after animation
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  });

  // Also add transition to cart link
  const cartLink = document.querySelector('.navbar-cart');
  if (cartLink) {
    cartLink.addEventListener('click', (e) => {
      const href = cartLink.getAttribute('href') || '/pages/cart.html';
      if (href && !href.startsWith('http')) {
        e.preventDefault();
        
        // Bounce animation on cart
        cartLink.style.animation = 'cartBounce 0.4s ease';
        
        setTimeout(() => {
          window.location.href = href;
        }, 250);
      }
    });
  }
});

// Optional: Add scroll animations for elements
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
});
