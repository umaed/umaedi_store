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
    id: 'limited-creator-bundle',
    name: 'Creator Starter Bundle',
    price: 149000,
    originalPrice: 249000,
    img: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=700&q=80',
    category: 'limited',
    tag: 'LIMITED',
    tagClass: 'tag-limited',
    selectType: 'cart',
    rating: 4.8,
    sold: 312
  },
  {
    id: 'limited-hoodie',
    name: 'UMADIGI Signature Hoodie',
    price: 189000,
    originalPrice: 260000,
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80',
    category: 'limited',
    tag: 'FLASH',
    tagClass: 'tag-limited',
    selectType: 'cart',
    rating: 4.7,
    sold: 97
  },
  {
    id: 'fashion-1',
    name: 'Techwear Daily Jacket',
    price: 229000,
    originalPrice: 319000,
    img: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80',
    category: 'fashion',
    selectType: 'cart',
    rating: 4.8,
    sold: 184
  },
  {
    id: 'fashion-2',
    name: 'Minimal Cargo Pants',
    price: 159000,
    originalPrice: 219000,
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=700&q=80',
    category: 'fashion',
    selectType: 'cart',
    rating: 4.6,
    sold: 143
  },
  {
    id: 'fashion-3',
    name: 'Clean Street Sneakers',
    price: 249000,
    originalPrice: 350000,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80',
    category: 'fashion',
    selectType: 'cart',
    rating: 4.9,
    sold: 221
  },
  {
    id: 'fashion-4',
    name: 'Digital Creator Tote Bag',
    price: 79000,
    originalPrice: 119000,
    img: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80',
    category: 'fashion',
    selectType: 'cart',
    rating: 4.7,
    sold: 188
  },
  {
    id: 'preset-1',
    name: 'Lightroom Preset Warm Pro',
    price: 49000,
    originalPrice: 99000,
    img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=80',
    category: 'preset',
    selectType: 'cart',
    rating: 4.9,
    sold: 680
  },
  {
    id: 'preset-2',
    name: 'Cinematic Mobile Filter Set',
    price: 59000,
    originalPrice: 129000,
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80',
    category: 'preset',
    selectType: 'cart',
    rating: 4.8,
    sold: 534
  },
  {
    id: 'preset-3',
    name: 'Color Grade Social Bundle',
    price: 89000,
    originalPrice: 159000,
    img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
    category: 'preset',
    selectType: 'cart',
    rating: 4.7,
    sold: 401
  },
  {
    id: 'preset-4',
    name: 'Professional LUT Pack',
    price: 109000,
    originalPrice: 199000,
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80',
    category: 'preset',
    selectType: 'cart',
    rating: 4.9,
    sold: 276
  }
];

const localProductFallbacks = {
  'rare-pm-jkt48': getAssetPath('assets/img/pmjkt48.png'),
  'limited-creator-bundle': getAssetPath('assets/img/product-creator-bundle.png'),
  'limited-hoodie': getAssetPath('assets/img/product-hoodie.png'),
  'fashion-1': getAssetPath('assets/img/product-jacket.png'),
  'fashion-2': getAssetPath('assets/img/product-pants.png'),
  'fashion-3': getAssetPath('assets/img/product-sneakers.png'),
  'fashion-4': getAssetPath('assets/img/product-tote.png'),
  'preset-1': getAssetPath('assets/img/product-preset-warm.png'),
  'preset-2': getAssetPath('assets/img/product-cinematic.png'),
  'preset-3': getAssetPath('assets/img/product-color-grade.png'),
  'preset-4': getAssetPath('assets/img/product-lut.png')
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
  card.className = 'product-card';
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
        <button class="product-btn" data-id="${product.id}" data-type="${product.selectType}">
          ${product.selectType === 'redirect' ? 'Lihat Detail' : 'Tambah'}
        </button>
        ${product.selectType === 'cart' ? `<button class="product-btn secondary" data-id="${product.id}" data-action="favorite">Suka</button>` : ''}
      </div>
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

window.searchProductsByKeyword = function searchProductsByKeyword(keyword) {
  if (document.getElementById('featured-products')) {
    renderProducts('featured-products', null, keyword);
  }
};

document.addEventListener('DOMContentLoaded', () => {
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
