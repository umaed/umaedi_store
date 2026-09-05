import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { collection, doc, setDoc, addDoc, onSnapshot, query, orderBy, serverTimestamp, getDoc } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

let currentUser = null;
let currentUserName = "Pelanggan";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        try {
            const userSnap = await getDoc(doc(db, "users", user.uid));
            if (userSnap.exists()) {
                currentUserName = userSnap.data().name || userSnap.data().username || "Pelanggan";
            }
        } catch (error) {
            console.error("Gagal mengambil nama user:", error);
        }
        loadMessages();
    } else {
        window.location.replace("login.html");
    }
});

function loadMessages() {
    const messagesRef = collection(db, "chats", currentUser.uid, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (snapshot) => {
        chatBox.innerHTML = "";
        snapshot.forEach(doc => {
            const msg = doc.data();
            const isMe = msg.senderId === currentUser.uid;
            const align = isMe ? "flex-end" : "flex-start";
            const bgColor = isMe ? "var(--primary)" : "#f1f5f9";
            const color = isMe ? "white" : "var(--text)";
            chatBox.innerHTML += `
                <div style="display: flex; justify-content: ${align}; margin-bottom: 12px;">
                    <div style="background: ${bgColor}; color: ${color}; padding: 10px 15px; border-radius: 12px; max-width: 75%;">
                        ${msg.text}
                    </div>
                </div>
            `;
        });
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentUser) return;
    chatInput.value = "";

    try {
        await addDoc(collection(db, "chats", currentUser.uid, "messages"), {
            senderId: currentUser.uid,
            text: text,
            createdAt: serverTimestamp()
        });

        await setDoc(doc(db, "chats", currentUser.uid), {
            uid: currentUser.uid,
            userName: currentUserName,
            lastMessage: text,
            updatedAt: serverTimestamp()
        }, { merge: true });

    } catch (error) {
        console.error("Gagal mengirim pesan:", error);
        alert("Pesan gagal terkirim: " + error.message);
    }
}

sendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => { 
    if (e.key === "Enter") sendMessage(); 
});