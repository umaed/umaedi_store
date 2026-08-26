import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { 
    collection, getDoc, doc, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const guardLoading = document.getElementById("admin-guard-loading");
const adminDashboard = document.getElementById("admin-dashboard-content");

// 1. Verifikasi Keamanan Role Admin dari Firestore
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().role === "admin") {
                // LOLOS: Tampilkan Dashboard Admin
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

function initAdminDashboard() {
    const totalProductsEl = document.getElementById("stat-total-products");
    const totalOrdersEl = document.getElementById("stat-total-orders");
    const productsTable = document.getElementById("admin-products-table");
    const ordersTable = document.getElementById("admin-orders-table");

    // A. Realtime Listener Produk
    onSnapshot(collection(db, "products"), (snapshot) => {
        totalProductsEl.textContent = snapshot.size;
        productsTable.innerHTML = "";

        if (snapshot.empty) {
            productsTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--muted);">Belum ada produk.</td></tr>`;
            return;
        }

        snapshot.forEach((docSnap) => {
            const p = docSnap.data();
            const formatRp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p.price);

            productsTable.innerHTML += `
                <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.categoryName || '-'}</td>
                    <td>${formatRp}</td>
                    <td><span style="color: ${p.isActive ? 'var(--success)' : 'var(--danger)'}; font-weight:bold;">${p.isActive ? 'Aktif' : 'Nonaktif'}</span></td>
                    <td>
                        <button class="btn-toggle-status" data-id="${docSnap.id}" data-active="${p.isActive}" style="padding: 5px 10px; cursor:pointer; background:var(--border); border:none; border-radius:4px;">Toggle</button>
                        <button class="btn-delete-product" data-id="${docSnap.id}" style="padding: 5px 10px; cursor:pointer; background:#fee2e2; color:var(--danger); border:none; border-radius:4px; margin-left:5px;">Hapus</button>
                    </td>
                </tr>
            `;
        });
    });

    // B. Realtime Listener Orders
    onSnapshot(collection(db, "orders"), (snapshot) => {
        totalOrdersEl.textContent = snapshot.size;
        ordersTable.innerHTML = "";

        if (snapshot.empty) {
            ordersTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--muted);">Belum ada pesanan masuk.</td></tr>`;
            return;
        }

        snapshot.forEach((docSnap) => {
            const o = docSnap.data();
            const formatRp = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(o.total);

            ordersTable.innerHTML += `
                <tr>
                    <td>#${docSnap.id.substring(0, 6).toUpperCase()}</td>
                    <td>${o.customerName}</td>
                    <td>${formatRp}</td>
                    <td><strong>${o.orderStatus}</strong></td>
                    <td>
                        <select class="select-order-status" data-id="${docSnap.id}" style="padding: 5px; border-radius: 4px; border:1px solid var(--border);">
                            <option value="pending" ${o.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${o.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="completed" ${o.orderStatus === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="cancelled" ${o.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </td>
                </tr>
            `;
        });
    });

    // C. Modal Controller untuk Tambah Produk
    const modal = document.getElementById("modal-product");
    document.getElementById("btn-open-add-product").addEventListener("click", () => modal.style.display = "flex");
    document.getElementById("btn-close-modal").addEventListener("click", () => modal.style.display = "none");

    // Submit Tambah Produk
    document.getElementById("form-add-product").addEventListener("submit", async (e) => {
        e.preventDefault();
        const btnSave = document.getElementById("btn-save-product");
        btnSave.disabled = true;
        btnSave.textContent = "Menyimpan...";

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

            modal.style.display = "none";
            e.target.reset();
            alert("Produk berhasil ditambahkan!");
        } catch (error) {
            console.error("Gagal tambah produk:", error);
            alert("Terjadi kesalahan.");
        } finally {
            btnSave.disabled = false;
            btnSave.textContent = "Simpan Produk";
        }
    });

    // D. Aksi Toggle Status & Hapus Produk
} // <--- PERHATIKAN: Tutup kurung kurawal ini sebelumnya keliru menjorok ke luar fungsi!

// Pindahkan event listener ke luar fungsi initAdminDashboard agar terpanggil dengan benar
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-toggle-status")) {
        const id = e.target.getAttribute("data-id");
        const currentActive = e.target.getAttribute("data-active") === "true";
        await updateDoc(doc(db, "products", id), { isActive: !currentActive });
    }
    if (e.target.classList.contains("btn-delete-product")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("Yakin ingin menghapus produk ini dari database?")) {
            await deleteDoc(doc(db, "products", id));
        }
    }
});

// E. Aksi Ubah Status Pesanan oleh Admin
document.addEventListener("change", async (e) => {
    if (e.target.classList.contains("select-order-status")) {
        const id = e.target.getAttribute("data-id");
        const newStatus = e.target.value;
        try {
            await updateDoc(doc(db, "orders", id), { orderStatus: newStatus, updatedAt: serverTimestamp() });
            alert("Status pesanan berhasil diperbarui!");
        } catch (error) {
            console.error("Gagal update status order:", error);
            alert("Gagal memperbarui status.");
        }
    }
});