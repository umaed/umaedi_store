import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { 
    collection, getDoc, doc, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const guardLoading = document.getElementById("admin-guard-loading");
const adminDashboard = document.getElementById("admin-dashboard-content");

// Variabel untuk menyimpan data lokal agar bisa di-search
let productsData = [];
let ordersData = [];

// 1. Verifikasi Keamanan Role Admin
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().role === "admin") {
                guardLoading.style.display = "none";
                adminDashboard.style.display = "block";
                initAdminDashboard();
            } else {
                alert("Akses ditolak! Halaman ini khusus untuk Administrator.");
                window.location.replace("home.html");
            }
        } catch (error) {
            console.error("Gagal verifikasi role:", error);
            window.location.replace("home.html");
        }
    } else {
        window.location.replace("login.html");
    }
});

const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

function initAdminDashboard() {
    // --- REALTIME LISTENER PRODUK ---
    onSnapshot(collection(db, "products"), (snapshot) => {
        productsData = [];
        snapshot.forEach(doc => productsData.push({ id: doc.id, ...doc.data() }));
        document.getElementById("stat-total-products").textContent = snapshot.size;
        renderProducts(productsData);
    });

    // --- REALTIME LISTENER ORDERS ---
    onSnapshot(collection(db, "orders"), (snapshot) => {
        ordersData = [];
        let totalRevenue = 0;
        let pendingCount = 0;

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            ordersData.push({ id: docSnap.id, ...data });
            
            if (data.orderStatus === 'completed') totalRevenue += data.total;
            if (data.orderStatus === 'pending') pendingCount++;
        });

        document.getElementById("stat-total-orders").textContent = snapshot.size;
        document.getElementById("stat-pending-orders").textContent = pendingCount;
        document.getElementById("stat-total-revenue").textContent = formatRp(totalRevenue);
        renderOrders(ordersData);
    });

    setupModals();
    setupSearch();
}

// Render Tabel Produk
function renderProducts(data) {
    const table = document.getElementById("admin-products-table");
    table.innerHTML = "";
    if (data.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Belum ada produk atau tidak ditemukan.</td></tr>`;
        return;
    }

    data.forEach(p => {
        const statusBadge = p.isActive ? `<span class="badge badge-success">Aktif</span>` : `<span class="badge badge-danger">Nonaktif</span>`;
        table.innerHTML += `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${p.image}" alt="Img" style="width:40px; height:40px; border-radius:5px; object-fit:cover;">
                        <strong>${p.name}</strong>
                    </div>
                </td>
                <td>${p.categoryName || '-'}</td>
                <td>${formatRp(p.price)}</td>
                <td>${statusBadge}</td>
                <td class="text-center action-buttons">
                    <button class="btn-sm btn-outline btn-toggle" data-id="${p.id}" data-active="${p.isActive}">Ubah Status</button>
                    <button class="btn-sm btn-edit" data-id="${p.id}">Edit</button>
                    <button class="btn-sm btn-delete" data-id="${p.id}">Hapus</button>
                </td>
            </tr>
        `;
    });
}

// Render Tabel Pesanan (Sudah Ditambah Kolom Bukti)
function renderOrders(data) {
    const table = document.getElementById("admin-orders-table");
    table.innerHTML = "";
    if (data.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Belum ada pesanan masuk.</td></tr>`;
        return;
    }

    data.forEach(o => {
        const shortId = o.id.substring(0, 6).toUpperCase();
        let statusColor = "var(--text)";
        if(o.orderStatus === 'completed') statusColor = "var(--success)";
        if(o.orderStatus === 'cancelled') statusColor = "var(--danger)";
        if(o.orderStatus === 'pending') statusColor = "#f59e0b";

        // Cek apakah ada bukti TF di database
        const proofBtn = o.paymentProof 
            ? `<button class="btn-sm btn-edit btn-view-proof" data-id="${o.id}">Lihat Bukti</button>` 
            : `<span class="text-muted" style="font-size:0.8rem;">Tidak ada</span>`;

        table.innerHTML += `
            <tr>
                <td><strong>#${shortId}</strong></td>
                <td>${o.customerName}</td>
                <td>${formatRp(o.total)}</td>
                <td class="text-center">${proofBtn}</td>
                <td><strong style="color:${statusColor}; text-transform:capitalize;">${o.orderStatus}</strong></td>
                <td class="text-center">
                    <select class="select-order-status" data-id="${o.id}">
                        <option value="pending" ${o.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${o.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="completed" ${o.orderStatus === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${o.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

// Pencarian
function setupSearch() {
    document.getElementById("search-product").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = productsData.filter(p => p.name.toLowerCase().includes(query) || p.categoryName.toLowerCase().includes(query));
        renderProducts(filtered);
    });

    document.getElementById("search-order").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = ordersData.filter(o => o.id.toLowerCase().includes(query) || o.customerName.toLowerCase().includes(query));
        renderOrders(filtered);
    });
}

// Setup Modal & Formulir
function setupModals() {
    const modalAdd = document.getElementById("modal-product");
    const modalEdit = document.getElementById("modal-edit-product");
    const modalProof = document.getElementById("modal-proof"); 

    // Open & Close Add Modal
    document.getElementById("btn-open-add-product").addEventListener("click", () => modalAdd.style.display = "flex");
    document.getElementById("btn-close-modal").addEventListener("click", () => {
        modalAdd.style.display = "none";
        document.getElementById("form-add-product").reset();
    });

    // Submit Add Product
    document.getElementById("form-add-product").addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = document.getElementById("btn-save-product");
        btn.disabled = true; btn.textContent = "Menyimpan...";
        try {
            await addDoc(collection(db, "products"), {
                name: document.getElementById("add-name").value,
                categoryName: document.getElementById("add-category").value,
                price: Number(document.getElementById("add-price").value),
                image: document.getElementById("add-image").value,
                description: document.getElementById("add-desc").value,
                isActive: true,
                createdAt: serverTimestamp()
            });
            modalAdd.style.display = "none";
            e.target.reset();
        } catch (error) { alert("Terjadi kesalahan sistem."); } 
        finally { btn.disabled = false; btn.textContent = "Simpan Produk"; }
    });

    // Close Edit Modal
    document.getElementById("btn-close-edit").addEventListener("click", () => modalEdit.style.display = "none");

    // Tutup Modal Bukti TF (Fitur Baru)
    const btnCloseProof = document.getElementById("btn-close-proof");
    if (btnCloseProof) {
        btnCloseProof.addEventListener("click", () => {
            if(modalProof) modalProof.style.display = "none";
            document.getElementById("proof-image-display").src = "";
        });
    }

    // Submit Edit Product
    document.getElementById("form-edit-product").addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
        const btn = document.getElementById("btn-update-product");
        btn.disabled = true; btn.textContent = "Mengupdate...";
        try {
            await updateDoc(doc(db, "products", id), {
                name: document.getElementById("edit-name").value,
                categoryName: document.getElementById("edit-category").value,
                price: Number(document.getElementById("edit-price").value),
                image: document.getElementById("edit-image").value,
                description: document.getElementById("edit-desc").value,
            });
            modalEdit.style.display = "none";
        } catch (error) { alert("Gagal update produk."); } 
        finally { btn.disabled = false; btn.textContent = "Update Produk"; }
    });
}

// Aksi Klik Global (Delegation)
document.addEventListener("click", async (e) => {
    // Toggle Status
    if (e.target.classList.contains("btn-toggle")) {
        const id = e.target.getAttribute("data-id");
        const currentActive = e.target.getAttribute("data-active") === "true";
        await updateDoc(doc(db, "products", id), { isActive: !currentActive });
    }
    // Delete
    if (e.target.classList.contains("btn-delete")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("Yakin ingin menghapus permanen produk ini?")) {
            await deleteDoc(doc(db, "products", id));
        }
    }
    // Buka Modal Edit Produk
    if (e.target.classList.contains("btn-edit") && !e.target.classList.contains("btn-view-proof")) {
        const id = e.target.getAttribute("data-id");
        const product = productsData.find(p => p.id === id);
        if (product) {
            document.getElementById("edit-id").value = id;
            document.getElementById("edit-name").value = product.name;
            document.getElementById("edit-category").value = product.categoryName || '';
            document.getElementById("edit-price").value = product.price;
            document.getElementById("edit-image").value = product.image;
            document.getElementById("edit-desc").value = product.description || '';
            document.getElementById("modal-edit-product").style.display = "flex";
        }
    }
    // Buka Modal Bukti TF (Fitur Baru)
    if (e.target.classList.contains("btn-view-proof")) {
        const id = e.target.getAttribute("data-id");
        const order = ordersData.find(o => o.id === id);
        
        if (order && order.paymentProof) {
            document.getElementById("proof-image-display").src = order.paymentProof;
            document.getElementById("modal-proof").style.display = "flex";
        } else {
            alert("Bukti pembayaran gagal dimuat atau tidak tersedia.");
        }
    }
});

// Aksi Update Order Status
document.addEventListener("change", async (e) => {
    if (e.target.classList.contains("select-order-status")) {
        const id = e.target.getAttribute("data-id");
        const newStatus = e.target.value;
        try {
            await updateDoc(doc(db, "orders", id), { orderStatus: newStatus, updatedAt: serverTimestamp() });
        } catch (error) {
            alert("Gagal memperbarui status.");
        }
    }
});