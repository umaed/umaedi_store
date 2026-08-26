// follower-variants.js
// Logika pemilihan varian followers dan redirect ke pembayaran

const PRICING = {
  indo: { min: 50, unitPrice: 40 }, // Rp40 per follower => 50 -> 2000
  intl: { min: 100, unitPrice: 10 } // Rp10 per follower => 100 -> 1000
};

function formatRupiah(value) {
  return `Rp${Number(value).toLocaleString('id-ID')}`;
}

function getSelectedVariant() {
  return document.querySelector('input[name="variant"]:checked').value;
}

function updatePriceDisplay() {
  const variant = getSelectedVariant();
  const qtyInput = document.getElementById('follower-qty');
  let qty = Number(qtyInput.value) || 0;
  const info = PRICING[variant];
  const min = info.min;
  if (qty < min) qty = min;
  qtyInput.value = qty;
  const total = qty * info.unitPrice;
  document.getElementById('total-price').textContent = formatRupiah(total);
  document.getElementById('qty-hint').textContent = `Minimal ${min} follower untuk varian ini.`;
}

function attachEvents() {
  document.querySelectorAll('input[name="variant"]').forEach(r => r.addEventListener('change', updatePriceDisplay));
  const qtyInput = document.getElementById('follower-qty');
  qtyInput.addEventListener('input', () => {
    const variant = getSelectedVariant();
    const min = PRICING[variant].min;
    if (Number(qtyInput.value) < min) {
      qtyInput.classList.add('invalid');
    } else {
      qtyInput.classList.remove('invalid');
    }
    updatePriceDisplay();
  });

  document.getElementById('btn-back').addEventListener('click', () => history.back());

  document.getElementById('btn-pay').addEventListener('click', () => {
    const variant = getSelectedVariant();
    const qty = Number(document.getElementById('follower-qty').value) || 0;
    const targetAccount = document.getElementById('target-account').value.trim();
    const info = PRICING[variant];
    if (!targetAccount) {
      if (window.toast) window.toast.warning('Masukkan akun target Instagram terlebih dahulu.');
      return;
    }
    if (qty < info.min) {
      if (window.toast) window.toast.warning(`Minimal ${info.min} follower untuk varian ${variant === 'indo' ? 'Indonesia' : 'Luar Negeri'}.`);
      return;
    }

    const service = document.getElementById('service-type')?.value || 'nonrefill';
    const unitPrice = info.unitPrice + (service === 'refill' ? 500 : 0);
    const totalPrice = qty * unitPrice;
    const orderItem = {
      id: `digital-instagram-followers-${variant}`,
      name: `Followers Instagram (${variant === 'indo' ? 'Indonesia' : 'Luar Negeri'}) - ${qty} follower (${service === 'refill' ? 'Refill' : 'Non-Refill'})`,
      price: totalPrice,
      quantity: 1,
      followers: qty,
      targetAccount: targetAccount.replace(/^@+/, ''),
      service: service,
      img: '../assets/img/product-color-grade.png',
      category: 'digital',
      variant: variant
    };

    // Save directly to cart but navigate to pembayaran page immediately
    const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
    // Replace any existing follower instant items
    const filtered = cart.filter(i => !(String(i.id || '').startsWith('digital-instagram-followers')));
    filtered.push(orderItem);
    localStorage.setItem('umaedi_cart', JSON.stringify(filtered));

    // Redirect to checkout page (not langsung pembayaran)
    const prefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    window.location.href = `${prefix}checkout.html`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updatePriceDisplay();
  attachEvents();
});
