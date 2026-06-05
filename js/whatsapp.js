// whatsapp.js - UMADIGI STORE detailed WhatsApp order

function getBuyerValue(id) {
  return document.getElementById(id)?.value.trim() || '-';
}

function buildOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replaceAll('-', '');
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
  return `UMD-${date}-${time}`;
}

function rupiah(value) {
  return `Rp${value.toLocaleString('id-ID')}`;
}

function isPmMember(item) {
  return item.type === 'PM Member JKT48' || item.adminFee === 3000 || String(item.id || '').startsWith('pm-');
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('send-whatsapp');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');

    if (cart.length === 0) {
      alert('Keranjang masih kosong.');
      return;
    }

    const totals = typeof getOrderTotals === 'function'
      ? getOrderTotals(cart)
      : { grouped: cart, subtotal: 0, pmSubtotal: 0, productSubtotal: 0, itemCount: cart.length, adminFee: 0, discount: 0, total: 0 };

    const pmItems = totals.grouped.filter(isPmMember);
    const productItems = totals.grouped.filter(item => !isPmMember(item));
    const buyerName = getBuyerValue('buyer-name');
    const buyerPhone = getBuyerValue('buyer-phone');
    const buyerNote = getBuyerValue('buyer-note');
    const orderId = buildOrderId();
    const orderDate = new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const lines = [];
    lines.push('*UMADIGI STORE*');
    lines.push('*ORDER BARU*');
    lines.push('');
    lines.push(`Order ID : ${orderId}`);
    lines.push(`Tanggal  : ${orderDate} WIB`);
    lines.push('');
    lines.push('*DATA PEMESAN*');
    lines.push(`Nama     : ${buyerName}`);
    lines.push(`WhatsApp : ${buyerPhone}`);
    lines.push(`Catatan  : ${buyerNote}`);
    lines.push('');

    if (pmItems.length > 0) {
      lines.push('*DETAIL PM MEMBER JKT48*');
      pmItems.forEach((item, index) => {
        lines.push(`${index + 1}. ${item.memberName || item.name.replace(/^PM\\s+/i, '')}`);
        lines.push(`   Gen    : ${item.generation || item.tag || 'JKT48'}`);
        lines.push(`   Qty    : 1 akses`);
        lines.push(`   Harga  : ${rupiah(item.price)}`);
        lines.push(`   Total  : ${rupiah(item.price)}`);
      });
      lines.push('');
    }

    if (productItems.length > 0) {
      lines.push('*DETAIL PRODUK LAIN*');
      productItems.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        lines.push(`${index + 1}. ${item.name}`);
        lines.push(`   Qty    : ${item.quantity}`);
        lines.push(`   Harga  : ${rupiah(item.price)}`);
        lines.push(`   Total  : ${rupiah(itemSubtotal)}`);
      });
      lines.push('');
    }

    lines.push('*RINGKASAN PEMBAYARAN*');
    lines.push(`Subtotal PM Member : ${rupiah(totals.pmSubtotal || 0)}`);
    lines.push(`Subtotal Produk    : ${rupiah(totals.productSubtotal || 0)}`);
    lines.push(`Biaya Admin        : ${rupiah(totals.adminFee)}`);
    lines.push(`Diskon             : ${rupiah(totals.discount)}`);
    lines.push('-----------------------------');
    lines.push(`*TOTAL BAYAR       : ${rupiah(totals.total)}*`);
    lines.push('');
    lines.push('Admin, saya ingin konfirmasi pesanan di atas.');
    lines.push('Mohon kirim instruksi pembayaran dan detail proses ordernya ya.');

    const url = `https://wa.me/6283818115136?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank');
    localStorage.removeItem('umaedi_cart');
    window.dispatchEvent(new Event('cartUpdated'));

    if (window.toast) {
      window.toast.success('Pesanan dikirim. Keranjang sudah dikosongkan.', 2200);
    }

    setTimeout(() => {
      window.location.href = '/index.html';
    }, 650);
  });
});
