// Import fungsi-fungsi Firebase dari CDN (Modular SDK v12.18.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

// Konfigurasi project UmaDigi Store V2 Anda
const firebaseConfig = {
    apiKey: "AIzaSyAth9rU8cJlikAPmXBCh7bxhNhx1Lorl7c",
    authDomain: "umadigi-store-v2.firebaseapp.com",
    projectId: "umadigi-store-v2",
    storageBucket: "umadigi-store-v2.firebasestorage.app",
    messagingSenderId: "147068858092",
    appId: "1:147068858092:web:ad4b38b481356bdab5bfc9",
    measurementId: "G-3SZ3GMXFVF"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Authentication dan Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export layanan agar bisa di-import oleh file JS lain
export { auth, db };