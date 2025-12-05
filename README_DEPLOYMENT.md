# 🚀 Quick Start Deployment Guide

## 📋 Langkah-Langkah Deployment

### **1. Persiapan**

Pastikan semua file sudah commit ke GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### **2. Deploy Backend (Railway)**

1. Buka https://railway.app
2. Login dengan GitHub
3. Klik "New Project" → "Deploy from GitHub repo"
4. Pilih repository Anda
5. Di Settings → Variables, tambahkan:
   ```
   PORT=4000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   FIREBASE_PROJECT_ID=...
   FIREBASE_PRIVATE_KEY=...
   FIREBASE_CLIENT_EMAIL=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   JWT_SECRET=...
   ```
6. Railway akan auto-deploy
7. Copy URL backend (contoh: `https://your-app.railway.app`)

### **3. Deploy Frontend (Vercel)**

1. Buka https://vercel.com
2. Login dengan GitHub
3. Klik "Add New Project"
4. Import repository Anda
5. Settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```
7. Klik "Deploy"
8. Copy URL frontend (contoh: `https://your-app.vercel.app`)

### **4. Update CORS Backend**

Kembali ke Railway → Settings → Variables:
- Update `FRONTEND_URL` dengan URL Vercel Anda
- Railway akan auto-restart

### **5. Test**

1. Buka URL frontend di browser
2. Test login
3. Test semua fitur
4. Test PWA install (di mobile/desktop)

---

## 📱 Setup PWA Icons

Buat icon 192x192 dan 512x512, simpan di:
- `frontend/public/icon-192.png`
- `frontend/public/icon-512.png`

Bisa pakai logo sekolah atau generate di:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

---

## ✅ Checklist

- [ ] Backend deployed di Railway
- [ ] Frontend deployed di Vercel
- [ ] Environment variables sudah di-set
- [ ] CORS sudah dikonfigurasi
- [ ] PWA icons sudah dibuat
- [ ] Test semua fitur berhasil
- [ ] PWA bisa diinstall

---

**Selamat! Aplikasi Anda sudah online! 🎉**

