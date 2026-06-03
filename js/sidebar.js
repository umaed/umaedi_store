/**
 * UMADIGI STORE navigation system
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  navbar.innerHTML = `
    <header class="umaedi-header">
      <button class="sidebar-toggle" id="sidebarToggle" aria-label="Buka menu">
        <span class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
      <a class="header-logo" href="/index.html">
        <img src="/assets/img/umadigi-logo.svg" alt="" class="header-logo-mark">
        <span class="header-logo-text">UMADIGI <strong>STORE</strong></span>
      </a>
      <form class="header-search" role="search">
        <input id="headerSearchInput" type="search" placeholder="Cari produk digital, preset, fashion..." aria-label="Cari produk">
        <button type="submit">Cari</button>
      </form>
      <nav class="desktop-nav" aria-label="Navigasi utama">
        <a href="/index.html">Home</a>
        <a href="/pages/fashion.html">Fashion</a>
        <a href="/pages/preset.html">Preset</a>
        <a href="/pages/limited.html">Limited</a>
        <a href="/pages/rare.html">Rare</a>
      </nav>
      <a href="/pages/cart.html" class="header-cart" aria-label="Keranjang">
        <svg class="cart-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.2 6h15.1l-1.7 8.3a2 2 0 0 1-2 1.6H8.8a2 2 0 0 1-2-1.7L5.4 3.8H2.8" />
          <circle cx="9.5" cy="20" r="1.4" />
          <circle cx="17.5" cy="20" r="1.4" />
        </svg>
        <span class="cart-count" id="cart-count">0</span>
      </a>
    </header>

    <aside class="sidebar" id="sidebar" aria-label="Menu samping">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <img src="/assets/img/umadigi-logo.svg" alt="">
          <div>
            <h3>UMADIGI STORE</h3>
            <span>Menu utama</span>
          </div>
        </div>
        <button class="sidebar-close" id="sidebarClose" aria-label="Tutup menu">x</button>
      </div>
      <nav class="sidebar-nav">
        <a href="/index.html" class="sidebar-link">
          <span class="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4v-9.5Z"/></svg>
          </span>
          <span class="label">Home</span>
        </a>
        <a href="/pages/bantuan.html" class="sidebar-link">
          <span class="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 14h.01M10.4 9.3A2.2 2.2 0 1 1 12 13v1"/></svg>
          </span>
          <span class="label">Bantuan</span>
        </a>
        <a href="/pages/kontak.html" class="sidebar-link">
          <span class="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10H8l-3 3V5Z"/></svg>
          </span>
          <span class="label">Kontak</span>
        </a>
        <a href="/pages/ulasan.html" class="sidebar-link">
          <span class="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.5 5.3 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8L12 3Z"/></svg>
          </span>
          <span class="label">Rating Pelanggan</span>
        </a>
      </nav>
      <div class="sidebar-promo">
        <strong>UMADIGI Care</strong>
        <span>Butuh bantuan order? Admin siap bantu proses checkout kamu.</span>
      </div>
    </aside>

    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <nav class="mobile-bottom-nav" aria-label="Navigasi mobile">
      <a href="/index.html" data-nav-path="/index.html">
        <svg viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4v-9.5Z"/></svg>
        <span>Home</span>
      </a>
      <a href="/pages/preset.html" data-nav-path="/pages/preset.html">
        <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4V5Zm3 3v8h10V8H7Z"/></svg>
        <span>Preset</span>
      </a>
      <a href="/pages/pm-jkt48.html" data-nav-path="/pages/pm-jkt48.html" class="nav-feature">
        <svg viewBox="0 0 24 24"><path d="M12 3.5 14.5 9l6 .7-4.4 4.1 1.1 5.9L12 16.8l-5.2 2.9 1.1-5.9-4.4-4.1 6-.7L12 3.5Z"/></svg>
        <span>JKT48</span>
      </a>
      <a href="/pages/cart.html" data-nav-path="/pages/cart.html">
        <svg viewBox="0 0 24 24"><path d="M6 6h15l-1.7 8.2A2 2 0 0 1 17.4 16H8.7a2 2 0 0 1-2-1.7L5.4 4H3"/><circle cx="9.5" cy="20" r="1.4"/><circle cx="17.5" cy="20" r="1.4"/></svg>
        <span>Cart</span>
        <strong class="bottom-cart-count" id="bottom-cart-count">0</strong>
      </a>
      <a href="/pages/kontak.html" data-nav-path="/pages/kontak.html">
        <svg viewBox="0 0 24 24"><path d="M5 5h14v10H8l-3 3V5Z"/></svg>
        <span>Admin</span>
      </a>
    </nav>
  `;

  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const searchForm = navbar.querySelector('.header-search');
  const searchInput = document.getElementById('headerSearchInput');

  const openSidebar = () => {
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  sidebarToggle.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const keyword = searchInput.value.trim().toLowerCase();
    if (window.searchProductsByKeyword) {
      window.searchProductsByKeyword(keyword);
    }
  });

  const currentPath = window.location.pathname;
  if (currentPath.includes('/cart.html') || currentPath.includes('/checkout.html') || currentPath.includes('/product-detail.html')) {
    document.body.classList.add('hide-bottom-nav');
  }
  navbar.querySelectorAll('.desktop-nav a, .sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if ((currentPath === '/' && href === '/index.html') || currentPath === href) {
      link.classList.add('active');
    }
  });

  navbar.querySelectorAll('.mobile-bottom-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if ((currentPath === '/' && href === '/index.html') || currentPath === href) {
      link.classList.add('active');
    }
  });

  updateCartCount();
});

window.playUmadigiSound = function playUmadigiSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1046, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch (error) {
    // Sound is optional and may be blocked by browser settings.
  }
};

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const bottomCartCount = document.getElementById('bottom-cart-count');
  const cartLink = document.querySelector('.header-cart');
  const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  if (cartCount) {
    cartCount.textContent = itemCount > 0 ? itemCount : '0';
  }
  if (bottomCartCount) {
    bottomCartCount.textContent = itemCount > 0 ? itemCount : '0';
    bottomCartCount.classList.toggle('show', itemCount > 0);
  }
  if (cartLink) {
    cartLink.classList.remove('cart-bump');
    window.requestAnimationFrame(() => {
      cartLink.classList.add('cart-bump');
    });
  }
}

window.addEventListener('cartUpdated', updateCartCount);
