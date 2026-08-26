// Firebase Realtime Database bridge for the static storefront.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getDatabase, onValue, ref, runTransaction, set } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js';
import { createUserWithEmailAndPassword, deleteUser, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: 'AIzaSyC9pFBCY8Lkhn5egBCX1RDDUpUaTyiiHP4',
  authDomain: 'umadigi-store.firebaseapp.com',
  databaseURL: 'https://umadigi-store-default-rtdb.firebaseio.com',
  projectId: 'umadigi-store',
  storageBucket: 'umadigi-store.firebasestorage.app',
  messagingSenderId: '563265700609',
  appId: '1:563265700609:web:2d116a0cd595d16342d100',
  measurementId: 'G-4XXS8RP2GY'
};

let database;
let auth;
let clientId = null;
let identityReady = Promise.resolve(false);
try {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
  identityReady = new Promise(resolve => onAuthStateChanged(auth, user => {
    clientId = user?.uid || null;
    resolve(Boolean(user));
  }));
} catch (error) {
  console.warn('Firebase tidak dapat diinisialisasi:', error);
}

window.firebaseStore = {
  enabled: Boolean(database),
  get clientId() {
    return clientId;
  },

  get currentUser() {
    return auth?.currentUser || null;
  },

  normalizeUsername(username) {
    return String(username || '').trim().toLowerCase();
  },

  async createAccount(username, password) {
    if (!auth || !database) throw new Error('Firebase belum siap.');
    const normalizedUsername = this.normalizeUsername(username);
    const credential = await createUserWithEmailAndPassword(auth, `${normalizedUsername}@accounts.umadigi.local`, password);
    const reservation = await runTransaction(ref(database, `usernames/${normalizedUsername}`), current => {
      if (current !== null) return;
      return { uid: credential.user.uid, username: normalizedUsername };
    });

    if (!reservation.committed) {
      await deleteUser(credential.user);
      throw new Error('USERNAME_TAKEN');
    }

    await set(ref(database, `users/${credential.user.uid}`), {
      uid: credential.user.uid,
      username: normalizedUsername,
      createdAt: Date.now()
    });
    return { uid: credential.user.uid, username: normalizedUsername };
  },

  async login(username, password) {
    if (!auth) throw new Error('Firebase belum siap.');
    const normalizedUsername = this.normalizeUsername(username);
    const credential = await signInWithEmailAndPassword(auth, `${normalizedUsername}@accounts.umadigi.local`, password);
    return { uid: credential.user.uid, username: normalizedUsername };
  },

  async logout() {
    if (auth) await signOut(auth);
  },

  async getProfile(user = auth?.currentUser) {
    if (!database || !user) return null;
    const snapshot = await new Promise(resolve => onValue(ref(database, `users/${user.uid}`), resolve, { onlyOnce: true }));
    return snapshot.val();
  },

  async saveOrder(order) {
    if (!database || !(await identityReady) || !clientId) return false;

    try {
      await set(ref(database, `orders/${clientId}/${order.id}`), {
        ...order,
        clientId,
        updatedAt: Date.now()
      });
      return true;
    } catch (error) {
      console.warn('Order hanya tersimpan secara lokal:', error);
      return false;
    }
  },

  subscribeOrders(onOrdersChanged) {
    if (!database) return () => {};

    let unsubscribe = () => {};
    identityReady.then(ready => {
      if (!ready || !clientId) return;
      unsubscribe = onValue(ref(database, `orders/${clientId}`), snapshot => {
        const orders = snapshot.val() || {};
        onOrdersChanged(Object.values(orders));
      }, error => {
        console.warn('Sinkronisasi order Firebase gagal:', error);
      });
    });
    return () => unsubscribe();
  }
};

window.dispatchEvent(new Event('firebaseStoreReady'));