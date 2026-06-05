// cart.js - UMADIGI STORE cart and checkout rendering

function formatRupiah(value) {
  return `Rp${value.toLocaleString('id-ID')}`;
}

function resolveImagePath(src) {
  if (!src) return '../assets/img/product-jkt48.png';
  if (src.startsWith('http') || src.startsWith('../') || src.startsWith('/')) return src;
  if (src.startsWith('assets/')) return `../${src}`;
  return src;
}

function fallbackImageForItem(item) {
  if (item.type === 'PM Member JKT48' || item.adminFee === 3000) {
    return '../assets/img/product-jkt48.png';
  }
  if (item.category === 'preset') {
    return '../assets/img/product-preset-warm.png';
  }
  if (item.category === 'fashion') {
    return '../assets/img/product-jacket.png';
  }
  return '../assets/img/product-creator-bundle.png';
}

function getCartItems() {
  return JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
}

function groupCartItems(cart) {
  const grouped = {};

  cart.forEach(item => {
    const isPmMember = item.type === 'PM Member JKT48' || item.adminFee === 3000 || String(item.id || '').startsWith('pm-');
    const quantity = Number(item.quantity || 1);
    if (!grouped[item.id]) {
      grouped[item.id] = { ...item, quantity: 0 };
    }
    grouped[item.id].quantity = isPmMember ? 1 : grouped[item.id].quantity + quantity;
  });

  return Object.values(grouped);
}

function getOrderTotals(cart) {
  const grouped = groupCartItems(cart);
  const subtotal = grouped.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = grouped.reduce((sum, item) => sum + item.quantity, 0);
  const hasPmMember = grouped.some(item => item.adminFee === 3000 || item.type === 'PM Member JKT48');
  const hasRegularProduct = grouped.some(item => !(item.adminFee === 3000 || item.type === 'PM Member JKT48'));
  const pmSubtotal = grouped
    .filter(item => item.adminFee === 3000 || item.type === 'PM Member JKT48')
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const productSubtotal = subtotal - pmSubtotal;
  const adminFee = (hasPmMember ? 3000 : 0) + (hasRegularProduct ? 10000 : 0);
  const discount = 0;
  const total = subtotal + adminFee - discount;

  return { grouped, subtotal, pmSubtotal, productSubtotal, itemCount, adminFee, discount, total };
}

function renderCart() {
  const cart = getCartItems();
  const cartSection = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  if (!cartSection) return;

  cartSection.innerHTML = '';

  if (cart.length === 0) {
    cartSection.innerHTML = `
      <div class="empty-order">
        <strong>Keranjang masih kosong.</strong>
        <span>Pilih PM member atau produk UMADIGI STORE terlebih dahulu.</span>
        <a href="/index.html">Mulai Belanja</a>
      </div>
    `;
    if (summary) summary.innerHTML = '';
    return;
  }

  const totals = getOrderTotals(cart);

  totals.grouped.forEach(item => {
    const itemTotal = item.price * item.quantity;
    const card = document.createElement('article');
    card.className = 'cart-item';
    card.innerHTML = `
      <img src="${resolveImagePath(item.img)}" alt="${item.name}" class="cart-item-img" onerror="this.src='${fallbackImageForItem(item)}'">
      <div class="cart-item-body">
        <div class="cart-item-top">
          <h3>${item.name}</h3>
          <span>${item.quantity}x</span>
        </div>
        <p>${item.memberName ? `${item.generation} - ${item.memberName}` : item.type || item.category || 'Produk UMADIGI STORE'}</p>
        <div class="cart-price-row">
          <strong>${formatRupiah(item.price)}</strong>
          <span>Subtotal ${formatRupiah(itemTotal)}</span>
        </div>
        <button class="remove-btn" data-id="${item.id}">Hapus item</button>
      </div>
    `;
    cartSection.appendChild(card);
  });

  if (summary) {
    summary.innerHTML = createSummaryMarkup(totals, 'Ringkasan Keranjang');
  }

  cartSection.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-id');
      const newCart = cart.filter(item => item.id !== itemId);
      localStorage.setItem('umaedi_cart', JSON.stringify(newCart));
      renderCart();
      window.dispatchEvent(new Event('cartUpdated'));
    });
  });
}

function createSummaryMarkup(totals, title) {
  return `
    <div class="summary-title">${title}</div>
    <div class="summary-row">
      <span>Total item</span>
      <strong>${totals.itemCount} item</strong>
    </div>
    <div class="summary-row">
      <span>Subtotal produk</span>
      <strong>${formatRupiah(totals.subtotal)}</strong>
    </div>
    <div class="summary-row">
      <span>Biaya admin</span>
      <strong>${formatRupiah(totals.adminFee)}</strong>
    </div>
    <div class="summary-row muted">
      <span>Diskon</span>
      <strong>${formatRupiah(totals.discount)}</strong>
    </div>
    <div class="summary-total">
      <span>Total pembayaran</span>
      <strong>${formatRupiah(totals.total)}</strong>
    </div>
    <div class="summary-note">
      Total ini akan dikirim otomatis ke WhatsApp admin untuk konfirmasi pembayaran.
    </div>
  `;
}

function renderCheckout() {
  const cart = getCartItems();
  const summary = document.getElementById('checkout-summary');
  if (!summary) return;

  if (cart.length === 0) {
    summary.innerHTML = `
      <div class="empty-order">
        <strong>Tidak ada item untuk checkout.</strong>
        <span>Tambahkan produk ke keranjang terlebih dahulu.</span>
        <a href="/index.html">Kembali Belanja</a>
      </div>
    `;
    return;
  }

  const totals = getOrderTotals(cart);
  const itemRows = totals.grouped.map((item, index) => `
    <div class="checkout-item-row">
      <span>${index + 1}. ${item.name}${item.generation ? `<small>${item.generation}</small>` : ''}</span>
      <strong>${item.quantity}x ${formatRupiah(item.price)}</strong>
    </div>
  `).join('');

  summary.innerHTML = `
    <div class="summary-title">Detail Pesanan</div>
    <div class="checkout-items">${itemRows}</div>
    ${createSummaryMarkup(totals, 'Total Akhir')}
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cart-items')) {
    renderCart();
  }
  if (document.getElementById('checkout-summary')) {
    renderCheckout();
  }
});
