/**
 * UMADIGI STORE navigation system
 */

const firebaseReady = import('./firebase.js')
  .then(() => window.firebaseStore)
  .catch(error => {
    console.warn('Modul akun tidak tersedia:', error);
    return null;
  });

const UMADIGI_ACCOUNT_KEY = 'umadigi_account_profile';

function getUmadigiProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem(UMADIGI_ACCOUNT_KEY) || 'null');
    if (profile?.name && profile?.uid && !profile?.isGuest) return profile;
  } catch (error) {
    // Invalid saved data will be replaced by a fresh guest profile.
  }
  return null;
}

function saveUmadigiProfile(profile) {
  localStorage.setItem(UMADIGI_ACCOUNT_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent('umadigiProfileUpdated', { detail: profile }));
}

function getProfileInitial(name) {
  return (name || 'U').trim().charAt(0).toUpperCase();
}

window.getUmadigiUserName = function getUmadigiUserName() {
  return getUmadigiProfile()?.name || 'User';
};

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const savedProfile = getUmadigiProfile();
  const savedBrandLogo = localStorage.getItem('umadigi_brand_logo');
  const brandLogoSrc = savedBrandLogo || '/assets/img/brand.png' || '/assets/img/umadigi-logo.svg';

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
        <img src="${brandLogoSrc}" alt="Logo" class="header-logo-mark">
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
          <img src="${brandLogoSrc}" alt="Logo">
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
        <a href="/pages/riwayat.html" class="sidebar-link">
          <span class="icon">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5V4Zm3 4h8v2H8V8Zm0 4h8v2H8v-2Zm0 4h5v2H8v-2Z"/></svg>
          </span>
          <span class="label">Riwayat</span>
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
      <div class="sidebar-account">
        <div class="sidebar-account-avatar" id="sidebarAccountAvatar">${getProfileInitial(savedProfile?.name || 'User')}</div>
        <div class="sidebar-account-info">
          <span>Akun Kamu</span>
          <strong id="sidebarAccountName">${savedProfile?.name || 'Belum masuk'}</strong>
        </div>
        <button id="editAccountButton" type="button">Masuk</button>
      </div>
      <div class="sidebar-promo">
        <strong>UMADIGI Care</strong>
        <span>Butuh bantuan order? Admin siap bantu proses checkout kamu.</span>
      </div>
    </aside>

    <div class="sidebar-overlay" id="sidebarOverlay"></div>
    <div class="account-modal" id="accountModal" hidden>
      <div class="account-modal-card">
        <span class="account-modal-badge">UMADIGI ACCOUNT</span>
        <h2 id="accountModalTitle">Masuk ke akun</h2>
        <p id="accountModalDescription">Gunakan username dan kata sandi kamu. Email tidak diperlukan.</p>
        <div class="account-mode-switch" role="tablist" aria-label="Mode akun">
          <button id="loginModeButton" type="button" class="is-active">Masuk</button>
          <button id="registerModeButton" type="button">Buat akun</button>
        </div>
        <input id="accountNameInput" type="text" maxlength="20" placeholder="Username" autocomplete="username">
        <input id="accountPasswordInput" type="password" minlength="6" placeholder="Kata sandi (minimal 6 karakter)" autocomplete="current-password">
        <small id="accountFeedback" class="account-feedback" role="alert"></small>
        <div class="account-modal-actions">
          <button id="saveAccountButton" type="button">Masuk</button>
        </div>
      </div>
    </div>
    <div class="live-activity-float" id="liveActivityFloat" aria-live="polite"></div>
    <nav class="mobile-bottom-nav" aria-label="Navigasi mobile">
      <a href="/index.html" data-nav-path="/index.html">
        <svg viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20h-5v-6H9v6H4v-9.5Z"/></svg>
        <span>Home</span>
      </a>
      <a href="/pages/preset.html" data-nav-path="/pages/preset.html">
        <svg viewBox="0 0 24 24"><path d="M4 5h16v14H4V5Zm3 3v8h10V8H7Z"/></svg>
        <span>Digital</span>
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
  const accountModal = document.getElementById('accountModal');
  const accountNameInput = document.getElementById('accountNameInput');
  const accountPasswordInput = document.getElementById('accountPasswordInput');
  const accountFeedback = document.getElementById('accountFeedback');
  const accountModalTitle = document.getElementById('accountModalTitle');
  const accountModalDescription = document.getElementById('accountModalDescription');
  const loginModeButton = document.getElementById('loginModeButton');
  const registerModeButton = document.getElementById('registerModeButton');
  const saveAccountButton = document.getElementById('saveAccountButton');
  const editAccountButton = document.getElementById('editAccountButton');
  const sidebarAccountName = document.getElementById('sidebarAccountName');
  const sidebarAccountAvatar = document.getElementById('sidebarAccountAvatar');
  let accountMode = 'login';

  const updateAccountUI = profile => {
    if (sidebarAccountName) sidebarAccountName.textContent = profile?.name || 'User';
    if (sidebarAccountAvatar) sidebarAccountAvatar.textContent = getProfileInitial(profile?.name || 'User');
  };

  const openAccountModal = () => {
    if (!accountModal) return;
    const profile = getUmadigiProfile();
    accountNameInput.value = profile?.isGuest ? '' : profile?.name || '';
    accountPasswordInput.value = '';
    accountFeedback.textContent = '';
    accountModal.hidden = false;
    document.body.classList.add('account-modal-open');
    setTimeout(() => accountNameInput?.focus(), 80);
  };

  const setAccountMode = mode => {
    accountMode = mode;
    const registering = mode === 'register';
    accountModalTitle.textContent = registering ? 'Buat akun baru' : 'Masuk ke akun';
    accountModalDescription.textContent = registering ? 'Buat username unik dan kata sandi. Email tidak diperlukan.' : 'Gunakan username dan kata sandi kamu. Email tidak diperlukan.';
    accountPasswordInput.placeholder = registering ? 'Buat kata sandi (minimal 6 karakter)' : 'Kata sandi';
    saveAccountButton.textContent = registering ? 'Daftar' : 'Masuk';
    loginModeButton.classList.toggle('is-active', !registering);
    registerModeButton.classList.toggle('is-active', registering);
    accountFeedback.textContent = '';
  };

  const closeAccountModal = () => {
    if (!accountModal) return;
    accountModal.hidden = true;
    document.body.classList.remove('account-modal-open');
  };

  const finishAccount = profile => {
    saveUmadigiProfile(profile);
    updateAccountUI(profile);
    closeAccountModal();
    window.renderBuyerLiveTicker?.();
    window.renderEventLiveTicker?.();
  };

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
  editAccountButton?.addEventListener('click', openAccountModal);
  loginModeButton?.addEventListener('click', () => setAccountMode('login'));
  registerModeButton?.addEventListener('click', () => setAccountMode('register'));
  saveAccountButton?.addEventListener('click', async () => {
    const username = accountNameInput.value.trim();
    const password = accountPasswordInput.value;
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      accountFeedback.textContent = 'Username 3-20 karakter: huruf, angka, atau garis bawah.';
      return;
    }
    if (password.length < 6) {
      accountFeedback.textContent = 'Kata sandi minimal 6 karakter.';
      return;
    }
    const firebaseStore = window.firebaseStore || await firebaseReady;
    if (!firebaseStore) {
      accountFeedback.textContent = 'Sistem akun sedang dimuat, coba lagi sebentar.';
      return;
    }
    saveAccountButton.disabled = true;
    accountFeedback.textContent = 'Memproses...';
    try {
      const profile = accountMode === 'register'
        ? await firebaseStore.createAccount(username, password)
        : await firebaseStore.login(username, password);
      finishAccount({ name: profile.username, uid: profile.uid, isGuest: false });
    } catch (error) {
      accountFeedback.textContent = error.message === 'USERNAME_TAKEN'
        ? 'Username telah digunakan.'
        : accountMode === 'register' ? 'Akun gagal dibuat. Username mungkin sudah digunakan.' : 'Username atau kata sandi salah.';
    } finally {
      saveAccountButton.disabled = false;
    }
  });
  accountPasswordInput?.addEventListener('keydown', event => {
    if (event.key === 'Enter') saveAccountButton?.click();
  });

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
  setAccountMode(savedProfile?.isGuest ? 'register' : 'login');
  if (!savedProfile) {
    openAccountModal();
  } else {
    updateAccountUI(savedProfile);
  }
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
