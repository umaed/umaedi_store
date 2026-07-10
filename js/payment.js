// payment.js - QRIS payment, proof upload, WhatsApp confirmation, and order history

const PAYMENT_DURATION_MS = 10 * 60 * 1000;
const PENDING_DURATION_MS = 3 * 60 * 1000;
const PAYMENT_SESSION_KEY = 'umaedi_payment_session';
const ORDER_HISTORY_KEY = 'umaedi_order_history';
const BUYER_KEY = 'umaedi_checkout_buyer';

function paymentRupiah(value) {
  return `Rp${Number(value || 0).toLocaleString('id-ID')}`;
}

function paymentOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll('-', '');
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 90 + 10);
  return `UMD-${date}-${time}${rand}`;
}

function paymentIsPmMember(item) {
  return item.type === 'PM Member JKT48' || item.adminFee === 3000 || String(item.id || '').startsWith('pm-');
}

function getPaymentBuyer() {
  try {
    return JSON.parse(localStorage.getItem(BUYER_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function getPaymentHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || '[]');
    return Array.isArray(history) ? history : [];
  } catch (error) {
    return [];
  }
}

function savePaymentHistory(history) {
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history.slice(0, 12)));
}

function getPaymentSession() {
  const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  let session = null;

  try {
    session = JSON.parse(localStorage.getItem(PAYMENT_SESSION_KEY) || 'null');
  } catch (error) {
    session = null;
  }

  if (!session || !Array.isArray(session.cart) || session.cart.length === 0) {
    session = {
      id: paymentOrderId(),
      createdAt: Date.now(),
      cart
    };
    localStorage.setItem(PAYMENT_SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

function getPaymentTotals(cart) {
  if (typeof getOrderTotals === 'function') return getOrderTotals(cart);

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  return {
    grouped: cart,
    subtotal,
    pmSubtotal: 0,
    productSubtotal: subtotal,
    itemCount: cart.length,
    adminFee: 0,
    discount: 0,
    total: subtotal
  };
}

function buildPaymentMessage(session, totals, proofName) {
  const buyer = getPaymentBuyer();
  const pmItems = totals.grouped.filter(paymentIsPmMember);
  const productItems = totals.grouped.filter(item => !paymentIsPmMember(item));
  const orderDate = new Date(session.createdAt).toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const lines = [];
  lines.push('*UMADIGI STORE*');
  lines.push('*KONFIRMASI PEMBAYARAN QRIS*');
  lines.push('');
  lines.push(`Order ID : ${session.id}`);
  lines.push(`Tanggal  : ${orderDate} WIB`);
  lines.push('');
  lines.push('*DATA PEMESAN*');
  lines.push(`Nama     : ${buyer.name || 'User'}`);
  lines.push(`WhatsApp : ${buyer.phone || '-'}`);
  lines.push(`Catatan  : ${buyer.note || '-'}`);
  lines.push('');

  if (pmItems.length > 0) {
    lines.push('*DETAIL PM MEMBER JKT48*');
    pmItems.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.memberName || item.name.replace(/^PM\s+/i, '')}`);
      lines.push(`   Gen    : ${item.generation || item.tag || 'JKT48'}`);
      lines.push(`   Qty    : 1 akses`);
      lines.push(`   Harga  : ${paymentRupiah(item.price)}`);
      lines.push(`   Total  : ${paymentRupiah(item.price)}`);
    });
    lines.push('');
  }

  if (productItems.length > 0) {
    lines.push('*DETAIL PRODUK LAIN*');
    productItems.forEach((item, index) => {
      const itemSubtotal = item.price * (item.quantity || 1);
      lines.push(`${index + 1}. ${item.name}`);
      lines.push(`   Qty    : ${item.quantity || 1}`);
      lines.push(`   Harga  : ${paymentRupiah(item.price)}`);
      lines.push(`   Total  : ${paymentRupiah(itemSubtotal)}`);
    });
    lines.push('');
  }

  lines.push('*RINGKASAN PEMBAYARAN*');
  lines.push(`Subtotal PM Member : ${paymentRupiah(totals.pmSubtotal || 0)}`);
  lines.push(`Subtotal Produk    : ${paymentRupiah(totals.productSubtotal || 0)}`);
  lines.push(`Biaya Admin        : ${paymentRupiah(totals.adminFee)}`);
  lines.push(`Diskon             : ${paymentRupiah(totals.discount)}`);
  lines.push('-----------------------------');
  lines.push(`*TOTAL BAYAR       : ${paymentRupiah(totals.total)}*`);
  lines.push('');
  lines.push(`Bukti transfer: ${proofName || 'Sudah diupload di halaman pembayaran'}`);
  lines.push('Status web: Pending verifikasi 3 menit.');
  lines.push('');
  lines.push('Admin, saya sudah melakukan pembayaran QRIS. Mohon dicek dan diproses ya.');

  return lines.join('\n');
}

function renderPaymentSummary(totals) {
  const summary = document.getElementById('payment-summary');
  if (!summary) return;

  const rows = totals.grouped.map((item, index) => `
    <div class="checkout-item-row">
      <span>${index + 1}. ${item.name}${item.generation ? `<small>${item.generation}</small>` : ''}</span>
      <strong>${item.quantity || 1}x ${paymentRupiah(item.price)}</strong>
    </div>
  `).join('');

  summary.innerHTML = `
    <div class="summary-title">Detail Pembayaran</div>
    <div class="checkout-items">${rows}</div>
    ${createSummaryMarkup(totals, 'Total QRIS')}
  `;
}

function renderPaymentHistory() {
  const root = document.getElementById('order-history');
  if (!root) return;

  const now = Date.now();
  const history = getPaymentHistory().map(order => ({
    ...order,
    status: now - order.createdAt >= PENDING_DURATION_MS ? 'Diproses' : 'Pending'
  }));
  savePaymentHistory(history);

  if (history.length === 0) {
    root.innerHTML = '<div class="empty-order"><strong>Belum ada riwayat order.</strong><span>Riwayat akan muncul setelah kamu kirim bukti pembayaran.</span></div>';
    return;
  }

  root.innerHTML = history.map(order => `
    <article class="history-item">
      <strong>${order.id}</strong>
      <span>${order.itemCount} item - ${paymentRupiah(order.total)}</span>
      <small>${new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</small>
      <div class="history-status ${order.status === 'Diproses' ? 'done' : ''}">${order.status}</div>
    </article>
  `).join('');
}

function cancelPayment(message) {
  localStorage.removeItem(PAYMENT_SESSION_KEY);
  localStorage.removeItem('umaedi_cart');
  window.dispatchEvent(new Event('cartUpdated'));

  const status = document.getElementById('payment-status');
  if (status) {
    status.textContent = message;
    status.classList.add('is-visible');
  }

  const button = document.getElementById('confirm-payment');
  if (button) {
    button.disabled = true;
    button.classList.remove('is-ready');
    button.textContent = 'Pesanan Dibatalkan';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const session = getPaymentSession();
  const cart = session.cart || [];
  const timer = document.getElementById('payment-timer');
  const proofInput = document.getElementById('payment-proof');
  const proofName = document.getElementById('proof-file-name');
  const confirmButton = document.getElementById('confirm-payment');

  if (cart.length === 0) {
    cancelPayment('Tidak ada pesanan aktif. Silakan kembali belanja dan checkout ulang.');
    renderPaymentHistory();
    return;
  }

  const totals = getPaymentTotals(cart);
  renderPaymentSummary(totals);
  renderPaymentHistory();
  setInterval(renderPaymentHistory, 15000);

  function tick() {
    const remaining = PAYMENT_DURATION_MS - (Date.now() - session.createdAt);
    if (remaining <= 0) {
      if (timer) timer.textContent = '00:00';
      cancelPayment('Waktu pembayaran habis. Pesanan otomatis dibatalkan.');
      return;
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    if (timer) timer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  tick();
  setInterval(tick, 1000);

  proofInput?.addEventListener('change', () => {
    const file = proofInput.files?.[0];
    if (!file || !confirmButton) return;

    proofName.textContent = `Bukti dipilih: ${file.name}`;
    confirmButton.disabled = false;
    confirmButton.classList.add('is-ready');
    confirmButton.textContent = 'Pesan';
  });

  confirmButton?.addEventListener('click', () => {
    if (confirmButton.disabled) return;

    const proofFile = proofInput?.files?.[0]?.name || 'Bukti pembayaran';
    const history = getPaymentHistory();
    history.unshift({
      id: session.id,
      createdAt: Date.now(),
      total: totals.total,
      itemCount: totals.itemCount,
      status: 'Pending'
    });
    savePaymentHistory(history);

    const url = `https://wa.me/6283818115136?text=${encodeURIComponent(buildPaymentMessage(session, totals, proofFile))}`;
    window.open(url, '_blank');

    localStorage.removeItem(PAYMENT_SESSION_KEY);
    localStorage.removeItem('umaedi_cart');
    window.dispatchEvent(new Event('cartUpdated'));
    renderPaymentHistory();

    if (window.toast) window.toast.success('Bukti terkirim. Order pending 3 menit.', 2400);
    confirmButton.disabled = true;
    confirmButton.classList.remove('is-ready');
    confirmButton.textContent = 'Pending 3 Menit';
  });
});
