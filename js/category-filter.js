/**
 * Category filter with subtle slide animation
 */

let currentCategory = 'all';
let isAnimating = false;

function filterProductsByCategory(category) {
  if (isAnimating || currentCategory === category) return;

  const productsSection = document.getElementById('featured-products');
  if (!productsSection) return;

  isAnimating = true;
  productsSection.style.opacity = '0';
  productsSection.style.transform = 'translateY(14px)';
  productsSection.style.transition = 'all 0.22s ease';

  setTimeout(() => {
    currentCategory = category;

    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const categoryBtn = document.querySelector(`[data-category="${category}"]`);
    if (categoryBtn) {
      categoryBtn.classList.add('active');
    }

    displayProductsByCategory(category);

    productsSection.style.opacity = '1';
    productsSection.style.transform = 'translateY(0)';

    setTimeout(() => {
      productsSection.style.transition = 'none';
      isAnimating = false;
    }, 220);
  }, 180);
}

function displayProductsByCategory(category) {
  const productsSection = document.getElementById('featured-products');
  if (!productsSection) return;

  let productsToDisplay = [];

  if (category === 'all') {
    const rareProducts = products.filter(p => p.category === 'rare');
    const limitedProducts = products.filter(p => p.category === 'limited');
    const presetProducts = products.filter(p => p.category === 'preset');
    const fashionProducts = products.filter(p => p.category === 'fashion');
    productsToDisplay = [...rareProducts, ...limitedProducts, ...presetProducts, ...fashionProducts];
  } else if (category === 'jkt48') {
    productsToDisplay = products.filter(p =>
      p.category === 'rare' ||
      p.id.includes('jkt48') ||
      p.name.toLowerCase().includes('jkt48')
    );
  } else {
    productsToDisplay = products.filter(p => p.category === category);
  }

  productsSection.innerHTML = '';

  if (productsToDisplay.length === 0) {
    productsSection.innerHTML = `
      <div class="empty-products">
        <strong>Produk belum tersedia.</strong>
        <span>Admin sedang menyiapkan stok terbaik untuk kategori ini.</span>
      </div>
    `;
    return;
  }

  productsToDisplay.forEach((product, idx) => {
    productsSection.appendChild(createProductCard(product, idx));
  });

  attachProductButtonEvents(productsSection);
}

document.addEventListener('DOMContentLoaded', () => {
  currentCategory = 'all';
  const firstBtn = document.querySelector('.category-btn');
  if (firstBtn) {
    firstBtn.classList.add('active');
  }
  displayProductsByCategory('all');
});
