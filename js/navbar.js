// navbar.js - UMAEDI STORE

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  navbar.innerHTML = `
    <div class="navbar-logo">UMAEDI <span class="gold">STORE</span></div>
    <div class="navbar-links">
      <a href="/index.html" class="navbar-link">Home</a>
      <a href="/pages/fashion.html" class="navbar-link">Fashion</a>
      <a href="/pages/preset.html" class="navbar-link">Preset</a>
      <a href="/pages/limited.html" class="navbar-link">Limited</a>
      <a href="/pages/rare.html" class="navbar-link">Rare</a>
      <a href="/pages/pm-jkt48.html" class="navbar-link">JKT48</a>
    </div>
    <a href="/pages/cart.html" class="navbar-cart">
      🛒
      <span class="navbar-cart-count" id="cart-count">0</span>
    </a>
  `;
  
  // Highlight active link
  const links = navbar.querySelectorAll('.navbar-link');
  const currentPath = window.location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) || (currentPath === '/' && href.includes('index'))) {
      link.classList.add('active');
    }
  });
  
  // Update cart count
  updateCartCount();
});

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const cartLink = document.querySelector('.navbar-cart');
  
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
    const itemCount = cart.length;
    
    if (itemCount > 0) {
      cartCount.textContent = itemCount;
      
      // Add animation and styling class
      if (cartLink) {
        cartLink.classList.add('has-items');
        
        // Trigger animation on each update
        cartLink.style.animation = 'none';
        setTimeout(() => {
          cartLink.style.animation = 'cartBounce 0.6s ease-out';
        }, 10);
      }
    } else {
      cartCount.textContent = '';
      
      // Remove styling when cart is empty
      if (cartLink) {
        cartLink.classList.remove('has-items');
        cartLink.style.animation = 'none';
      }
    }
  }
}

// Listen for cart updates
window.addEventListener('cartUpdated', updateCartCount);