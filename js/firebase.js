// Firebase Realtime Database bridge for the static storefront.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import { getDatabase, onValue, ref, set } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';

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
  identityReady = signInAnonymously(auth).then(({ user }) => {
    clientId = user.uid;
    return true;
  }).catch(error => {
    console.warn('Firebase Anonymous Auth belum aktif:', error);
    return false;
  });
} catch (error) {
  console.warn('Firebase tidak dapat diinisialisasi:', error);
}

window.firebaseStore = {
  enabled: Boolean(database),
  get clientId() {
    return clientId;
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