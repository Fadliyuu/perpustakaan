# 🎨 Setup PWA Icons dari Logo Sekolah

## 📋 Langkah-Langkah

### **Opsi 1: Menggunakan Script Otomatis (Recommended)**

1. **Install dependency:**
   ```bash
   cd frontend
   npm install sharp
   ```
   atau
   ```bash
   npm install canvas
   ```

2. **Generate icons:**
   ```bash
   npm run generate-icons
   ```

3. **Selesai!** Icons akan dibuat di `frontend/public/`:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)
   - `favicon.png` (32x32)

### **Opsi 2: Manual dengan Online Tools**

1. **Buka logo di:** `frontend/public/Logo/logo.png`

2. **Convert menggunakan tool online:**
   - https://www.favicon-generator.org/
   - https://realfavicongenerator.net/
   - https://www.pwabuilder.com/imageGenerator

3. **Download dan simpan:**
   - `icon-192.png` → simpan di `frontend/public/`
   - `icon-512.png` → simpan di `frontend/public/`
   - `favicon.png` → simpan di `frontend/public/`

### **Opsi 3: Manual dengan Image Editor**

1. **Buka logo di Photoshop/GIMP/Canva**

2. **Export dengan ukuran:**
   - 192x192 pixels → `icon-192.png`
   - 512x512 pixels → `icon-512.png`
   - 32x32 pixels → `favicon.png`

3. **Simpan di:** `frontend/public/`

## ✅ Verifikasi

Setelah icons dibuat, pastikan file-file ini ada:
- ✅ `frontend/public/icon-192.png`
- ✅ `frontend/public/icon-512.png`
- ✅ `frontend/public/favicon.png`

## 🧪 Test PWA Icons

1. **Build frontend:**
   ```bash
   npm run build
   ```

2. **Preview:**
   ```bash
   npm run preview
   ```

3. **Buka di browser:**
   - Cek tab browser (favicon muncul)
   - Buka DevTools → Application → Manifest
   - Cek icons terlihat

4. **Test install PWA:**
   - Chrome/Edge: Menu → "Install App"
   - Safari (iOS): Share → "Add to Home Screen"

## 📱 Icon Requirements

- **Format:** PNG (transparent background recommended)
- **Sizes:** 
  - 192x192 (minimum untuk Android)
  - 512x512 (recommended untuk semua platform)
  - 32x32 (favicon untuk browser tab)

## 🎨 Tips

- Gunakan logo dengan background transparan untuk hasil terbaik
- Pastikan logo terlihat jelas di ukuran kecil (32x32)
- Test di berbagai device untuk memastikan icon terlihat baik

---

**Setelah icons dibuat, aplikasi siap untuk di-deploy sebagai PWA! 🚀**

