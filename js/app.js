import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, onSnapshot, getDoc, doc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const currentPath = window.location.pathname;
const isAuthPage = currentPath.includes("login.html") || currentPath.includes("register.html");
const isRootPage = currentPath.endsWith("/") || currentPath.endsWith("index.html");

const adminButtons = document.querySelectorAll('[data-admin-access]');

function updateAdminButtons(isAdmin) {
    adminButtons.forEach((button) => {
        button.style.display = isAdmin ? 'inline-flex' : 'none';
    });
}

async function getUserRole(uid) {
    try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists()) return "user";
        const data = userDoc.data();
        return data.role === "admin" || data.isAdmin === true ? "admin" : "user";
    } catch (error) {
        console.error("Gagal memuat role user:", error);
        return "user";
    }
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const role = await getUserRole(user.uid);
        updateAdminButtons(role === "admin");

        if (isRootPage || isAuthPage) {
            const prefix = isRootPage ? "pages/" : "";
            window.location.replace(prefix + "home.html");
        }

        // --- REALTIME CART BADGE GLOBAL ---
        const cartRef = collection(db, "cart", user.uid, "items");
        onSnapshot(cartRef, (snapshot) => {
            const count = snapshot.size;
            document.querySelectorAll('.cart-badge-count').forEach(badge => {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'inline-flex' : 'none';
                badge.style.alignItems = 'center';
                badge.style.justifyContent = 'center';
            });
        });

    } else {
        updateAdminButtons(false);
        if (!isAuthPage) {
            const prefix = isRootPage ? "pages/" : "";
            window.location.replace(prefix + "login.html");
        }
    }
});

// Auto-Active Bottom Nav
const navItems = document.querySelectorAll('.bottom-nav .nav-item');
if (navItems.length > 0) {
    let currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '') currentPage = 'home.html';
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentPage) item.classList.add('active');
    });
}