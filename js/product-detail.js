// product-detail.js - UMADIGI STORE product detail page

function getProductDetailId() {
  return new URLSearchParams(window.location.search).get('id');
}

function detailDescription(product) {
  const descriptions = {
    'rare-pm-jkt48': 'Akses PM Member JKT48 resmi dari katalog UMADIGI STORE. Pilih member favorit dan lanjutkan pemesanan lewat halaman khusus PM.',
    'limited-creator-bundle': 'Paket starter untuk kreator digital berisi kebutuhan editing, aset promosi, dan workflow konten yang siap dipakai.',
    'limited-hoodie': 'Hoodie signature UMADIGI dengan tampilan clean streetwear, cocok untuk daily outfit dan koleksi limited.',
    'fashion-1': 'Jacket techwear ringan untuk tampilan modern, rapi, dan mudah dipadukan dengan outfit harian.',
    'fashion-2': 'Cargo pants minimal dengan siluet clean, nyaman dipakai, dan cocok untuk gaya streetwear.',
    'fashion-3': 'Sneakers clean street dengan visual fresh untuk outfit casual maupun kreator on-the-go.',
    'fashion-4': 'Tote bag kreator dengan desain simpel untuk membawa gadget, buku, atau kebutuhan harian.',
    'preset-1': 'Preset Lightroom bernuansa warm untuk foto feed, portrait, dan konten harian yang lebih konsisten.',
    'preset-2': 'Filter cinematic mobile untuk membuat foto dan video terasa lebih dramatis dan profesional.',
    'preset-3': 'Bundle color grade untuk konten sosial media dengan warna yang lebih matang dan rapi.',
    'preset-4': 'Paket LUT profesional untuk editing video dan foto dengan karakter warna sinematik.'
  };
  return descriptions[product.id] || 'Produk pilihan UMADIGI STORE dengan proses order mudah dan checkout lewat WhatsApp admin.';
}

function renderProductDetail() {
  const root = document.getElementById('product-detail-root');
  if (!root) return;

  const productId = getProductDetailId();
  const product = products.find(item => item.id === productId);

  if (!product) {
    root.innerHTML = `
      <div class="detail-empty">
        <h1>Produk tidak ditemukan</h1>
        <p>Produk yang kamu cari belum tersedia atau link-nya salah.</p>
        <a href="/index.html">Kembali ke halaman utama</a>
      </div>
    `;
    return;
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  root.innerHTML = `
    <section class="product-detail">
      <div class="detail-media">
        <img src="${product.img}" alt="${product.name}" onerror="this.src='${localProductFallbacks[product.id] || '../assets/img/product-creator-bundle.png'}'">
        <span class="detail-floating-badge">${discount > 0 ? `Diskon ${discount}%` : product.tag || 'READY'}</span>
      </div>
      <div class="detail-content">
        <div class="detail-category">${product.category}</div>
        <h1 class="detail-title">${product.name}</h1>
        <div class="detail-meta">
          <span>Rating ${product.rating || 4.8}</span>
          <span>Terjual ${product.sold || 50}</span>
          <span>Fast response</span>
        </div>
        <div class="detail-price-box">
          <span class="detail-price">Rp${product.price.toLocaleString('id-ID')}</span>
          ${product.originalPrice ? `<span class="detail-original">Rp${product.originalPrice.toLocaleString('id-ID')}</span>` : ''}
        </div>
        <p class="detail-description">${detailDescription(product)}</p>
        <div class="detail-benefits">
          <div class="detail-benefit"><span>01</span>Checkout cepat lewat WhatsApp admin UMADIGI STORE.</div>
          <div class="detail-benefit"><span>02</span>Detail order otomatis masuk ke keranjang dan bisa dicek sebelum bayar.</div>
          <div class="detail-benefit"><span>03</span>Support admin aktif untuk bantu konfirmasi pesanan.</div>
        </div>
      </div>
    </section>
    <div class="detail-actions">
      <button class="detail-action-btn secondary" id="detail-back">Kembali</button>
      <button class="detail-action-btn primary" id="detail-add">${product.selectType === 'redirect' ? 'Pilih Member' : 'Tambah Keranjang'}</button>
    </div>
  `;

  document.getElementById('detail-back').addEventListener('click', () => {
    history.length > 1 ? history.back() : window.location.href = '/index.html';
  });

  document.getElementById('detail-add').addEventListener('click', event => {
    if (product.selectType === 'redirect') {
      window.location.href = product.link;
      return;
    }
    addToCart(product, event.currentTarget);
  });
}

document.addEventListener('DOMContentLoaded', renderProductDetail);
