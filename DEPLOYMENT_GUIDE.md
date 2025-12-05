# 📚 Panduan Deployment - Perpustakaan YP. Tunas Karya

## 🎯 Opsi Deployment

Aplikasi ini adalah **Web Application** yang bisa di-deploy dengan beberapa cara:

### ✅ **Opsi 1: Hosting Web App (Recommended)**
- ✅ Bisa diakses via browser
- ✅ Bisa diinstall sebagai PWA (Progressive Web App)
- ✅ Gratis dengan Vercel/Netlify
- ✅ Mudah di-maintain

### ✅ **Opsi 2: PWA (Progressive Web App)**
- ✅ Bisa diinstall di mobile/desktop
- ✅ Bekerja offline (dengan service worker)
- ✅ Terlihat seperti aplikasi native
- ✅ Setup sudah ada, tinggal deploy

### ⚠️ **Opsi 3: Desktop App (Electron/Tauri)**
- ⚠️ Perlu setup tambahan
- ⚠️ File lebih besar
- ⚠️ Update lebih kompleks

---

## 🚀 Langkah Deployment (Recommended: Vercel + Railway)

### **Step 1: Build Frontend untuk Production**

```bash
cd frontend
npm run build
```

Ini akan membuat folder `dist/` yang berisi file-file production-ready.

### **Step 2: Deploy Frontend ke Vercel**

1. **Install Vercel CLI** (opsional, bisa pakai web):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Web**:
   - Buka https://vercel.com
   - Sign up/login dengan GitHub
   - Klik "New Project"
   - Import repository GitHub Anda
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - Klik "Deploy"

3. **Environment Variables** (di Vercel Dashboard):
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```

### **Step 3: Deploy Backend ke Railway**

1. **Buka https://railway.app**
2. **Sign up/login** dengan GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select repository** Anda
5. **Root Directory**: `backend`
6. **Start Command**: `npm start`
7. **Environment Variables** (di Railway Dashboard):
   ```
   PORT=4000
   NODE_ENV=production
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-private-key
   FIREBASE_CLIENT_EMAIL=your-client-email
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   JWT_SECRET=your-jwt-secret
   ```

8. **Update CORS** di backend (`src/app.js`):
   ```javascript
   cors({
     origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
     credentials: true
   })
   ```

### **Step 4: Update Frontend API URL**

Setelah backend deployed, dapatkan URL dari Railway dan update di Vercel:
- Vercel Dashboard → Project → Settings → Environment Variables
- Update `VITE_API_BASE_URL` dengan URL Railway backend

---

## 📱 Setup PWA (Progressive Web App)

### **Step 1: Buat Icon PWA**

Anda perlu membuat 2 icon:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

Bisa menggunakan logo sekolah atau buat di:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

Simpan di: `frontend/public/`

### **Step 2: Update Manifest**

File `frontend/public/manifest.webmanifest` sudah ada, pastikan icon path benar.

### **Step 3: Test PWA**

1. Deploy frontend ke Vercel
2. Buka di browser mobile/desktop
3. Di Chrome/Edge: Menu → "Install App"
4. Di Safari (iOS): Share → "Add to Home Screen"

---

## 🔧 Alternatif Hosting

### **Frontend Alternatives:**
- **Netlify**: https://netlify.com (sama seperti Vercel)
- **Firebase Hosting**: https://firebase.google.com/docs/hosting
- **GitHub Pages**: https://pages.github.com (static only)

### **Backend Alternatives:**
- **Render**: https://render.com (free tier available)
- **Heroku**: https://heroku.com (paid)
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform
- **VPS** (Ubuntu Server): AWS EC2, DigitalOcean Droplet, dll

---

## 📦 Build Scripts

### **Frontend Build:**
```bash
cd frontend
npm install
npm run build
# Output: frontend/dist/
```

### **Backend Start (Production):**
```bash
cd backend
npm install
npm start
# Runs on PORT from environment variable
```

---

## 🔐 Environment Variables

### **Frontend (.env):**
```env
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

### **Backend (.env):**
```env
PORT=4000
NODE_ENV=production
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
JWT_SECRET=your-secret-key-here
```

---

## ✅ Checklist Sebelum Deploy

- [ ] Build frontend berhasil (`npm run build`)
- [ ] Test backend di local (`npm start`)
- [ ] Environment variables sudah disiapkan
- [ ] CORS sudah dikonfigurasi untuk domain production
- [ ] Icon PWA sudah dibuat (192x192 dan 512x512)
- [ ] Firebase credentials sudah benar
- [ ] Cloudinary credentials sudah benar

---

## 🐛 Troubleshooting

### **Frontend tidak bisa connect ke backend:**
- Cek `VITE_API_BASE_URL` di environment variables
- Cek CORS settings di backend
- Pastikan backend URL benar (dengan `/api` di akhir)

### **PWA tidak bisa diinstall:**
- Pastikan menggunakan HTTPS (Vercel/Netlify sudah HTTPS)
- Cek `manifest.webmanifest` path benar
- Cek icon files ada di `public/`

### **Build error:**
- Hapus `node_modules` dan `package-lock.json`
- Run `npm install` lagi
- Cek versi Node.js (recommended: Node 18+)

---

## 📞 Support

Jika ada masalah saat deployment, cek:
1. Console browser (F12)
2. Network tab untuk API calls
3. Backend logs di Railway dashboard
4. Frontend logs di Vercel dashboard

---

## 🎉 Setelah Deploy

1. **Test semua fitur:**
   - Login
   - CRUD siswa
   - CRUD buku
   - Peminjaman
   - Pengembalian
   - Transaksi
   - Account management

2. **Test PWA:**
   - Install di mobile
   - Install di desktop
   - Test offline mode

3. **Share URL:**
   - Frontend: `https://your-app.vercel.app`
   - Backend: `https://your-backend.railway.app/api`

---

**Selamat deploy! 🚀**

