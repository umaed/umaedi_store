import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, query, orderBy, onSnapshot, doc, getDoc, addDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

let currentAdmin = null;
let selectedChatId = null; // userId dari chat yang dipilih
let chatsData = [];

const chatList = document.getElementById("conv-items");
const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const chatHeader = document.getElementById("chat-header");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Cek admin
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === "admin" || userDoc.data().isAdmin === true)) {
            currentAdmin = user;
            loadChats();
        } else {
            window.location.href = "login.html";
        }
    } else {
        window.location.href = "login.html";
    }
});

function loadChats() {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, orderBy("updatedAt", "desc"));

    onSnapshot(q, (snapshot) => {
        chatsData = [];
        chatList.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            chatsData.push({ id: doc.id, ...data });
            
            const chatHTML = `
    <div class="conv-item" data-id="${doc.id}">
        <div class="conv-item-avatar">${(data.userName || "P").charAt(0).toUpperCase()}</div>
        <div class="conv-item-info">
            <div class="conv-item-name">${data.userName || "Pelanggan"}</div>
            <div class="conv-item-last">${data.lastMessage || "Belum ada pesan"}</div>
        </div>
    </div>
`;
            chatList.insertAdjacentHTML('beforeend', chatHTML);
        });

        // Auto-select pertama jika belum ada yang dipilih
        if (chatsData.length > 0 && !selectedChatId) {
            selectChat(chatsData[0].id);
        }
    });
}

// Klik untuk memilih chat
chatList.addEventListener("click", (e) => {
    const item = e.target.closest(".conv-item");
    if (item) {
        selectChat(item.dataset.id);
    }
});

function selectChat(userId) {
    selectedChatId = userId;
    const chat = chatsData.find(c => c.id === userId);
    if (chat) {
        const chatName = chat.userName || "Pelanggan";
        document.getElementById("chat-name").textContent = chatName;
        document.getElementById("chat-avatar").textContent = chatName.charAt(0).toUpperCase();
        chatBox.innerHTML = "";
        startListeningMessages(userId);
    }
}

function startListeningMessages(userId) {
    const messagesRef = collection(db, "chats", userId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = "";
        snapshot.forEach(doc => {
            const msg = doc.data();
            const isSender = msg.senderId === currentAdmin.uid;
            const align = isSender ? "flex-end" : "flex-start";
            const bg = isSender ? "var(--primary)" : "#f1f5f9";
            const color = isSender ? "white" : "var(--text)";

            chatBox.innerHTML += `
                <div style="display: flex; justify-content: ${align}; margin-bottom: 12px;">
                    <div style="background: ${bg}; color: ${color}; padding: 10px 15px; border-radius: 12px; max-width: 75%;">
                        ${msg.text}
                    </div>
                </div>
            `;
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
    if (!selectedChatId || !currentAdmin) return;
    const text = chatInput.value.trim();
    if (!text) return;

    const messagesRef = collection(db, "chats", selectedChatId, "messages");
    await addDoc(messagesRef, {
        senderId: currentAdmin.uid,
        senderName: "Admin UmaDigi",
        text: text,
        createdAt: serverTimestamp()
    });

    const chatDocRef = doc(db, "chats", selectedChatId);
    await updateDoc(chatDocRef, {
        lastMessage: text,
        updatedAt: serverTimestamp()
    });

    chatInput.value = "";
}