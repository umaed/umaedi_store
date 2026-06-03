# 🌟 UMAEDI STORE

**UMAEDI STORE** - A modern, luxury, and fully animated online store website in collaboration with **UMAVERSE × UMAVALENCIA**.

## 🎯 Brand Positioning
- **MODERN · LUXURY · EXCLUSIVE · DIGITAL CREATOR STORE**

## ✨ Key Features

✅ **Responsive Mobile Design** - Perfectly optimized for all devices  
✅ **Modern E-commerce Layout** - Like Lazada with premium aesthetics  
✅ **Smooth Animations** - Page fade-in, product slide-up, hover effects  
✅ **Product Categories** - Fashion, Presets, Limited Edition, Rare, JKT48 Members  
✅ **Shopping Cart** - Add to cart with local storage persistence  
✅ **WhatsApp Checkout** - Direct order via WhatsApp integration  
✅ **Luxury Tag Effects** - RARE (red gradient) & LIMITED (gold gradient) tags  
✅ **Owner Member Card** - Ultra-premium card for Catherine Valencia (Owner)  
✅ **Pure JavaScript** - No frameworks, clean vanilla code  
✅ **Professional Footer** - Complete contact & navigation info  

## 📁 Folder Structure

```
umaedi-store/
├── index.html                 # Homepage
├── pages/
│   ├── fashion.html          # Fashion products
│   ├── preset.html           # Preset & filters
│   ├── limited.html          # Limited edition items
│   ├── rare.html             # Rare collection
│   ├── pm-jkt48.html         # JKT48 members & owner
│   ├── cart.html             # Shopping cart
│   └── checkout.html         # Checkout page
├── css/
│   ├── style.css             # Base styles & responsive
│   ├── navbar.css            # Navigation bar
│   ├── product.css           # Product grid & cards
│   ├── theme.css             # Color variables
│   ├── tag.css               # Product tags (RARE, LIMITED)
│   ├── animation.css         # Global animations
│   ├── member.css            # Member cards
│   └── checkout.css          # Checkout styles
├── js/
│   ├── navbar.js             # Navigation logic
│   ├── footer.js             # Footer rendering
│   ├── product.js            # Product data & rendering
│   ├── cart.js               # Cart management
│   ├── animation.js          # Animation effects
│   ├── theme.js              # Theme handling
│   ├── member.js             # Member card logic
│   ├── whatsapp.js           # WhatsApp integration
│   ├── search.js             # Search functionality
│   └── music.js              # Audio features
├── assets/
│   ├── img/                  # Product images (add your own)
│   └── music/                # Audio files (optional)
├── start-server.bat          # Windows server launcher
├── start-server.sh           # Linux/Mac server launcher
└── README.md                 # This file
```

## 🚀 How to Run

### Option 1: Direct File (Simple)
1. Open `index.html` in your browser
2. Website works locally (may have path issues)

### Option 2: Local Server (Recommended)
1. **Windows**: Double-click `start-server.bat`
2. **Mac/Linux**: Run `bash start-server.sh`
3. Open browser to: `http://localhost:8000`
4. All features work perfectly!

### Option 3: Python (If installed)
```bash
cd umaedi-store
python -m http.server 8000
# Then open http://localhost:8000
```

### Option 4: Node.js (If installed)
```bash
cd umaedi-store
npx http-server
```

## 📱 Mobile Responsive
- ✅ Optimized for **mobile-first** design
- ✅ Responsive grid layout (fluid columns)
- ✅ Touch-friendly buttons & navigation
- ✅ Fast loading animations
- ✅ Smooth scrolling on all devices

## 🎨 Design Highlights

### Color Scheme
- **Primary**: Gold (#bfa14a) - Premium luxury feel
- **Accent**: Dark Gray (#1a1a1a) - Professional
- **Background**: Light Gray (#f8f8f8) - Modern
- **Red**: Alert/Rare (#e53935) - Attention-grabbing

### Typography
- **Headers**: Bold, luxury serif feel
- **Body**: Clean, modern system fonts
- **Consistency**: Professional throughout

### Animations
- ⚡ Page fade-in (0.8s)
- 📊 Product slide-up (0.6s staggered)
- 🎯 Hover effects (scale & glow)
- ✨ Loading spinner
- 🔄 Cart count bounce

## 🛒 Shopping Features

### Product Cards
- Product image with hover zoom
- Price with discount display
- 5-star rating
- Original vs. sale price comparison
- Add to cart / Select buttons
- Favorite (heart) toggle

### Cart Management
- Real-time item count in navbar
- Add/remove items easily
- Cart persists in localStorage
- Summary with admin fee (Rp10,000)
- Tax calculation (10%)

### Checkout
- Order review
- WhatsApp order button
- Auto-formatted WhatsApp message with:
  - Store name & collaboration
  - Product list
  - Item prices
  - Total calculation
  - Admin fee

### WhatsApp Integration
```
Send order to: +62 838-1811-5136
Message includes complete order details
```

## 👑 Special Features

### Owner Member Card (PM JKT48)
- **Catherine Valencia** - Owner Member
- Ultra-premium gold border card
- Luxury shimmer animation
- Larger & more prominent display
- VIP spotlight effect

### JKT48 Members
- Beautiful member cards below owner
- Animated appearance
- Professional member display

### Product Tags
- **RARE**: Red gradient + shimmer + pulse animation
- **LIMITED**: Gold gradient + metallic shine + pulse animation

## 🔧 Customization

### Add Products
Edit `js/product.js` - Add items to the `products` array

### Change Colors
Edit `css/theme.css` - Modify CSS variables

### Update Store Info
- `index.html` - Hero section
- `js/footer.js` - Contact details & info
- `js/navbar.js` - Navigation links

### Add Images
- Place images in `assets/img/`
- Update product image paths in `js/product.js`

## 📝 Product Categories

1. **Fashion** - Clothing & accessories
2. **Presets** - Lightroom & color grading
3. **Limited Edition** - Exclusive items
4. **Rare** - Ultra-premium collections
5. **PM JKT48** - Member selection (special redirect)

## ⚠️ Important Notes

- ✅ All code is **pure HTML/CSS/JavaScript**
- ✅ No external dependencies required
- ✅ Works **completely offline**
- ✅ Images placeholder with fallback
- ✅ Fast loading & smooth performance
- ✅ SEO-friendly structure

## 🎯 Next Steps

1. **Replace Placeholder Images**: Add your product photos to `assets/img/`
2. **Update Product Data**: Edit `js/product.js` with real products
3. **Add Member Photos**: Update member images in `js/member.js`
4. **Deploy**: Upload to hosting or use local server

## 📞 Support

**WhatsApp**: +62 838-1811-5136  
**Brand**: UMAVERSE × UMAVALENCIA  
**Store**: UMAEDI STORE

---

**Made with ❤️ | Modern. Luxury. Exclusive. Digital Creator Store.**
