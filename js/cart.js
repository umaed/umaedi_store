// cart.js - UMAEDI STORE

document.addEventListener('DOMContentLoaded', () => {
  // Cart page display
  if (document.getElementById('cart-items')) {
    renderCart();
  }
  
  // Checkout summary
  if (document.getElementById('checkout-summary')) {
    renderCheckout();
  }
});

function renderCart() {
  let cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  const cartSection = document.getElementById('cart-items');
  const summary = document.getElementById('cart-summary');
  
  cartSection.innerHTML = '';
  
  if (cart.length === 0) {
    cartSection.innerHTML = '<div style="text-align:center;padding:3em;color:#666;"><p>Your cart is empty</p><a href="/index.html" class="luxury-cta">Continue Shopping</a></div>';
    if (summary) summary.innerHTML = '';
    return;
  }
  
  // Group items by id with quantity
  const groupedCart = {};
  cart.forEach((item) => {
    if (!groupedCart[item.id]) {
      groupedCart[item.id] = { ...item, quantity: 1 };
    } else {
      groupedCart[item.id].quantity += 1;
    }
  });
  
  let total = 0;
  let totalQuantity = 0;
  Object.values(groupedCart).forEach((item, i) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    totalQuantity += item.quantity;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-wrapper">
        <img src="${item.img}" alt="${item.name}" class="product-img" onerror="this.src='../assets/img/placeholder-200x200.png'" />
        <div class="quantity-badge">${item.quantity}x</div>
      </div>
      <div class="product-info">
        <div class="product-title">${item.name}</div>
        <div class="product-price">Rp${item.price.toLocaleString('id-ID')}</div>
        <div style="font-size:0.85rem;color:#999;margin:0.3em 0;">Qty: ${item.quantity} | Subtotal: Rp${itemTotal.toLocaleString('id-ID')}</div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartSection.appendChild(card);
  });
  
  if (summary) {
    // Calculate admin fee - 3000 for member items, 10000 for other items
    let hasMemberFee = false;
    let hasOtherFee = false;
    
    Object.values(groupedCart).forEach(item => {
      if (item.adminFee === 3000) {
        hasMemberFee = true;
      } else {
        hasOtherFee = true;
      }
    });
    
    const adminFee = (hasMemberFee ? 3000 : 0) + (hasOtherFee ? 10000 : 0);
    
    summary.innerHTML = `
      <div class="summary-title">📊 Summary</div>
      <div class="summary-row">
        <span>Items (${totalQuantity})</span>
        <span>Rp${total.toLocaleString('id-ID')}</span>
      </div>
      <div class="summary-row divider">
        <span>Admin Fee</span>
        <span>Rp${adminFee.toLocaleString('id-ID')}</span>
      </div>
      <div class="summary-total">
        <span>Total:</span>
        <span>Rp${(total + adminFee).toLocaleString('id-ID')}</span>
      </div>
    `;
  }
  
  // Remove buttons
  cartSection.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-id');
      const newCart = cart.filter(item => item.id !== itemId);
      localStorage.setItem('umaedi_cart', JSON.stringify(newCart));
      renderCart();
    });
  });
}

function renderCheckout() {
  let cart = JSON.parse(localStorage.getItem('umaedi_cart') || '[]');
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  
  // Calculate admin fee - 3000 for member items, 10000 for other items
  let hasMemberFee = false;
  let hasOtherFee = false;
  
  cart.forEach(item => {
    if (item.adminFee === 3000) {
      hasMemberFee = true;
    } else {
      hasOtherFee = true;
    }
  });
  
  const adminFee = (hasMemberFee ? 3000 : 0) + (hasOtherFee ? 10000 : 0);
  const tax = Math.round(total * 0.1);
  const finalTotal = total + adminFee + tax;
  
  const summary = document.getElementById('checkout-summary');
  
  if (cart.length === 0) {
    summary.innerHTML = '<p style="text-align:center;padding:2em;color:#666;">No items to checkout</p>';
    return;
  }
  
  summary.innerHTML = `
    <div class="summary-title">🛒 Order Summary</div>
    <div class="summary-row">
      <span>Total Items</span>
      <span>${cart.length}</span>
    </div>
    <div class="summary-row">
      <span>Subtotal</span>
      <span>Rp${total.toLocaleString('id-ID')}</span>
    </div>
    <div class="summary-row">
      <span>Admin Fee</span>
      <span>Rp${adminFee.toLocaleString('id-ID')}</span>
    </div>
    <div class="summary-row divider">
      <span>Tax (10%)</span>
      <span>Rp${tax.toLocaleString('id-ID')}</span>
    </div>
    <div class="summary-total">
      <span>Final Total</span>
      <span>Rp${finalTotal.toLocaleString('id-ID')}</span>
    </div>
  `;
}