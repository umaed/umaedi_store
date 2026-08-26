import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const profileContent = document.getElementById("profile-content");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            // Ambil data profil tambahan dari dokumen Firestore koleksi 'users'
            const userDocRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userDocRef);

            let userData = {
                name: user.displayName || "Pengguna UmaDigi",
                username: "user_" + user.uid.substring(0, 5),
                email: user.email,
                role: "user",
                createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime) : new Date()
            };

            if (userSnap.exists()) {
                const data = userSnap.data();
                userData.name = data.name || userData.name;
                userData.username = data.username || userData.username;
                userData.role = data.role || userData.role;
                if (data.createdAt) {
                    userData.createdAt = data.createdAt.toDate();
                }
            }

            // Inisial huruf pertama dari nama untuk Avatar lingkaran
            const initial = userData.name.charAt(0).toUpperCase();
            const formattedDate = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(userData.createdAt);

            // Render Tampilan Profil
            profileContent.innerHTML = `
                <div class="profile-header-card">
                    <div class="profile-avatar">${initial}</div>
                    <div class="profile-name">${userData.name}</div>
                    <div class="profile-email">${userData.email}</div>
                </div>

                <div class="profile-details-card">
                    <div class="profile-row">
                        <span class="profile-label">Username</span>
                        <span class="profile-value">@${userData.username}</span>
                    </div>
                    <div class="profile-row">
                        <span class="profile-label">Peran Akun</span>
                        <span class="profile-value" style="text-transform: uppercase; color: var(--primary);">${userData.role}</span>
                    </div>
                    <div class="profile-row">
                        <span class="profile-label">Bergabung Sejak</span>
                        <span class="profile-value">${formattedDate}</span>
                    </div>
                </div>

                <button class="btn-logout" id="btn-logout-action">Keluar (Logout)</button>
            `;

            // Event Listener untuk Tombol Logout
            document.getElementById("btn-logout-action").addEventListener("click", async () => {
                if (confirm("Apakah Anda yakin ingin keluar dari akun?")) {
                    try {
                        await signOut(auth);
                        window.location.replace("login.html");
                    } catch (error) {
                        console.error("Gagal logout:", error);
                        alert("Terjadi kesalahan saat logout.");
                    }
                }
            });

        } catch (error) {
            console.error("Error mengambil profil:", error);
            profileContent.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 40px;">Gagal memuat informasi profil.</p>`;
        }
    } else {
        window.location.href = "login.html";
    }
});