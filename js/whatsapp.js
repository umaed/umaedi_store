// whatsapp.js - UMAEDI STORE

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('send-whatsapp');
  if (!btn) return;
  btn.addEventListener('click', () => {
    let cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
    
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }
    
    // Group items by ID with quantity
    const groupedCart = {};
    cart.forEach((item) => {
      if (!groupedCart[item.id]) {
        groupedCart[item.id] = { ...item, quantity: 1 };
      } else {
        groupedCart[item.id].quantity += 1;
      }
    });
    
    // Calculate total price (sum of all items in cart)
    let total = cart.reduce((sum, item) => sum + item.price, 0);
    
    // Calculate admin fee - 3000 for member items, 10000 for other items
    let hasMemberFee = false;
    let hasOtherFee = false;
    
    cart.forEach(item => {
      if (item.adminFee === 3000) {
        hasMemberFee = true;
      } else if (item.adminFee === 10000) {
        hasOtherFee = true;
      }
    });
    
    const adminFee = (hasMemberFee ? 3000 : 0) + (hasOtherFee ? 10000 : 0);
    const finalTotal = total + adminFee;
    
    // Build message with grouped items
    let msg = `*UMAEDI STORE*\n*UMAVERSE × UMAVALENCIA*\n\n*Order List:*\n`;
    let itemNum = 1;
    Object.values(groupedCart).forEach((item) => {
      msg += `${itemNum}. ${item.quantity}x ${item.name} - Rp${item.price.toLocaleString('id-ID')}\n`;
      itemNum++;
    });
    
    msg += `\n*Total Product Price:* Rp${total.toLocaleString('id-ID')}\n`;
    msg += `*Admin Fee:* Rp${adminFee.toLocaleString('id-ID')}\n`;
    msg += `*Final Total Payment:* Rp${finalTotal.toLocaleString('id-ID')}`;
    
    const url = `https://wa.me/6283818115136?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });
});