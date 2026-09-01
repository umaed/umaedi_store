import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const cartItemsContainer = document.getElementById("cart-items");
const summaryBox = document.getElementById("cart-summary-box");
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryTotal = document.getElementById("summary-total");
let currentUserUid = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUid = user.uid;
        loadCartRealtime(user.uid);
    } else {
        window.location.href = "login.html";
    }
});

function loadCartRealtime(uid) {
    const cartRef = collection(db, "cart", uid, "items");

    onSnapshot(cartRef, (snapshot) => {
        if (snapshot.empty) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🛒</div>
                    <h3 style="color: var(--text); margin-bottom: 10px;">Keranjang kosong</h3>
                    <p style="color: var(--muted); margin-bottom: 30px;">Yuk, temukan produk menarik!</p>
                    <a href="home.html" class="btn-primary" style="text-decoration: none;">Belanja Sekarang</a>
                </div>`;
            if (summaryBox) summaryBox.style.display = "none";
            return;
        }

        cartItemsContainer.innerHTML = "";
        let totalBelanja = 0;

        snapshot.forEach((docSnap) => {
            const item = docSnap.data();
            const itemId = docSnap.id;
            const subtotalItem = item.price * item.quantity;
            totalBelanja += subtotalItem;

            const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price);

            let variantHTML = "";
            if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
                const variantString = Object.entries(item.selectedVariants)
                                      .map(([key, val]) => `${key}: <strong style="color:var(--text);">${val}</strong>`)
                                      .join(" | ");
                variantHTML = `<div class="cart-item-variant">${variantString}</div>`;
            }

            const cartHTML = `
                <div class="cart-item-card">
                    <img src="${item.image || 'https://via.placeholder.com/100'}" alt="${item.name}" class="cart-item-img">
                    
                    <div class="cart-item-body">
                        <div class="cart-item-title">${item.name}</div>
                        ${variantHTML}
                        <div class="cart-item-price">${formattedPrice}</div>
                    </div>

                    <div class="cart-item-actions">
                        <button class="btn-delete-item" data-id="${itemId}">🗑️</button>
                        <div class="cart-qty-controls">
                            <button class="btn-minus" data-id="${itemId}" data-qty="${item.quantity}">-</button>
                            <span class="qty-number">${item.quantity}</span>
                            <button class="btn-plus" data-id="${itemId}" data-qty="${item.quantity}">+</button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartHTML);
        });

        if (summaryBox) {
            summaryBox.style.display = "block";
            const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalBelanja);
            if (summarySubtotal) summarySubtotal.textContent = formattedTotal;
            if (summaryTotal) summaryTotal.textContent = formattedTotal;
        }
    });
}

cartItemsContainer.addEventListener("click", async (e) => {
    if (!currentUserUid) return;

    const target = e.target;
    const itemId = target.getAttribute("data-id");
    
    if (target.classList.contains("btn-plus")) {
        const currentQty = parseInt(target.getAttribute("data-qty"));
        await updateDoc(doc(db, "cart", currentUserUid, "items", itemId), { quantity: currentQty + 1 });
    } 
    else if (target.classList.contains("btn-minus")) {
        const currentQty = parseInt(target.getAttribute("data-qty"));
        if (currentQty > 1) {
            await updateDoc(doc(db, "cart", currentUserUid, "items", itemId), { quantity: currentQty - 1 });
        } else {
            if(confirm("Hapus produk ini dari keranjang?")) {
                await deleteDoc(doc(db, "cart", currentUserUid, "items", itemId));
            }
        }
    } 
    else if (target.classList.contains("btn-delete-item")) {
        if(confirm("Yakin ingin menghapus produk ini?")) {
            await deleteDoc(doc(db, "cart", currentUserUid, "items", itemId));
        }
    }
});

const btnCheckout = document.getElementById("btn-checkout");
if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
        window.location.href = "checkout.html";
    });
}