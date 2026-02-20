/**
 * Sidebar Navigation System
 * Mobile-friendly sidebar with animations
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  
  // Create sidebar and header
  navbar.innerHTML = `
    <!-- Header with Logo -->
    <header class="umaedi-header">
      <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">
        <span class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <div class="header-logo">UMAEDI <span class="gold">STORE</span></div>
      <a href="/pages/cart.html" class="header-cart">
        🛒
        <span class="cart-count" id="cart-count">0</span>
      </a>
    </header>

    <!-- Sidebar Navigation -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <h3>Menu</h3>
        <button class="sidebar-close" id="sidebarClose" aria-label="Close sidebar">✕</button>
      </div>
      <nav class="sidebar-nav">
        <a href="/" class="sidebar-link">
          <span class="icon">🏠</span>
          <span class="label">Home</span>
        </a>
        <a href="/pages/about.html" class="sidebar-link">
          <span class="icon">ℹ️</span>
          <span class="label">About</span>
        </a>
        <a href="/pages/bantuan.html" class="sidebar-link">
          <span class="icon">❓</span>
          <span class="label">Bantuan</span>
        </a>
        <a href="/pages/kontak.html" class="sidebar-link">
          <span class="icon">📞</span>
          <span class="label">Kontak</span>
        </a>
        <a href="/pages/pengaturan.html" class="sidebar-link">
          <span class="icon">⚙️</span>
          <span class="label">Pengaturan</span>
        </a>
        <a href="/pages/ulasan.html" class="sidebar-link">
          <span class="icon">⭐</span>
          <span class="label">Ulasan</span>
        </a>
        <a href="/pages/faq.html" class="sidebar-link">
          <span class="icon">📋</span>
          <span class="label">FAQ</span>
        </a>
      </nav>
    </aside>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
  `;

  // Sidebar toggle functionality
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  const toggleSidebar = () => {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  sidebarToggle.addEventListener('click', toggleSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  // Close sidebar when a link is clicked
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  // Highlight active link
  const links = navbar.querySelectorAll('.sidebar-link');
  const currentPath = window.location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href');
    // Check if current path matches the link href
    if (currentPath === '/' && href === '/') {
      link.classList.add('active');
    } else if (currentPath.includes(href.replace('/', '')) && href !== '/') {
      link.classList.add('active');
    }
  });

  // Update cart count
  updateCartCount();
});

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
    cartCount.textContent = cart.length > 0 ? cart.length : '';
  }
}

// Listen for cart updates
window.addEventListener('cartUpdated', updateCartCount);
