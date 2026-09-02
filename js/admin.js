import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { 
    collection, getDoc, doc, onSnapshot, addDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const guardLoading = document.getElementById("admin-guard-loading");
const adminDashboard = document.getElementById("admin-dashboard-content");

let productsData = [];
let ordersData = [];

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && (userDoc.data().role === "admin" || userDoc.data().isAdmin === true)) {
                if (guardLoading) guardLoading.style.display = "none";
                if (adminDashboard) adminDashboard.style.display = "block";
                initAdminDashboard();
            } else {
                if (guardLoading) guardLoading.textContent = "Akses ditolak! Halaman ini khusus Administrator.";
                setTimeout(() => window.location.replace("home.html"), 2000);
            }
        } catch (error) {
            console.error("Gagal verifikasi admin:", error);
            window.location.replace("home.html");
        }
    } else {
        window.location.replace("login.html");
    }
});

const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);

function initAdminDashboard() {
    // --- REALTIME LISTENER BANNER ---
    onSnapshot(query(collection(db, "banners"), orderBy("createdAt", "desc")), (snapshot) => {
        const table = document.getElementById("admin-banners-table");
        if(table) {
            table.innerHTML = "";
            if(snapshot.empty) { table.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Belum ada banner.</td></tr>`; return; }
            
            snapshot.forEach(docSnap => {
                const b = docSnap.data();
                table.innerHTML += `
                    <tr>
                        <td><img src="${b.imageUrl}" style="height:50px; border-radius:6px; object-fit:cover;"></td>
                        <td><strong>${b.title}</strong></td>
                        <td class="text-center">
                            <button class="btn-sm btn-delete btn-delete-banner" data-id="${docSnap.id}">Hapus</button>
                        </td>
                    </tr>`;
            });
        }
    });

    // --- REALTIME LISTENER PRODUK ---
    onSnapshot(collection(db, "products"), (snapshot) => {
        productsData = [];
        snapshot.forEach(doc => productsData.push({ id: doc.id, ...doc.data() }));
        const statTotal = document.getElementById("stat-total-products");
        if(statTotal) statTotal.textContent = snapshot.size;
        renderProducts(productsData);
    });

    // --- REALTIME LISTENER ORDERS ---
    onSnapshot(collection(db, "orders"), (snapshot) => {
        ordersData = [];
        let totalRevenue = 0; let pendingCount = 0;

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            ordersData.push({ id: docSnap.id, ...data });
            if (data.orderStatus === 'completed') totalRevenue += data.total;
            if (data.orderStatus === 'pending') pendingCount++;
        });

        const statOrders = document.getElementById("stat-total-orders");
        const statPending = document.getElementById("stat-pending-orders");
        const statRevenue = document.getElementById("stat-total-revenue");
        
        if(statOrders) statOrders.textContent = snapshot.size;
        if(statPending) statPending.textContent = pendingCount;
        if(statRevenue) statRevenue.textContent = formatRp(totalRevenue);
        
        renderOrders(ordersData);
    });

    setupModals();
    setupSearch();
}

function renderProducts(data) {
    const table = document.getElementById("admin-products-table");
    if(!table) return;
    table.innerHTML = "";
    if (data.length === 0) { table.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Belum ada produk.</td></tr>`; return; }

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
            </tr>`;
    });
}

function renderOrders(data) {
    const table = document.getElementById("admin-orders-table");
    if(!table) return;
    table.innerHTML = "";
    if (data.length === 0) { table.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Belum ada pesanan masuk.</td></tr>`; return; }

    data.forEach(o => {
        const shortId = o.id.substring(0, 6).toUpperCase();
        let statusColor = "var(--text)";
        if(o.orderStatus === 'completed') statusColor = "var(--success)";
        if(o.orderStatus === 'cancelled') statusColor = "var(--danger)";
        if(o.orderStatus === 'pending') statusColor = "#f59e0b";

        const proofBtn = o.paymentProof 
            ? `<button class="btn-sm btn-edit btn-view-proof" data-id="${o.id}">Lihat Bukti</button>` 
            : `<span class="text-muted" style="font-size:0.8rem;">Tidak ada</span>`;

        const detailBtn = `<button class="btn-sm btn-outline btn-view-order" data-id="${o.id}">Lihat Detail</button>`;

        table.innerHTML += `
            <tr>
                <td><strong>#${shortId}</strong></td>
                <td>${o.customerName}<br>${detailBtn}</td>
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
            </tr>`;
    });
}

function setupSearch() {
    const searchProd = document.getElementById("search-product");
    const searchOrd = document.getElementById("search-order");
    
    if(searchProd) {
        searchProd.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            renderProducts(productsData.filter(p => p.name.toLowerCase().includes(query) || p.categoryName.toLowerCase().includes(query)));
        });
    }
    if(searchOrd) {
        searchOrd.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            renderOrders(ordersData.filter(o => o.id.toLowerCase().includes(query) || o.customerName.toLowerCase().includes(query)));
        });
    }
}

// =====================================
// VARIANT BUILDER dengan HARGA
// =====================================
function createVariantGroup(container, data = { name: '', options: [] }) {
    const groupId = 'vg_' + Date.now() + Math.floor(Math.random() * 100);
    const html = `
        <div class="builder-box" id="${groupId}">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <strong>Jenis Varian</strong>
                <button type="button" class="btn-sm btn-delete" onclick="document.getElementById('${groupId}').remove()">Hapus</button>
            </div>
            <input type="text" class="var-name" value="${data.name}" placeholder="Contoh: Ukuran, Warna, Bahan" required style="width:100%; margin-bottom:10px;">
            <div class="builder-options-list" id="opts_${groupId}"></div>
            <div style="display:flex; gap:5px; margin-top:5px;">
                <input type="text" id="in_${groupId}" placeholder="Nama opsi (Contoh: Hitam)" style="margin:0; flex:1;">
                <input type="number" id="price_${groupId}" placeholder="Harga tambahan (Rp)" style="margin:0; width:120px;" min="0">
                <button type="button" class="btn-sm btn-outline btn-add-opt" data-target="${groupId}">+ Tambah Opsi</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    const optContainer = document.getElementById(`opts_${groupId}`);
    data.options.forEach(opt => addOptionBadge(optContainer, opt));
}

function addOptionBadge(container, value) {
    if (typeof value === 'string') value = { label: value, price: 0 };
    if (!value.label) return;
    const span = document.createElement("div");
    span.className = "builder-opt-chip";
    span.innerHTML = `${value.label} (${formatRp(value.price)}) <span onclick="this.parentElement.remove()">✕</span>`;
    span.dataset.label = value.label;
    span.dataset.price = value.price;
    container.appendChild(span);
}

function extractVariants(containerId) {
    const variants = [];
    const boxes = document.getElementById(containerId).querySelectorAll('.builder-box');
    boxes.forEach(box => {
        const name = box.querySelector('.var-name').value.trim();
        const options = Array.from(box.querySelectorAll('.builder-opt-chip')).map(chip => ({
            label: chip.dataset.label,
            price: Number(chip.dataset.price) || 0
        }));
        if (name && options.length > 0) {
            variants.push({ name, options });
        }
    });
    return variants;
}

// =====================================
// CUSTOM FORM BUILDER
// =====================================
function createFormField(container, data = { label: '', type: 'text', required: false, placeholder: '' }) {
    const fieldId = 'ff_' + Date.now() + Math.floor(Math.random() * 100);
    const html = `
        <div class="builder-box" id="${fieldId}">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                <strong>Field Form</strong>
                <button type="button" class="btn-sm btn-delete" onclick="document.getElementById('${fieldId}').remove()">Hapus</button>
            </div>
            <input type="text" class="form-label" value="${data.label}" placeholder="Label (contoh: Username Instagram)" required style="width:100%; margin-bottom:10px;">
            <div style="display:flex; gap:5px; margin-bottom:5px;">
                <select class="form-type" style="flex:1;">
                    <option value="text" ${data.type==='text'?'selected':''}>Teks</option>
                    <option value="number" ${data.type==='number'?'selected':''}>Angka</option>
                    <option value="email" ${data.type==='email'?'selected':''}>Email</option>
                </select>
                <label style="display:flex; align-items:center; gap:5px; white-space:nowrap;">
                    <input type="checkbox" class="form-required" ${data.required?'checked':''}> Wajib
                </label>
            </div>
            <input type="text" class="form-placeholder" value="${data.placeholder}" placeholder="Placeholder (opsional)" style="width:100%;">
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function extractForms(containerId) {
    const forms = [];
    const boxes = document.getElementById(containerId).querySelectorAll('.builder-box');
    boxes.forEach(box => {
        const label = box.querySelector('.form-label').value.trim();
        const type = box.querySelector('.form-type').value;
        const required = box.querySelector('.form-required').checked;
        const placeholder = box.querySelector('.form-placeholder').value.trim();
        if (label) {
            forms.push({ label, type, required, placeholder });
        }
    });
    return forms;
}

function setupModals() {
    const btnAddVariant = document.getElementById("btn-add-variant-group");
    if (btnAddVariant) {
        btnAddVariant.addEventListener("click", () => createVariantGroup(document.getElementById("add-variant-container")));
    }
    const btnEditVariant = document.getElementById("btn-edit-add-variant-group");
    if (btnEditVariant) {
        btnEditVariant.addEventListener("click", () => createVariantGroup(document.getElementById("edit-variant-container")));
    }

    const btnAddForm = document.getElementById("btn-add-form-group");
    if (btnAddForm) {
        btnAddForm.addEventListener("click", () => createFormField(document.getElementById("add-form-container")));
    }
    const btnEditForm = document.getElementById("btn-edit-add-form-group");
    if (btnEditForm) {
        btnEditForm.addEventListener("click", () => createFormField(document.getElementById("edit-form-container")));
    }

    const modalAdd = document.getElementById("modal-product");
    const formAddProduct = document.getElementById("form-add-product");
    
    document.getElementById("btn-open-add-product")?.addEventListener("click", () => modalAdd.style.display = "flex");
    document.getElementById("btn-close-modal")?.addEventListener("click", () => { 
        modalAdd.style.display = "none"; 
        formAddProduct.reset(); 
        document.getElementById("add-variant-container").innerHTML = "";
        document.getElementById("add-form-container").innerHTML = "";
    });
    
    formAddProduct?.addEventListener("submit", async (e) => {
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
                variants: extractVariants("add-variant-container"),
                customForms: extractForms("add-form-container"),
                isActive: true, 
                createdAt: serverTimestamp()
            });
            modalAdd.style.display = "none"; 
            e.target.reset();
            document.getElementById("add-variant-container").innerHTML = "";
            document.getElementById("add-form-container").innerHTML = "";
            alert("Produk berhasil ditambahkan!");
        } catch (error) { 
            console.error(error); alert("Terjadi kesalahan."); 
        } finally { 
            btn.disabled = false; btn.textContent = "Simpan Produk"; 
        }
    });

    const modalEdit = document.getElementById("modal-edit-product");
    const formEditProduct = document.getElementById("form-edit-product");
    
    document.getElementById("btn-close-edit")?.addEventListener("click", () => {
        modalEdit.style.display = "none";
        document.getElementById("edit-variant-container").innerHTML = "";
        document.getElementById("edit-form-container").innerHTML = "";
    });
    
    formEditProduct?.addEventListener("submit", async (e) => {
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
                variants: extractVariants("edit-variant-container"),
                customForms: extractForms("edit-form-container")
            });
            modalEdit.style.display = "none";
            alert("Produk berhasil diupdate!");
        } catch (error) { 
            console.error(error); alert("Gagal update produk."); 
        } finally { 
            btn.disabled = false; btn.textContent = "Update Produk"; 
        }
    });

    const modalBanner = document.getElementById("modal-banner");
    document.getElementById("btn-open-add-banner")?.addEventListener("click", () => modalBanner.style.display = "flex");
    
    let bannerBase64 = "";
    const bannerFileInput = document.getElementById("banner-image-file");
    if (bannerFileInput) {
        bannerFileInput.addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 700 * 1024) {
                    alert("Ukuran gambar terlalu besar! Harap kompres di bawah 700KB.");
                    this.value = ""; bannerBase64 = ""; return;
                }
                const reader = new FileReader();
                reader.onload = function(e) { bannerBase64 = e.target.result; };
                reader.readAsDataURL(file);
            } else { bannerBase64 = ""; }
        });
    }

    document.getElementById("btn-close-banner")?.addEventListener("click", () => {
        modalBanner.style.display = "none";
        document.getElementById("form-add-banner").reset();
        bannerBase64 = ""; 
    });

    document.getElementById("form-add-banner")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!bannerBase64) { alert("Harap pilih gambar terlebih dahulu!"); return; }

        const btn = document.getElementById("btn-save-banner");
        btn.disabled = true; btn.textContent = "Mengunggah...";
        
        try {
            await addDoc(collection(db, "banners"), {
                title: document.getElementById("banner-title").value,
                imageUrl: bannerBase64,
                createdAt: serverTimestamp()
            });
            modalBanner.style.display = "none"; 
            e.target.reset();
            bannerBase64 = "";
            alert("Banner berhasil diunggah!");
        } catch (error) { 
            alert("Gagal menyimpan banner: " + error.message); 
        } finally { 
            btn.disabled = false; btn.textContent = "Simpan Banner"; 
        }
    });

    document.getElementById("btn-close-proof")?.addEventListener("click", () => {
        document.getElementById("modal-proof").style.display = "none";
        document.getElementById("proof-image-display").src = "";
    });

    // Tutup modal detail pesanan
    document.getElementById("btn-close-order-detail")?.addEventListener("click", () => {
        document.getElementById("modal-order-detail").style.display = "none";
    });
}

// Aksi Klik Global (Delegation) - untuk berbagai tombol
document.addEventListener("click", async (e) => {
    // Aksi Tambah Pilihan Varian (Chip)
    if (e.target.classList.contains("btn-add-opt")) {
        const groupId = e.target.getAttribute("data-target");
        const inputLabel = document.getElementById(`in_${groupId}`);
        const inputPrice = document.getElementById(`price_${groupId}`);
        if (inputLabel && inputLabel.value.trim() !== "") {
            addOptionBadge(document.getElementById(`opts_${groupId}`), { label: inputLabel.value.trim(), price: Number(inputPrice.value) || 0 });
            inputLabel.value = "";
            inputPrice.value = "";
        }
    }

    // Aksi Status & Delete Produk
    if (e.target.classList.contains("btn-toggle")) {
        const id = e.target.getAttribute("data-id");
        await updateDoc(doc(db, "products", id), { isActive: !(e.target.getAttribute("data-active") === "true") });
    }
    if (e.target.classList.contains("btn-delete") && !e.target.classList.contains("btn-delete-banner")) {
        const id = e.target.getAttribute("data-id");
        if (id && confirm("Yakin ingin menghapus permanen produk ini?")) await deleteDoc(doc(db, "products", id));
    }
    if (e.target.classList.contains("btn-delete-banner")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("Hapus banner promo ini?")) await deleteDoc(doc(db, "banners", id));
    }

    // Aksi Edit Produk
    if (e.target.classList.contains("btn-edit") && !e.target.classList.contains("btn-view-proof")) {
        const product = productsData.find(p => p.id === e.target.getAttribute("data-id"));
        if (product) {
            document.getElementById("edit-id").value = product.id; 
            document.getElementById("edit-name").value = product.name;
            document.getElementById("edit-category").value = product.categoryName || ''; 
            document.getElementById("edit-price").value = product.price;
            document.getElementById("edit-image").value = product.image; 
            document.getElementById("edit-desc").value = product.description || '';
            
            const editVarContainer = document.getElementById("edit-variant-container");
            editVarContainer.innerHTML = "";
            if (product.variants && product.variants.length > 0) {
                product.variants.forEach(v => createVariantGroup(editVarContainer, v));
            }

            const editFormContainer = document.getElementById("edit-form-container");
            editFormContainer.innerHTML = "";
            if (product.customForms && product.customForms.length > 0) {
                product.customForms.forEach(f => createFormField(editFormContainer, f));
            }

            document.getElementById("modal-edit-product").style.display = "flex";
        }
    }

    // Aksi Lihat Bukti
    if (e.target.classList.contains("btn-view-proof")) {
        const order = ordersData.find(o => o.id === e.target.getAttribute("data-id"));
        if (order && order.paymentProof) {
            document.getElementById("proof-image-display").src = order.paymentProof;
            document.getElementById("modal-proof").style.display = "flex";
        } else { alert("Bukti pembayaran gagal dimuat."); }
    }

    // Aksi Lihat Detail Pesanan
    if (e.target.classList.contains("btn-view-order")) {
        const order = ordersData.find(o => o.id === e.target.getAttribute("data-id"));
        if (order) {
            let detailHtml = `
                <div style="margin-bottom: 10px;">
                    <strong>Nama Pembeli:</strong> ${order.customerName || '-'}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Email:</strong> ${order.customerEmail || '-'}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>WhatsApp:</strong> ${order.customerPhone || '-'}
                </div>
                <div style="margin-bottom: 15px;">
                    <strong>Metode Pembayaran:</strong> ${order.paymentMethod || '-'}
                </div>
                <div style="border-top: 1px solid var(--border); padding-top: 15px;">
                    <strong>Item yang dibeli:</strong>
                    <ul style="margin: 5px 0 0 0; padding-left: 15px;">
            `;
            
            order.items.forEach(item => {
                detailHtml += `<li style="margin-bottom: 5px;">`;
                detailHtml += `${item.quantity}x ${item.productName || item.name}`;
                
                if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
                    detailHtml += `<br><em>Varian: ` + Object.entries(item.selectedVariants).map(([k,v]) => `${k}: ${v.label || v}`).join(", ") + `</em>`;
                }
                
                if (item.customForms && Object.keys(item.customForms).length > 0) {
                    detailHtml += `<br><em>Form: ` + Object.entries(item.customForms).map(([k,v]) => `${k}: ${v}`).join(", ") + `</em>`;
                }
                
                detailHtml += `</li>`;
            });
            
            detailHtml += `
                    </ul>
                </div>
                <div style="margin-top: 15px; border-top: 1px solid var(--border); padding-top: 10px;">
                    <strong>Total:</strong> ${formatRp(order.total)}
                </div>
            `;
            
            document.getElementById("order-detail-content").innerHTML = detailHtml;
            document.getElementById("modal-order-detail").style.display = "flex";
        }
    }
});

// Aksi Update Order Status
document.addEventListener("change", async (e) => {
    if (e.target.classList.contains("select-order-status")) {
        try { 
            await updateDoc(doc(db, "orders", e.target.getAttribute("data-id")), { 
                orderStatus: e.target.value, 
                updatedAt: serverTimestamp() 
            });
        } catch (error) { 
            alert("Gagal memperbarui status."); 
        }
    }
});