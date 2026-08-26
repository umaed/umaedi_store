import { auth, db } from "./firebase-config.js";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
// Menambahkan import dari Firestore
import { 
    doc, 
    setDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// Fungsi utilitas untuk menampilkan pesan error di UI
const showError = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if(errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    }
};

// ==============================
// 1. LOGIKA REGISTER DENGAN FIRESTORE
// ==============================
const registerForm = document.getElementById("register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById("reg-btn");
        btn.disabled = true;
        btn.textContent = "Memproses...";

        // Mengambil seluruh input dari form
        const fullName = document.getElementById("reg-name").value;
        const username = document.getElementById("reg-username").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("reg-confirm").value;

        // Validasi password lokal
        if (password !== confirmPassword) {
            showError("reg-error", "Password dan Konfirmasi Password tidak cocok!");
            btn.disabled = false;
            btn.textContent = "Daftar Sekarang";
            return;
        }

        try {
            // 1. Mendaftarkan user ke Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Membuat dokumen user di Firestore (Koleksi 'users')
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: fullName,
                username: username,
                email: email,
                photoURL: "", // Dikosongkan, bisa diubah nanti di halaman profile
                role: "user", // Default role untuk pendaftar baru
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            alert("Registrasi berhasil! Silakan login dengan akun Anda.");
            window.location.href = "login.html"; 
        } catch (error) {
            console.error("Register Error:", error);
            let errorMessage = "Terjadi kesalahan saat registrasi.";
            
            if (error.code === "auth/email-already-in-use") errorMessage = "Email ini sudah terdaftar.";
            if (error.code === "auth/weak-password") errorMessage = "Password terlalu lemah (minimal 6 karakter).";
            
            showError("reg-error", errorMessage);
            btn.disabled = false;
            btn.textContent = "Daftar Sekarang";
        }
    });
}

// ==============================
// 2. LOGIKA LOGIN
// ==============================
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById("login-btn");
        btn.disabled = true;
        btn.textContent = "Memeriksa...";

        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login berhasil!");
            window.location.href = "../index.html"; 
        } catch (error) {
            console.error("Login Error:", error);
            showError("login-error", "Email atau password salah. Silakan coba lagi.");
            btn.disabled = false;
            btn.textContent = "Masuk";
        }
    });
}

// ==============================
// 3. LUPA PASSWORD
// ==============================
const forgotPasswordBtn = document.getElementById("forgot-password");
if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        
        if (!email) {
            showError("login-error", "Harap isi kolom email terlebih dahulu lalu klik 'Lupa Password?'.");
            return;
        }
        
        try {
            await sendPasswordResetEmail(auth, email);
            alert(`Link reset password telah dikirim ke ${email}. Silakan cek kotak masuk atau folder spam Anda.`);
        } catch (error) {
            console.error("Reset Password Error:", error);
            showError("login-error", "Gagal mengirim email reset. Pastikan email Anda sudah benar.");
        }
    });
}