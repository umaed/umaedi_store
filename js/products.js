import { auth, db } from "./firebase-config.js";
import { 
    collection, query, where, onSnapshot, doc, getDoc, setDoc, deleteDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// ==========================================
// 1. LOGIKA UNTUK HOME PAGE (Daftar Produk)
// ==========================================
const productsContainer = document.getElementById("featured-products");

if (productsContainer) {
    const q = query(collection(db, "products"), where("isActive", "==", true));

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            productsContainer.innerHTML = `<p style="color: var(--muted); grid-column: 1 / -1; text-align: center; padding: 40px 20px;">Belum ada produk yang tersedia.</p>`;
            return;
        }

        productsContainer.innerHTML = "";

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0
            }).format(data.price);

            const productCard = `
                <a href="product-detail.html?id=${docSnap.id}" class="product-card">
                    <div class="product-image-container">
                        <img src="${data.image || 'https://via.placeholder.com/300?text=No+Image'}" alt="${data.name}" class="product-image" loading="lazy">
                    </div>
                    <div class="product-info">
                        <span class="product-category">${data.categoryName || 'Digital'}</span>
                        <h3 class="product-title">${data.name}</h3>
                        <span class="product-price">${formattedPrice}</span>
                    </div>
                </a>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productCard);
        });
    });
}

// ==========================================
// 2. LOGIKA UNTUK PRODUCT DETAIL PAGE
// ==========================================
const detailContainer = document.getElementById("product-detail-container");

if (detailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        detailContainer.innerHTML = `<p style="padding: 40px; text-align: center; color: var(--danger);">Produk tidak ditemukan. (ID tidak valid)</p>`;
    } else {
        const fetchProductDetail = async () => {
            try {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    const formattedPrice = new Intl.NumberFormat('id-ID', {
                        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
                    }).format(data.price);

                    detailContainer.innerHTML = `
                        <div class="product-image-large">
                            <img src="${data.image || 'https://via.placeholder.com/600?text=No+Image'}" alt="${data.name}">
                        </div>
                        <div class="product-info-detail">
                            <span class="detail-category">${data.categoryName || 'Kategori'}</span>
                            <h1 class="detail-title">${data.name}</h1>
                            <div class="detail-price">${formattedPrice}</div>
                            
                            <h3 class="detail-section-title">Deskripsi Produk</h3>
                            <p class="detail-description">${data.description || 'Belum ada deskripsi untuk produk ini.'}</p>
                            
                            <div class="action-bar">
                                <button class="btn-icon" aria-label="Add to Wishlist" id="btn-wishlist">🤍</button>
                                <button class="btn-cart" id="btn-add-cart">Tambah ke Keranjang</button>
                            </div>
                        </div>
                    `;

                    // Pengecekan Status Wishlist Saat Ini
                    auth.onAuthStateChanged(async (user) => {
                        if (user) {
                            const wishlistRef = doc(db, "wishlist", user.uid, "items", productId);
                            const wishlistSnap = await getDoc(wishlistRef);
                            const btnWishlist = document.getElementById("btn-wishlist");
                            
                            if (wishlistSnap.exists()) {
                                btnWishlist.textContent = "❤️"; // Sudah di wishlist
                            }

                            // Logika Tombol Wishlist
                            btnWishlist.addEventListener("click", async () => {
                                try {
                                    const currentSnap = await getDoc(wishlistRef);
                                    if (currentSnap.exists()) {
                                        // Hapus jika sudah ada
                                        await deleteDoc(wishlistRef);
                                        btnWishlist.textContent = "🤍";
                                        alert("Dihapus dari wishlist.");
                                    } else {
                                        // Tambah jika belum ada
                                        await setDoc(wishlistRef, {
                                            productId: productId,
                                            name: data.name,
                                            price: data.price,
                                            image: data.image || '',
                                            addedAt: serverTimestamp()
                                        });
                                        btnWishlist.textContent = "❤️";
                                        alert("Ditambahkan ke wishlist!");
                                    }
                                } catch (error) {
                                    console.error("Error wishlist:", error);
                                }
                            });
                        }
                    });

                    // Logika Tambah ke Keranjang (TETAP SAMA SEPERTI STEP 12)
                    document.getElementById("btn-add-cart").addEventListener("click", async () => {
                        const user = auth.currentUser;
                        if (!user) { alert("Anda harus login."); return; }
                        
                        const btnCart = document.getElementById("btn-add-cart");
                        btnCart.textContent = "Menambahkan...";
                        btnCart.disabled = true;

                        try {
                            const cartRef = doc(db, "cart", user.uid, "items", productId);
                            const cartSnap = await getDoc(cartRef);

                            if (cartSnap.exists()) {
                                await setDoc(cartRef, { quantity: cartSnap.data().quantity + 1, updatedAt: serverTimestamp() }, { merge: true });
                            } else {
                                await setDoc(cartRef, { productId: productId, name: data.name, price: data.price, image: data.image || '', quantity: 1, updatedAt: serverTimestamp() });
                            }
                            window.location.href = "cart.html";
                        } catch (error) {
                            console.error("Gagal:", error);
                            btnCart.textContent = "Tambah ke Keranjang";
                            btnCart.disabled = false;
                        }
                    });

                } else {
                    detailContainer.innerHTML = `<p style="padding: 40px; text-align: center; color: var(--danger);">Produk tidak ditemukan.</p>`;
                }
            } catch (error) {
                console.error("Error memuat detail produk:", error);
            }
        };

        fetchProductDetail();
    }
}