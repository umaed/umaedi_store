import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

// Fungsi untuk mengecek lokasi halaman saat ini
const currentPath = window.location.pathname;
const isAuthPage = currentPath.includes("login.html") || currentPath.includes("register.html");
const isRootPage = currentPath.endsWith("/") || currentPath.endsWith("index.html");

onAuthStateChanged(auth, (user) => {
    if (user) {
        // JIKA USER SUDAH LOGIN:
        // Jika dia berada di index.html atau halaman login/register, arahkan ke Home.
        if (isRootPage || isAuthPage) {
            const prefix = isRootPage ? "pages/" : "";
            window.location.replace(prefix + "home.html");
        }
        // Jika dia sudah di halaman home.html (atau halaman aman lain), biarkan saja.
    } else {
        // JIKA USER BELUM LOGIN:
        // Jika dia TIDAK berada di halaman login/register, paksa ke halaman login.
        if (!isAuthPage) {
            const prefix = isRootPage ? "pages/" : "";
            window.location.replace(prefix + "login.html");
        }
    }
});