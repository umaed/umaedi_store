// checkout-payment.js - move checkout data to QRIS payment page

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('go-payment');
  if (!button) return;

  button.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
    if (cart.length === 0) {
      if (window.toast) window.toast.warning('Keranjang masih kosong.', 2200);
      else alert('Keranjang masih kosong.');
      return;
    }

    const buyer = {
      name: document.getElementById('buyer-name')?.value.trim() || 'User',
      phone: document.getElementById('buyer-phone')?.value.trim() || '-',
      note: document.getElementById('buyer-note')?.value.trim() || '-'
    };

    localStorage.setItem('umaedi_checkout_buyer', JSON.stringify(buyer));
    window.location.href = 'pembayaran.html';
  });
});
