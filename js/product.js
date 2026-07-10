// product.js - UMADIGI STORE product catalog

const products = [
  {
    id: 'rare-pm-jkt48',
    name: 'PM Member JKT48 Access',
    price: 8000,
    img: getAssetPath('assets/img/pmjkt48.png'),
    category: 'rare',
    tag: 'RARE',
    tagClass: 'tag-rare',
    link: '../pages/pm-jkt48.html',
    selectType: 'redirect',
    rating: 4.9,
    sold: 428
  },
  {
    id: 'digital-ai-photo-edit',
    name: 'Jasa Edit Foto AI',
    price: 15000,
    originalPrice: 35000,
    img: 'https://images.unsplash.com/photo-1682685797828-d3b2561deef4?auto=format&fit=crop&w=700&q=80',
    category: 'preset',
    tag: 'AI EDIT',
    tagClass: 'tag-rare',
    selectType: 'cart',
    rating: 4.8,
    sold: 246
  }
];

const localProductFallbacks = {
  'rare-pm-jkt48': getAssetPath('assets/img/pmjkt48.png'),
  'digital-ai-photo-edit': getAssetPath('assets/img/product-color-grade.png')
};

function getProductDetailUrl(productId) {
  const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
  return `${prefix}product-detail.html?id=${encodeURIComponent(productId)}`;
}

function getAssetPath(path) {
  const isNested = window.location.pathname.includes('/pages/');
  return isNested ? `../${path}` : path;
}

function renderProducts(sectionId, filterCategory, keyword = '') {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const normalizedKeyword = keyword.trim().toLowerCase();
  let filtered = filterCategory ? products.filter(p => p.category === filterCategory) : products;

  if (normalizedKeyword) {
    filtered = filtered.filter(product => {
      return product.name.toLowerCase().includes(normalizedKeyword) ||
        product.category.toLowerCase().includes(normalizedKeyword) ||
        (product.tag || '').toLowerCase().includes(normalizedKeyword);
    });
  }

  section.innerHTML = '';

  if (filtered.length === 0) {
    section.innerHTML = `
      <div class="empty-products">
        <strong>Produk belum ditemukan.</strong>
        <span>Coba kata kunci lain atau pilih kategori berbeda.</span>
      </div>
    `;
    return;
  }

  filtered.forEach((product, idx) => {
    section.appendChild(createProductCard(product, idx));
  });

  attachProductButtonEvents(section);
}

function createProductCard(product, idx) {
  const card = document.createElement('div');
  card.className = `product-card ${product.unavailable ? 'is-unavailable' : ''}`;
  card.style.animation = `slideUpLuxury 0.45s ease-out ${idx * 0.04}s forwards`;

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  card.innerHTML = `
    <a class="product-detail-link product-img-wrapper" href="${getProductDetailUrl(product.id)}" aria-label="Lihat detail ${product.name}">
      <img src="${product.img}" alt="${product.name}" class="product-img" onerror="this.src='${localProductFallbacks[product.id] || getAssetPath('assets/img/placeholder.php')}'" />
      ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
    </a>
    <div class="product-info">
      <div class="product-tags">
        ${product.tag ? `<span class="product-tag ${product.tagClass}">${product.tag}</span>` : '<span class="product-tag tag-ready">READY</span>'}
      </div>
      <a class="product-title product-detail-link" href="${getProductDetailUrl(product.id)}">${product.name}</a>
      <div class="product-meta">
        <span>Rating ${product.rating || 4.8}</span>
        <span>Terjual ${product.sold || 50}</span>
      </div>
      <div class="product-price-section">
        <span class="product-price">Rp${product.price.toLocaleString('id-ID')}</span>
        ${product.originalPrice ? `<span class="product-original-price">Rp${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
      </div>
      <div class="product-actions">
        <button class="product-btn" data-id="${product.id}" data-type="${product.selectType}" ${product.unavailable ? 'disabled' : ''}>
          ${product.unavailable ? 'Ditutup Sementara' : product.selectType === 'redirect' ? 'Lihat Detail' : 'Tambah'}
        </button>
        ${product.selectType === 'cart' ? `<button class="product-btn secondary" data-id="${product.id}" data-action="favorite">Suka</button>` : ''}
      </div>
      ${product.unavailable ? `<p class="product-notice">${product.notice}</p>` : ''}
    </div>
  `;

  return card;
}

function attachProductButtonEvents(section) {
  section.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const type = btn.getAttribute('data-type');
      const action = btn.getAttribute('data-action');
      const product = products.find(p => p.id === id);
      if (!product) return;
      if (product.unavailable) {
        if (window.toast) window.toast.warning(product.notice || 'Produk sedang ditutup sementara.', 2600);
        return;
      }

      if (action === 'favorite') {
        handleFavorite(btn);
      } else if (type === 'redirect') {
        window.location.href = getProductDetailUrl(product.id);
      } else {
        addToCart(product, btn);
      }
    });
  });
}

function addToCart(product, btn) {
  const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1, adminFee: product.adminFee || 10000 });
  }

  localStorage.setItem('umaedi_cart', JSON.stringify(cart));

  if (window.playUmadigiSound) {
    window.playUmadigiSound();
  }
  if (window.toast) {
    window.toast.success(`${product.name} masuk keranjang`, 1800);
  }
  if (window.showLiveActivity) {
    window.showLiveActivity(`${window.getUmadigiUserName?.() || 'User'} telah menambahkan ${product.name} ke cart`, { priority: true });
  }

  btn.textContent = 'Ditambahkan';
  btn.classList.add('is-added');
  setTimeout(() => {
    btn.textContent = 'Tambah';
    btn.classList.remove('is-added');
  }, 1200);

  window.dispatchEvent(new Event('cartUpdated'));
}

function handleFavorite(btn) {
  btn.classList.toggle('favorite');
  btn.textContent = btn.classList.contains('favorite') ? 'Disukai' : 'Suka';
}

function getLiveTickerNames() {
  const baseNames = [
    'User23',
    'User1',
    'User4',
    'User5',
    'Andri',
    'Meldan Kece',
    'Anggi Kiut',
    'Rehan Punya Lily',
    'Rakha',
    'Rikynya Oline',
    'Farhan',
    'Kamunanya',
    'Ikynya Delyn',
    'Rehanmanuel',
    'Devi Gablie',
    'Gk Tau',
    'Umaedi',
    'Melisa',
    'User34',
    'Naufal',
    'Alya',
    'Dinda',
    'Raka'
  ];
  const currentName = window.getUmadigiUserName?.();
  if (currentName && !baseNames.some(name => name.toLowerCase() === currentName.toLowerCase())) {
    baseNames.unshift(currentName);
  }
  return baseNames;
}

window.renderBuyerLiveTicker = function renderBuyerLiveTicker() {
  const ticker = document.getElementById('buyer-live-track');
  if (!ticker) return;

  const names = getLiveTickerNames();
  const actions = [
    product => `menambahkan ${product.name} ke cart`,
    product => `checkout ${product.name}`,
    product => `memasukkan ${product.name} ke keranjang`,
    product => `melihat detail ${product.name}`,
    product => `membeli ${product.name}`
  ];
  const items = Array.from({ length: 20 }, (_, index) => {
    const product = products[index % products.length];
    const name = names[index % names.length];
    const action = actions[index % actions.length](product);
    return `<span>${name} telah ${action}</span>`;
  });

  ticker.innerHTML = [...items, ...items].join('');
};

window.searchProductsByKeyword = function searchProductsByKeyword(keyword) {
  if (document.getElementById('featured-products')) {
    renderProducts('featured-products', null, keyword);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  renderBuyerLiveTicker();
  if (document.getElementById('featured-products')) {
    renderProducts('featured-products', null);
  }
  if (document.getElementById('fashion-products')) {
    renderProducts('fashion-products', 'fashion');
  }
  if (document.getElementById('preset-products')) {
    renderProducts('preset-products', 'preset');
  }
  if (document.getElementById('limited-products')) {
    renderProducts('limited-products', 'limited');
  }
  if (document.getElementById('rare-products')) {
    renderProducts('rare-products', 'rare');
  }
});
