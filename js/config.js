// config.js - UMAEDI STORE Configuration
const CONFIG = {
  store: {
    name: 'UMAEDI STORE',
    slogan: 'MODERN · LUXURY · EXCLUSIVE · DIGITAL CREATOR STORE',
    collaboration: 'UMAVERSE × UMAVALENCIA',
    owner: {
      name: 'Catherine Valencia',
      title: 'Owner Member of UMAEDI STORE',
      image: '../assets/img/owner-catherine.jpg'
    }
  },
  
  contact: {
    whatsapp: {
      number: '6283818115136',
      name: 'UMAEDI STORE'
    },
    email: 'info@umaedi.store',
    hours: '09:00 - 22:00 WIB'
  },
  
  colors: {
    primary: '#bfa14a',      // Gold
    secondary: '#1a1a1a',    // Dark
    background: '#f8f8f8',   // Light gray
    accent: '#e53935',       // Red
    text: '#333',
    textLight: '#666',
    border: '#f0f0f0'
  },
  
  adminFee: 10000,           // Rp10,000
  taxPercentage: 10,         // 10% tax
  
  pages: {
    home: '/',
    fashion: '/pages/fashion.html',
    preset: '/pages/preset.html',
    limited: '/pages/limited.html',
    rare: '/pages/rare.html',
    jkt48: '/pages/pm-jkt48.html',
    cart: '/pages/cart.html',
    checkout: '/pages/checkout.html'
  }
};

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}