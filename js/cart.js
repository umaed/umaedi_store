import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const cartItemsContainer = document.getElementById("cart-items");
const summaryBox = document.getElementById("cart-summary-box");
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryTotal = document.getElementById("summary-total");
let currentUserUid = null;

// Memantau status login
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUid = user.uid;
        loadCartRealtime(user.uid);
    } else {
        window.location.href = "login.html";
    }
});

// Load Keranjang dari Firestore (Realtime)
function loadCartRealtime(uid) {
    const cartRef = collection(db, "cart", uid, "items");

    onSnapshot(cartRef, (snapshot) => {
        if (snapshot.empty) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 0;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🛒</div>
                    <h3 style="color: var(--text); margin-bottom: 10px;">Keranjang kamu masih kosong</h3>
                    <p style="color: var(--muted); margin-bottom: 20px;">Yuk, temukan produk digital menarik!</p>
                    <a href="home.html" style="padding: 10px 20px; background: var(--primary); color: white; text-decoration: none; border-radius: 8px;">Mulai Belanja</a>
                </div>`;
            summaryBox.style.display = "none";
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

            const cartHTML = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${formattedPrice}</div>
                        <div class="qty-control">
                            <button class="btn-qty btn-minus" data-id="${itemId}" data-qty="${item.quantity}">-</button>
                            <span class="qty-number">${item.quantity}</span>
                            <button class="btn-qty btn-plus" data-id="${itemId}" data-qty="${item.quantity}">+</button>
                            <div style="flex:1;"></div>
                            <button class="btn-delete" data-id="${itemId}">🗑️</button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartHTML);
        });

        // Update Total UI
        summaryBox.style.display = "block";
        const formattedTotal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalBelanja);
        summarySubtotal.textContent = formattedTotal;
        summaryTotal.textContent = formattedTotal;
    });
}

// Menangani Klik tombol Plus, Minus, dan Delete (Event Delegation)
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
            // Jika quantity 1 dan dikurangi, konfirmasi hapus
            if(confirm("Hapus produk ini dari keranjang?")) {
                await deleteDoc(doc(db, "cart", currentUserUid, "items", itemId));
            }
        }
    } 
    else if (target.classList.contains("btn-delete") || target.closest(".btn-delete")) {
        const delId = target.getAttribute("data-id") || target.closest(".btn-delete").getAttribute("data-id");
        if(confirm("Yakin ingin menghapus produk ini?")) {
            await deleteDoc(doc(db, "cart", currentUserUid, "items", delId));
        }
    }
});

// Navigasi ke Halaman Checkout
const btnCheckout = document.getElementById("btn-checkout");
if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
        window.location.href = "checkout.html";
    });
}