import { auth, db } from "./firebase-config.js";
import { 
    collection, query, where, onSnapshot, doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// ==========================================
// 1. DAFTAR PRODUK (HOME PAGE)
// ==========================================
const productsContainer = document.getElementById("featured-products");

if (productsContainer) {
    const q = query(collection(db, "products"), where("isActive", "==", true));

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            productsContainer.innerHTML = `<p style="text-align:center; color:var(--muted); padding:40px; grid-column: 1/-1;">Belum ada produk yang tersedia.</p>`;
            return;
        }

        productsContainer.innerHTML = "";

        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(data.price);
            
            const seed = docSnap.id.charCodeAt(0) || 5;
            const rating = (4.5 + (seed % 5) * 0.1).toFixed(1);
            const soldCount = (seed * 17) % 250 + 12;

            const productCard = `
                <a href="product-detail.html?id=${docSnap.id}" class="product-card">
                    <div class="product-image-container">
                        <img src="${data.image || 'https://via.placeholder.com/300'}" alt="${data.name}" class="product-image" loading="lazy">
                        <span class="category-badge">${data.categoryName || 'Digital'}</span>
                    </div>
                    <div class="product-info">
                        <div>
                            <h3 class="product-title">${data.name}</h3>
                            <div class="product-price">${formattedPrice}</div>
                        </div>
                        <div class="product-stats">
                            <span class="rating">⭐ ${rating}</span>
                            <span class="sold">Terjual ${soldCount}+</span>
                        </div>
                    </div>
                </a>
            `;
            productsContainer.insertAdjacentHTML('beforeend', productCard);
        });
    });
}

// ==========================================
// 2. DETAIL PRODUK (PRODUCT DETAIL PAGE)
// ==========================================
const detailContainer = document.getElementById("product-detail-container");
const variantOverlay = document.getElementById("variant-overlay");
const btnCloseVariant = document.getElementById("btn-close-variant");
const btnConfirmVariant = document.getElementById("btn-confirm-variant");

let currentProductData = null;
let currentProductId = null;
let selectedVariantsState = {}; 
let intendedAction = ""; 

if (detailContainer) {
    const urlParams = new URLSearchParams(window.location.search);
    currentProductId = urlParams.get('id');

    if (currentProductId) {
        const fetchProductDetail = async () => {
            try {
                const docRef = doc(db, "products", currentProductId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    currentProductData = docSnap.data();
                    const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(currentProductData.price);

                    // Hitung rating & sold dummy
                    const seed = currentProductId.charCodeAt(0) || 5;
                    const rating = (4.5 + (seed % 5) * 0.1).toFixed(1);
                    const reviewCount = (seed * 37) % 500 + 20;
                    const soldCount = (seed * 17) % 250 + 12;

                    // Render HTML sesuai tampilan Shopee (tanpa varian di halaman)
                    detailContainer.innerHTML = `
                        <div class="product-detail-layout">
                            <div class="detail-image-gallery">
                                <img src="${currentProductData.image || 'https://via.placeholder.com/600'}" alt="${currentProductData.name}">
                            </div>
                            <div class="detail-info-box">
                                <div class="price-terjual-row">
                                    <div class="detail-price-lg">${formattedPrice}</div>
                                    <span class="sold-count">${soldCount}+ Terjual</span>
                                </div>
                                <h1 class="detail-title-lg">${currentProductData.name}</h1>
                                <div class="rating-row">
                                    <span class="star">⭐</span> ${rating} | ${reviewCount} Penilaian
                                </div>
                                
                                <div class="detail-section-title">Deskripsi</div>
                                <div class="description-text">${currentProductData.description || 'Belum ada deskripsi.'}</div>
                                
                                <div class="detail-section-title">Jaminan</div>
                                <div class="guarantee-text">Garansi resmi dari toko.</div>
                            </div>
                        </div>
                        
                        <!-- Bottom Action Bar -->
                        <div class="bottom-action-bar">
                            <button class="chat-btn" id="btn-chat">Chat Sekarang</button>
                            <button class="cart-btn" id="btn-cart-trigger">Masukkan Keranjang</button>
                            <button class="buy-btn" id="btn-buy-trigger">Beli Sekarang</button>
                        </div>
                    `;

                    // Event listener tombol aksi
                    document.getElementById("btn-buy-trigger").addEventListener("click", () => handleActionTrigger("buy"));
                    document.getElementById("btn-cart-trigger").addEventListener("click", () => handleActionTrigger("cart"));
                    document.getElementById("btn-chat").addEventListener("click", () => {
                        alert("Fitur chat segera hadir!");
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

// ==========================================
// 3. LOGIKA PEMILIHAN VARIAN (MODAL)
// ==========================================
function handleActionTrigger(action) {
    intendedAction = action;
    const hasVariants = currentProductData.variants && currentProductData.variants.length > 0;

    if (!hasVariants) {
        executeCartAction(); 
    } else {
        openVariantModal(); 
    }
}

function openVariantModal() {
    if (!variantOverlay) return;
    
    document.getElementById("v-modal-img").src = currentProductData.image;
    document.getElementById("v-modal-price").textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(currentProductData.price);
    
    const container = document.getElementById("variant-selectors-container");
    container.innerHTML = "";
    selectedVariantsState = {}; 

    currentProductData.variants.forEach(variantGroup => {
        let optionsHtml = variantGroup.options.map(opt => `<button class="variant-chip" data-group="${variantGroup.name}" data-value="${opt}">${opt}</button>`).join("");
        
        container.innerHTML += `
            <div style="margin-bottom: 20px;">
                <div class="variant-group-title">${variantGroup.name}</div>
                <div class="variant-options">${optionsHtml}</div>
            </div>
        `;
    });

    variantOverlay.style.display = "flex";
    setTimeout(() => variantOverlay.classList.add("show"), 10);
}

// Event delegation untuk chip varian
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("variant-chip")) {
        const groupName = e.target.getAttribute("data-group");
        const value = e.target.getAttribute("data-value");
        
        document.querySelectorAll(`.variant-chip[data-group="${groupName}"]`).forEach(el => el.classList.remove("selected"));
        e.target.classList.add("selected");
        selectedVariantsState[groupName] = value;
    }
});

// Tombol konfirmasi varian
btnConfirmVariant?.addEventListener("click", () => {
    const requiredGroups = currentProductData.variants.map(v => v.name);
    for (let group of requiredGroups) {
        if (!selectedVariantsState[group]) {
            alert(`Silakan pilih ${group} terlebih dahulu.`);
            return;
        }
    }
    executeCartAction();
});

// Tombol tutup modal
btnCloseVariant?.addEventListener("click", () => closeVariantModal());
variantOverlay?.addEventListener("click", (e) => { 
    if (e.target === variantOverlay) closeVariantModal(); 
});

function closeVariantModal() {
    if (variantOverlay) {
        variantOverlay.classList.remove("show");
        setTimeout(() => variantOverlay.style.display = "none", 300);
    }
}

async function executeCartAction() {
    const user = auth.currentUser;
    if (!user) { 
        alert("Silakan login untuk berbelanja."); 
        window.location.href = "login.html"; 
        return; 
    }

    // Ambil tombol yang memicu aksi (jika varian, tombol confirm yang aktif)
    const btn = document.getElementById("btn-confirm-variant") || document.getElementById("btn-buy-trigger") || document.getElementById("btn-cart-trigger");
    const originalText = btn.textContent;
    btn.textContent = "Memproses...";
    btn.disabled = true;

    try {
        // Buat custom ID untuk item keranjang berdasarkan varian
        let customCartId = currentProductId;
        if (Object.keys(selectedVariantsState).length > 0) {
            const sortedKeys = Object.keys(selectedVariantsState).sort();
            let varString = sortedKeys.map(k => `${k}:${selectedVariantsState[k]}`).join("_");
            customCartId = currentProductId + "_" + btoa(varString).replace(/=/g, '');
        }

        const cartRef = doc(db, "cart", user.uid, "items", customCartId);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
            await setDoc(cartRef, { quantity: cartSnap.data().quantity + 1, updatedAt: serverTimestamp() }, { merge: true });
        } else {
            const cartData = {
                productId: currentProductId,
                name: currentProductData.name,
                price: currentProductData.price,
                image: currentProductData.image || '',
                quantity: 1,
                selectedVariants: selectedVariantsState,
                updatedAt: serverTimestamp()
            };
            await setDoc(cartRef, cartData);
        }

        closeVariantModal();
        
        if (intendedAction === "buy") {
            window.location.href = "checkout.html";
        } else {
            alert("Produk berhasil ditambahkan ke keranjang.");
            btn.textContent = originalText;
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Gagal menambahkan ke keranjang:", error);
        alert("Terjadi kesalahan sistem.");
        btn.textContent = originalText;
        btn.disabled = false;
    }
}