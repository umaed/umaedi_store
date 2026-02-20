// product.js - UMAEDI STORE - Complete Product Data

const products = [
  // RARE PRODUCTS
  {
    id: 'rare-pm-jkt48',
    name: 'PM Member JKT48',
    price: 10000,
    img: 'https://play-lh.googleusercontent.com/Hybb58DOAQqIfGUWnuKM8A1VkZCUmf6Jsx--62R2tLhufAHjn5dL3Z7oi0lgeQ6o89zm',
    category: 'rare',
    tag: 'RARE',
    tagClass: 'tag-rare',
    link: '../pages/pm-jkt48.html',
    selectType: 'redirect',
    rating: 5.1
  },
  
  // LIMITED EDITION PRODUCTS
  {
    id: 'limited-hoodie',
    name: 'Limited Edition Hoodie',
    price: 850000,
    originalPrice: 1200000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'limited',
    tag: 'LIMITED',
    tagClass: 'tag-limited',
    selectType: 'cart',
    rating: 4.7
  },
  {
    id: 'limited-tee',
    name: 'Exclusive T-Shirt',
    price: 450000,
    originalPrice: 650000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'limited',
    tag: 'LIMITED',
    tagClass: 'tag-limited',
    selectType: 'cart',
    rating: 4.6
  },
  
  // FASHION PRODUCTS
  {
    id: 'fashion-1',
    name: 'Premium Jacket',
    price: 1200000,
    originalPrice: 1600000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'fashion',
    selectType: 'cart',
    rating: 4.8
  },
  {
    id: 'fashion-2',
    name: 'Casual Pants',
    price: 650000,
    originalPrice: 900000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'fashion',
    selectType: 'cart',
    rating: 4.5
  },
  {
    id: 'fashion-3',
    name: 'Designer Shoes',
    price: 1800000,
    originalPrice: 2400000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'fashion',
    selectType: 'cart',
    rating: 4.9
  },
  {
    id: 'fashion-4',
    name: 'Luxury Watch',
    price: 3500000,
    originalPrice: 5000000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'fashion',
    selectType: 'cart',
    rating: 4.7
  },
  
  // PRESET PRODUCTS
  {
    id: 'preset-1',
    name: 'Lightroom Preset Pack',
    price: 249000,
    originalPrice: 399000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'preset',
    selectType: 'cart',
    rating: 4.8
  },
  {
    id: 'preset-2',
    name: 'Cinematic Filter Set',
    price: 399000,
    originalPrice: 599000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'preset',
    selectType: 'cart',
    rating: 4.6
  },
  {
    id: 'preset-3',
    name: 'Color Grade Bundle',
    price: 549000,
    originalPrice: 799000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'preset',
    selectType: 'cart',
    rating: 4.7
  },
  {
    id: 'preset-4',
    name: 'Professional LUT Pack',
    price: 699000,
    originalPrice: 999000,
    img: '../assets/img/placeholder-200x200.png',
    category: 'preset',
    selectType: 'cart',
    rating: 4.9
  }
];

function renderProducts(sectionId, filterCategory) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  section.innerHTML = '';
  const filtered = filterCategory 
    ? products.filter(p => p.category === filterCategory)
    : products;
  
  filtered.forEach((product, idx) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animation = `slideUpLuxury 0.6s ease-out ${idx * 0.08}s forwards`;
    
    const discount = product.originalPrice 
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
    
    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${product.img}" alt="${product.name}" class="product-img" onerror="this.src='../assets/img/placeholder-200x200.png'" />
        ${discount > 0 ? `<div style="position:absolute;top:8px;right:8px;background:#e53935;color:#fff;padding:4px 12px;border-radius:8px;font-weight:700;font-size:0.8rem;">-${discount}%</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-tags">
          ${product.tag ? `<span class="product-tag ${product.tagClass}">${product.tag}</span>` : ''}
        </div>
        <div class="product-title">${product.name}</div>
        <div class="product-rating">⭐ ${product.rating || 4.5}</div>
        <div class="product-price-section">
          <span class="product-price">Rp${product.price.toLocaleString('id-ID')}</span>
          ${product.originalPrice ? `<span class="product-original-price">Rp${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="product-btn" data-id="${product.id}" data-type="${product.selectType}">
            ${product.selectType === 'redirect' ? '🔍 Pilih' : 'Add'}
          </button>
          ${product.selectType === 'cart' ? `<button class="product-btn secondary" data-id="${product.id}" data-action="favorite">❤️</button>` : ''}
        </div>
      </div>
    `;
    section.appendChild(card);
  });
  
  // Button event listeners
  section.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = btn.getAttribute('data-id');
      const type = btn.getAttribute('data-type');
      const action = btn.getAttribute('data-action');
      const product = products.find(p => p.id === id);
      if (!product) return;
      
      if (action === 'favorite') {
        handleFavorite(btn);
      } else if (type === 'redirect') {
        window.location.href = product.link;
      } else {
        addToCart(product, btn);
      }
    });
  });
}

function addToCart(product, btn) {
  let cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  
  // Add adminFee property if not exists (10000 for regular products)
  if (!product.adminFee) {
    product.adminFee = 10000;
  }
  
  // Check if product already exists (for tracking purposes)
  const existingItem = cart.find(item => item.id === product.id);
  
  cart.push(product);
  localStorage.setItem('umaedi_cart', JSON.stringify(cart));
  
  // Visual feedback
  btn.textContent = '✓ Added';
  btn.style.background = '#4caf50';
  setTimeout(() => {
    btn.textContent = 'Add';
    btn.style.background = '';
  }, 1200);
  
  // Update cart count
  window.dispatchEvent(new Event('cartUpdated'));
}

function handleFavorite(btn) {
  btn.classList.toggle('favorite');
  btn.style.color = btn.classList.contains('favorite') ? '#e53935' : '#1a1a1a';
}

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