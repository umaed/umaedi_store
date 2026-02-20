/**
 * Category Filter with Slide Animation
 * Filters products and slides them with animation
 */

let currentCategory = 'all';
let isAnimating = false;

function filterProductsByCategory(category) {
  if (isAnimating || currentCategory === category) return;
  
  const productsSection = document.getElementById('featured-products');
  if (!productsSection) return;
  
  isAnimating = true;
  const categoryBtn = document.querySelector(`[data-category="${category}"]`);
  const isCategoryOnRight = categoryBtn && categoryBtn.offsetLeft > window.innerWidth / 2;
  
  // Slide out animation
  productsSection.style.opacity = '0';
  productsSection.style.transform = isCategoryOnRight ? 'translateX(-100px)' : 'translateX(100px)';
  productsSection.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
  
  setTimeout(() => {
    // Update category
    currentCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    if (categoryBtn) {
      categoryBtn.classList.add('active');
    }
    
    // Filter and display products
    displayProductsByCategory(category);
    
    // Slide in animation
    productsSection.style.opacity = '0';
    productsSection.style.transform = isCategoryOnRight ? 'translateX(100px)' : 'translateX(-100px)';
    
    setTimeout(() => {
      productsSection.style.opacity = '1';
      productsSection.style.transform = 'translateX(0)';
      
      setTimeout(() => {
        productsSection.style.transition = 'none';
        isAnimating = false;
      }, 400);
    }, 0);
  }, 400);
}

function displayProductsByCategory(category) {
  const productsSection = document.getElementById('featured-products');
  if (!productsSection) return;
  
  // Get products from product.js
  let productsToDisplay = [];
  
  if (category === 'all') {
    // Show ALL products sorted by rarity: rare first, then limited, then preset, then fashion
    const rareProducts = products.filter(p => p.category === 'rare');
    const limitedProducts = products.filter(p => p.category === 'limited');
    const presetProducts = products.filter(p => p.category === 'preset');
    const fashionProducts = products.filter(p => p.category === 'fashion');
    productsToDisplay = [...rareProducts, ...limitedProducts, ...presetProducts, ...fashionProducts];
  } else if (category === 'featured') {
    // Get featured products (first few of each category)
    const fashionProducts = products.filter(p => p.category === 'fashion').slice(0, 3);
    const presetProducts = products.filter(p => p.category === 'preset').slice(0, 2);
    const limitedProducts = products.filter(p => p.category === 'limited').slice(0, 2);
    const rareProducts = products.filter(p => p.category === 'rare').slice(0, 1);
    productsToDisplay = [...fashionProducts, ...presetProducts, ...limitedProducts, ...rareProducts];
  } else if (category === 'jkt48') {
    // For jkt48, show rare products or products with pm-jkt48 in their id
    productsToDisplay = products.filter(p => 
      p.category === 'rare' || 
      p.id.includes('jkt48') || 
      p.name.includes('JKT48')
    );
  } else {
    // Get products by selected category
    productsToDisplay = products.filter(p => p.category === category);
  }
  
  // Display products
  productsSection.innerHTML = '';
  
  if (productsToDisplay.length === 0) {
    productsSection.innerHTML = `
      <div style="text-align: center; padding: 2em; grid-column: 1/-1;">
        <p style="font-size: 1.2rem; color: #999;">Produk tidak tersedia untuk kategori ini</p>
      </div>
    `;
    return;
  }
  
  productsToDisplay.forEach((product, idx) => {
    const productCard = createProductCard(product, idx);
    productsSection.appendChild(productCard);
  });
  
  // Attach event listeners to product buttons
  productsSection.querySelectorAll('.product-btn').forEach(btn => {
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

function createProductCard(product, idx) {
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
  
  return card;
}

function viewProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    alert(`Viewing: ${product.name}\nPrice: Rp ${product.price.toLocaleString('id-ID')}`);
  }
}

function addToCart(product, btn) {
  let cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  
  // Check if product already in cart
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('umaedi_cart', JSON.stringify(cart));
  
  // Visual feedback
  btn.textContent = '✓ Added';
  btn.style.background = '#4caf50';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = 'Add';
    btn.style.background = '';
    btn.style.color = '';
  }, 1200);
  
  // Update cart count
  window.dispatchEvent(new Event('cartUpdated'));
}

function handleFavorite(btn) {
  btn.classList.toggle('favorite');
  btn.style.color = btn.classList.contains('favorite') ? '#e53935' : '#1a1a1a';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Set initial category to 'all'
  currentCategory = 'all';
  
  // Mark first category as active
  const firstBtn = document.querySelector('.category-btn');
  if (firstBtn) {
    firstBtn.classList.add('active');
  }
  
  // Load all products initially
  displayProductsByCategory('all');
});
