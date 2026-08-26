import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { 
    collection, doc, getDoc, getDocs, addDoc, writeBatch, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const checkoutForm = document.getElementById("checkout-form");
const loadingIndicator = document.getElementById("checkout-loading");
const itemsListContainer = document.getElementById("co-items-list");

let currentUser = null;
let cartItemsData = [];
let orderTotal = 0;

// Format Rupiah
const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

// 1. Cek Login & Ambil Data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await prepareCheckoutData(user.uid);
    } else {
        window.location.href = "login.html";
    }
});

async function prepareCheckoutData(uid) {
    try {
        // Ambil Data Profil User
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
            document.getElementById("co-name").value = userSnap.data().name;
            document.getElementById("co-email").value = userSnap.data().email;
        }

        // Ambil Data Keranjang
        const cartRef = collection(db, "cart", uid, "items");
        const cartSnapshot = await getDocs(cartRef);
        
        if (cartSnapshot.empty) {
            alert("Keranjang belanja kosong. Silakan belanja terlebih dahulu.");
            window.location.href = "home.html";
            return;
        }

        itemsListContainer.innerHTML = "";
        orderTotal = 0;

        cartSnapshot.forEach((docSnap) => {
            const item = docSnap.data();
            item.cartDocId = docSnap.id; // Simpan ID dokumen untuk dihapus nanti
            cartItemsData.push(item);
            
            const subtotalItem = item.price * item.quantity;
            orderTotal += subtotalItem;

            itemsListContainer.insertAdjacentHTML('beforeend', `
                <div class="summary-item">
                    <div class="summary-item-info">
                        <div class="summary-item-title">${item.name}</div>
                        <div class="summary-item-qty">${item.quantity} x ${formatRp(item.price)}</div>
                    </div>
                    <div class="summary-item-price">${formatRp(subtotalItem)}</div>
                </div>
            `);
        });

        document.getElementById("co-subtotal").textContent = formatRp(orderTotal);
        document.getElementById("co-total").textContent = formatRp(orderTotal);

        // Tampilkan Form
        loadingIndicator.style.display = "none";
        checkoutForm.style.display = "grid";

    } catch (error) {
        console.error("Error mempersiapkan checkout:", error);
        loadingIndicator.textContent = "Terjadi kesalahan saat memuat data.";
    }
}

// 2. Proses Buat Pesanan
checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const btnSubmit = document.getElementById("btn-process-order");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Memproses Pesanan...";

    const paymentMethod = document.getElementById("co-payment").value;
    const notes = document.getElementById("co-notes").value;
    const phone = document.getElementById("co-phone").value;

    try {
        // A. Buat Dokumen Pesanan di koleksi 'orders'
        const orderData = {
            userId: currentUser.uid,
            customerName: document.getElementById("co-name").value,
            customerEmail: document.getElementById("co-email").value,
            customerPhone: phone,
            items: cartItemsData.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal: orderTotal,
            discount: 0,
            total: orderTotal,
            paymentMethod: paymentMethod,
            paymentStatus: "pending", // Status pembayaran awal
            orderStatus: "pending", // Status pesanan awal
            notes: notes,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const newOrderRef = await addDoc(collection(db, "orders"), orderData);
        
        // B. Kosongkan Keranjang menggunakan Batch (Lebih aman & cepat)
        const batch = writeBatch(db);
        cartItemsData.forEach(item => {
            const cartDocRef = doc(db, "cart", currentUser.uid, "items", item.cartDocId);
            batch.delete(cartDocRef);
        });
        await batch.commit();

        // C. Sukses, Arahkan ke halaman Orders
        alert("Pesanan berhasil dibuat!");
        window.location.replace("orders.html"); // Nanti kita buat di Step 15

    } catch (error) {
        console.error("Error membuat pesanan:", error);
        alert("Gagal membuat pesanan. Silakan coba lagi.");
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Buat Pesanan";
    }
});