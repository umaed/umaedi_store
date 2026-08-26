import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, onSnapshot, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const wishlistContainer = document.getElementById("wishlist-items");
let currentUserUid = null;

// Memantau status login
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserUid = user.uid;
        loadWishlist(user.uid);
    } else {
        window.location.href = "login.html";
    }
});

// Load Wishlist dari Firestore (Realtime)
function loadWishlist(uid) {
    const wishlistRef = collection(db, "wishlist", uid, "items");

    onSnapshot(wishlistRef, (snapshot) => {
        if (snapshot.empty) {
            wishlistContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px 0;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">💔</div>
                    <h3 style="color: var(--text); margin-bottom: 10px;">Belum ada produk favorit</h3>
                    <p style="color: var(--muted);">Tambahkan produk yang kamu suka ke wishlist.</p>
                </div>`;
            return;
        }

        wishlistContainer.innerHTML = "";

        snapshot.forEach((docSnap) => {
            const item = docSnap.data();
            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0
            }).format(item.price);

            // Menggunakan struktur card yang sama dengan produk, tapi ditambahkan tombol Hapus (X)
            const cardHTML = `
                <div class="product-card" style="position: relative;">
                    <button class="btn-remove-wishlist" data-id="${docSnap.id}" style="position: absolute; top: 10px; right: 10px; background: white; border: none; border-radius: 50%; width: 30px; height: 30px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); cursor: pointer; z-index: 10; color: var(--danger); font-weight: bold;">✖</button>
                    <a href="product-detail.html?id=${docSnap.id}" style="text-decoration: none; color: inherit; display: block; height: 100%;">
                        <div class="product-image-container">
                            <img src="${item.image}" alt="${item.name}" class="product-image" loading="lazy">
                        </div>
                        <div class="product-info">
                            <h3 class="product-title" style="margin-top: 5px;">${item.name}</h3>
                            <span class="product-price">${formattedPrice}</span>
                        </div>
                    </a>
                </div>
            `;
            wishlistContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    });
}

// Menangani Klik tombol Hapus (✖)
wishlistContainer.addEventListener("click", async (e) => {
    const removeBtn = e.target.closest(".btn-remove-wishlist");
    if (removeBtn && currentUserUid) {
        e.preventDefault(); // Mencegah klik masuk ke halaman detail
        const itemId = removeBtn.getAttribute("data-id");
        
        if (confirm("Hapus produk ini dari wishlist?")) {
            try {
                await deleteDoc(doc(db, "wishlist", currentUserUid, "items", itemId));
            } catch (error) {
                console.error("Gagal menghapus wishlist:", error);
            }
        }
    }
});