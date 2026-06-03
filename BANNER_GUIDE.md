# 📸 BANNER FEATURE GUIDE

## Overview
Fitur banner foto telah ditambahkan di halaman homepage untuk mengisi area kosong dan meningkatkan visual.

## Lokasi Banner
- **Halaman**: index.html (Homepage)
- **Posisi**: Setelah hero section, sebelum "Featured Products"
- **Ukuran**: Full width responsive
- **Tinggi**:
  - Desktop: 280px
  - Tablet (768px): 220px
  - Mobile (480px): 180px

## Banner Structure

```html
<section class="banner-section">
  <div class="banner-container">
    <img src="assets/img/banner-1.jpg" alt="Banner 1" class="banner-image" />
    <div class="banner-overlay"></div>
    <div class="banner-text">
      <h3>✨ Premium Collection</h3>
      <p>Discover our exclusive digital creator store</p>
    </div>
  </div>
</section>
```

## Fitur Banner

✨ **Visual Effects:**
- Smooth hover animation (lift up effect)
- Image zoom on hover
- Gradient overlay untuk contrast
- Smooth shadow transition

🎨 **Styling:**
- Rounded corners (16px)
- Gradient overlay untuk readability
- Premium dark text with shadow
- Responsive pada semua ukuran layar

📱 **Responsive:**
- Desktop: 280px tinggi
- Tablet: 220px tinggi
- Mobile: 180px tinggi
- Text sizing adjust di setiap breakpoint

## Cara Customize

### 1. Ganti Banner Image
```
Letakkan file gambar di: assets/img/
Nama file: banner-1.jpg (atau sesuai preferensi)

Update di index.html:
<img src="assets/img/NAMA_FILE_ANDA.jpg" alt="Banner 1" class="banner-image" />
```

### 2. Ganti Text Banner

Edit di index.html:
```html
<div class="banner-text">
  <h3>✨ Premium Collection</h3>
  <p>Discover our exclusive digital creator store</p>
</div>
```

Ubah ke:
```html
<div class="banner-text">
  <h3>🎉 Flash Sale 50%</h3>
  <p>Limited time offer - Jangan sampai terlewat!</p>
</div>
```

### 3. Ganti Warna Overlay

Edit di css/style.css, cari `.banner-overlay`:
```css
.banner-overlay {
  background: linear-gradient(135deg, rgba(26,26,26,0.4) 0%, rgba(191,161,74,0.2) 100%);
}
```

Ubah rgba values:
- Pertama (26,26,26) = Dark color
- Kedua (191,161,74) = Gold color

### 4. Ganti Warna Text

Edit di css/style.css, cari `.banner-text h3` dan `.banner-text p`:
```css
.banner-text h3 {
  color: #fffbe6;  /* Gold/light color */
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.banner-text p {
  color: #ddd;  /* Light gray */
}
```

## Rekomendasi Image Size

**Banner Image Specifications:**
- **Aspect Ratio**: 16:9 (recommended) atau lebih lebar
- **Min Width**: 1400px (untuk desktop)
- **Min Height**: 280px (untuk desktop)
- **Format**: JPG, PNG
- **File Size**: < 500KB (untuk fast loading)
- **Quality**: Tinggi, minimal blur

**Contoh dimensi:**
- 1400 x 280px (persis desktop size)
- 1600 x 300px (sedikit lebih besar untuk zoom effect)
- 2000 x 400px (high quality untuk all devices)

## Animasi & Hover Effects

```css
/* Pada hover, banner: */
- Naik ke atas (translateY -4px)
- Shadow membesar
- Image zoom 1.05x
- Smooth transition 0.3s - 0.5s
```

## CSS Classes

- `.banner-section` - Container utama (dengan margin & animation)
- `.banner-container` - Wrapper banner (dengan shadow & hover)
- `.banner-image` - Elemen gambar (dengan zoom effect)
- `.banner-overlay` - Gradient overlay untuk contrast
- `.banner-text` - Text section (absolute positioned di bawah)

## Responsivitas

```
Desktop (1024px+):
├─ Height: 280px
├─ Text H3: 1.8rem
├─ Text P: 1rem
└─ Padding: 2em

Tablet (768px):
├─ Height: 220px
├─ Text H3: 1.4rem
├─ Text P: 0.9rem
└─ Padding: 1.5em

Mobile (480px):
├─ Height: 180px
├─ Text H3: 1.1rem
├─ Text P: 0.8rem
└─ Padding: 1.2em
```

## Performance Tips

✅ **Optimize untuk loading cepat:**
- Gunakan format JPG untuk photos
- Compress image sebelum upload (max 500KB)
- Gunakan dimensions yang tepat (avoid oversized)
- Consider lazy loading untuk multiple banners

## Multiple Banners (Future Enhancement)

Jika ingin menambah lebih dari 1 banner:

```html
<section class="banner-section">
  <div class="banner-container">
    <img src="assets/img/banner-1.jpg" alt="Banner 1" />
    <div class="banner-overlay"></div>
    <div class="banner-text">
      <h3>✨ Premium Collection</h3>
      <p>Discover exclusive items</p>
    </div>
  </div>
</section>

<section class="banner-section">
  <div class="banner-container">
    <img src="assets/img/banner-2.jpg" alt="Banner 2" />
    <div class="banner-overlay"></div>
    <div class="banner-text">
      <h3>🎉 New Arrivals</h3>
      <p>Check out latest products</p>
    </div>
  </div>
</section>
```

## Troubleshooting

**Q: Banner image tidak muncul?**
A: 
- Check path: `assets/img/NAMA_FILE.jpg`
- Pastikan file exists dan format benar
- Gunakan onerror fallback (already in code)

**Q: Text tidak terlihat di banner?**
A: 
- Check overlay color opacity (mungkin terlalu transparan)
- Increase text size di CSS
- Add stronger text-shadow

**Q: Banner terlalu besar/kecil?**
A: 
- Adjust height di `.banner-container`
- Update values untuk setiap media query

## File Locations

```
📁 assets/
  └─ 📁 img/
      ├─ banner-1.jpg (← Place banner images here)
      ├─ placeholder-banner.png
      └─ ...other images

📄 index.html (HTML structure)
📄 css/style.css (CSS styling & responsive)
```

---

**Status**: ✅ READY TO USE

Siap untuk customize dengan banner photo Anda sendiri! 🎨
