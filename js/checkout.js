import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, doc, getDoc, getDocs, addDoc, writeBatch, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const checkoutForm = document.getElementById("checkout-form");
const loadingIndicator = document.getElementById("checkout-loading");
const itemsListContainer = document.getElementById("co-items-list");
const paymentSelect = document.getElementById("co-payment");
const instructionBox = document.getElementById("payment-instruction");
const proofInput = document.getElementById("co-proof");
const btnSubmit = document.getElementById("btn-process-order");

let currentUser = null;
let cartItemsData = [];
let orderTotal = 0;
let proofBase64 = ""; // Variabel untuk menyimpan gambar bukti transfer

const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

// Nomor Rekening Tujuan (Atas Nama UMAEDI)
const rekeningInfo = {
    "DANA": "0838-1811-5136",
    "GoPay": "0838-1811-5136",
    "OVO": "0838-1811-5136",
    "SeaBank": "9015-6721-6652",
    "Krom": "7700-0670-2008",
    "Bank Jago": "4889-5030-3404-7218"
};

// 1. Cek Login & Ambil Data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await prepareCheckoutData(user.uid);
        updatePaymentInstruction(); // Panggil instruksi default (QRIS)
    } else {
        window.location.replace("login.html");
    }
});

async function prepareCheckoutData(uid) {
    try {
        const userSnap = await getDoc(doc(db, "users", uid));
        if (userSnap.exists()) {
            document.getElementById("co-name").value = userSnap.data().name;
            document.getElementById("co-email").value = userSnap.data().email;
        }

        const cartRef = collection(db, "cart", uid, "items");
        const cartSnapshot = await getDocs(cartRef);
        
        if (cartSnapshot.empty) {
            alert("Keranjang belanja kosong.");
            window.location.replace("home.html");
            return;
        }

        itemsListContainer.innerHTML = "";
        orderTotal = 0;

        cartSnapshot.forEach((docSnap) => {
            const item = docSnap.data();
            item.cartDocId = docSnap.id;
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
        loadingIndicator.style.display = "none";
        checkoutForm.style.display = "grid";

    } catch (error) {
        console.error("Error mempersiapkan checkout:", error);
    }
}

// 2. Controller UI Metode Pembayaran Dinamis
function updatePaymentInstruction() {
    const method = paymentSelect.value;
    if (method === "QRIS") {
        // Path gambar sudah diperbarui ke folder assets/img/qris.png
        instructionBox.innerHTML = `
            <h4 style="margin-bottom: 10px;">Scan QRIS di bawah ini</h4>
            <img src="../assets/img/qris.png" alt="QRIS Umaedi" style="max-width: 250px; border-radius: 8px; margin: 10px 0;" onerror="this.src='https://via.placeholder.com/200?text=Gambar+QRIS'">
            <p>Pastikan nominal transfer tepat sebesar <strong>${formatRp(orderTotal)}</strong></p>
            <p style="font-size: 0.85rem; color: var(--muted);">a/n UMAEDI</p>
        `;
    } else if (rekeningInfo[method]) {
        instructionBox.innerHTML = `
            <h4 style="margin-bottom: 10px;">Transfer melalui ${method}</h4>
            <p>Silakan transfer tepat sebesar <strong>${formatRp(orderTotal)}</strong> ke:</p>
            <div class="rek-details">
                ${rekeningInfo[method]}<br>
                <span style="font-size: 0.9rem; font-weight: normal; color: var(--text);">a/n UMAEDI</span>
            </div>
        `;
    } else {
        instructionBox.innerHTML = `<p>Pilih metode pembayaran terlebih dahulu.</p>`;
    }
}
paymentSelect.addEventListener("change", updatePaymentInstruction);

// 3. Konversi Gambar ke Base64 & Ubah Status Tombol
proofInput.addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            proofBase64 = e.target.result; // Simpan data gambar
            btnSubmit.textContent = "Bukti Terlampir - Buat Pesanan";
            btnSubmit.style.backgroundColor = "var(--primary)";
        };
        reader.readAsDataURL(file);
    } else {
        proofBase64 = "";
        btnSubmit.textContent = "Menunggu Bukti Transfer";
    }
});

// 4. Proses Submit Pesanan
checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!proofBase64) {
        alert("Harap upload bukti pembayaran terlebih dahulu!");
        return;
    }

    btnSubmit.disabled = true;
    btnSubmit.textContent = "Mengunggah & Memproses...";

    try {
        const orderData = {
            userId: currentUser.uid,
            customerName: document.getElementById("co-name").value,
            customerEmail: document.getElementById("co-email").value,
            customerPhone: document.getElementById("co-phone").value,
            items: cartItemsData.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: orderTotal,
            paymentMethod: paymentSelect.value,
            paymentProof: proofBase64, // Kirim gambar ke database
            orderStatus: "pending", 
            notes: document.getElementById("co-notes").value,
            createdAt: serverTimestamp()
        };

        await addDoc(collection(db, "orders"), orderData);
        
        // Kosongkan keranjang
        const batch = writeBatch(db);
        cartItemsData.forEach(item => {
            batch.delete(doc(db, "cart", currentUser.uid, "items", item.cartDocId));
        });
        await batch.commit();

        alert("Pesanan berhasil dikirim dan sedang diverifikasi!");
        window.location.replace("orders.html");

    } catch (error) {
        console.error("Error membuat pesanan:", error);
        alert("Gagal memproses pesanan.");
        btnSubmit.disabled = false;
        btnSubmit.textContent = "Bukti Terlampir - Buat Pesanan";
    }
});