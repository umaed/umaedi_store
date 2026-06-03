// footer.js - UMADIGI STORE

document.addEventListener('DOMContentLoaded', () => {
  const footer = document.getElementById('footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-content">
      <div>
        <h4>UMADIGI STORE</h4>
        <p>Marketplace digital profesional untuk produk kreator, preset, fashion, dan item eksklusif.</p>
        <p class="footer-muted">Copyright 2026 UMADIGI STORE. All rights reserved.</p>
      </div>
      <div>
        <h4>Kategori</h4>
        <a href="/pages/fashion.html">Fashion</a>
        <a href="/pages/preset.html">Preset Digital</a>
        <a href="/pages/limited.html">Limited Deals</a>
        <a href="/pages/rare.html">Rare Items</a>
        <a href="/pages/pm-jkt48.html">JKT48</a>
      </div>
      <div>
        <h4>Layanan</h4>
        <a href="https://wa.me/6283818115136" target="_blank" rel="noopener">WhatsApp Admin</a>
        <a href="mailto:info@umadigi.store">Email Support</a>
        <p class="footer-muted">Jam aktif: 09.00 - 22.00 WIB<br>WhatsApp: +62 838-1811-5136</p>
      </div>
      <div>
        <h4>Kepercayaan</h4>
        <p>Checkout dibantu admin, detail order jelas, dan produk digital dikirim cepat setelah pembayaran terkonfirmasi.</p>
      </div>
    </div>
    <div class="footer-bottom">
      UMADIGI STORE - Smart shopping for digital creators.
    </div>
  `;
});
