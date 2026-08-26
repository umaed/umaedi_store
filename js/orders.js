import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const ordersList = document.getElementById("orders-list");

// Format Rupiah & Tanggal
const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
const formatDate = (timestamp) => {
    if (!timestamp) return "Menunggu waktu sistem...";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

// Pengaturan Badge Status
const getStatusBadge = (status) => {
    const badges = {
        'pending': '<span class="badge badge-pending">Menunggu Pembayaran</span>',
        'paid': '<span class="badge badge-paid">Telah Dibayar</span>',
        'processing': '<span class="badge badge-processing">Diproses</span>',
        'completed': '<span class="badge badge-completed">Selesai</span>',
        'cancelled': '<span class="badge badge-cancelled">Dibatalkan</span>'
    };
    return badges[status] || `<span class="badge">${status}</span>`;
};

// Autentikasi Pengguna
onAuthStateChanged(auth, (user) => {
    if (user) {
        loadOrdersRealtime(user.uid);
    } else {
        window.location.href = "login.html";
    }
});

function loadOrdersRealtime(uid) {
    // Hanya ambil pesanan milik user yang sedang login
    const q = query(collection(db, "orders"), where("userId", "==", uid));
    
    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            ordersList.innerHTML = `
                <div style="text-align: center; padding: 60px 0;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">📦</div>
                    <h3 style="color: var(--text); margin-bottom: 10px;">Belum ada pesanan</h3>
                    <p style="color: var(--muted); margin-bottom: 20px;">Kamu belum pernah melakukan transaksi.</p>
                    <a href="home.html" style="padding: 10px 20px; background: var(--primary); color: white; text-decoration: none; border-radius: 8px;">Mulai Belanja</a>
                </div>`;
            return;
        }

        // Ambil data dan urutkan secara manual agar pesanan terbaru ada di paling atas
        // (Dilakukan secara manual untuk menghindari error index Firestore di awal)
        let ordersData = [];
        snapshot.forEach((docSnap) => {
            ordersData.push({ id: docSnap.id, ...docSnap.data() });
        });
        
        ordersData.sort((a, b) => {
            const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
            return timeB - timeA; 
        });

        // Render HTML
        ordersList.innerHTML = "";
        
        ordersData.forEach(order => {
            // Render barang yang dibeli di dalam satu order
            let itemsHTML = '';
            order.items.forEach(item => {
                itemsHTML += `
                    <div class="order-item">
                        <img src="${item.image || 'https://via.placeholder.com/60?text=IMG'}" alt="${item.name}" class="order-item-img">
                        <div class="order-item-info">
                            <div class="order-item-title">${item.name}</div>
                            <div class="order-item-price">${item.quantity} x ${formatRp(item.price)}</div>
                        </div>
                    </div>
                `;
            });

            // Template Kartu Pesanan Keseluruhan
            const orderHTML = `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <div class="order-id">ID: #${order.id.substring(0, 8).toUpperCase()}</div>
                            <div class="order-date">${formatDate(order.createdAt)}</div>
                        </div>
                        <div>${getStatusBadge(order.orderStatus)}</div>
                    </div>
                    
                    <div class="order-items-container">
                        ${itemsHTML}
                    </div>
                    
                    <div class="order-footer">
                        <span class="order-total-label">Total Belanja</span>
                        <span class="order-total-value">${formatRp(order.total)}</span>
                    </div>
                </div>
            `;
            ordersList.insertAdjacentHTML('beforeend', orderHTML);
        });
    }, (error) => {
        console.error("Error memuat pesanan:", error);
        ordersList.innerHTML = `<p style="text-align:center; color:var(--danger); padding: 40px;">Terjadi kesalahan saat memuat pesanan.</p>`;
    });
}