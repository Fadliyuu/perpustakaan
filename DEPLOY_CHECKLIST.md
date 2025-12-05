# ✅ Deployment Checklist

## 🔐 Pre-Deployment Security

- [ ] File `.gitignore` sudah dibuat dan berisi:
  - `.env`
  - `firebase-service-account.json`
  - `node_modules/`
  - `dist/`

- [ ] Verifikasi file sensitif tidak ter-commit:
  ```bash
  git status
  # Pastikan .env dan firebase-service-account.json TIDAK muncul
  ```

- [ ] File `.env` sudah dibuat di local (tidak di-commit)

---

## 🖥️ Backend Setup

- [ ] File `backend/.env` sudah dibuat dari `.env.example`
- [ ] Semua credentials sudah diisi:
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_PRIVATE_KEY` (dari firebase-service-account.json)
  - [ ] `FIREBASE_CLIENT_EMAIL`
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `JWT_SECRET` (random string minimal 32 karakter)
  - [ ] `FRONTEND_URL` (untuk CORS)

- [ ] Test backend lokal:
  ```bash
  cd backend
  npm install
  npm start
  # Test: http://localhost:4000/health
  ```

---

## 🌐 Frontend Setup

- [ ] File `frontend/.env` sudah dibuat:
  ```env
  VITE_API_BASE_URL=http://localhost:4000/api
  ```

- [ ] Test build lokal:
  ```bash
  cd frontend
  npm install
  npm run build
  npm run preview
  ```

- [ ] PWA icons sudah dibuat:
  - [ ] `icon-192.png`
  - [ ] `icon-512.png`
  - [ ] `favicon.png`

---

## 🚂 Railway (Backend) Deployment

- [ ] Account Railway sudah dibuat
- [ ] Project baru dibuat dari GitHub repo
- [ ] Root directory: `backend`
- [ ] Start command: `npm start`
- [ ] Environment variables sudah di-set:
  - [ ] `PORT=4000`
  - [ ] `NODE_ENV=production`
  - [ ] `FRONTEND_URL` (akan di-update setelah frontend deploy)
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_PRIVATE_KEY`
  - [ ] `FIREBASE_CLIENT_EMAIL`
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`
  - [ ] `JWT_SECRET`

- [ ] Backend URL sudah dicopy (contoh: `https://your-app.railway.app`)

---

## ⚡ Vercel (Frontend) Deployment

- [ ] Account Vercel sudah dibuat
- [ ] Project baru dibuat dari GitHub repo
- [ ] Root directory: `frontend`
- [ ] Framework: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable:
  - [ ] `VITE_API_BASE_URL=https://your-backend.railway.app/api`

- [ ] Frontend URL sudah dicopy (contoh: `https://your-app.vercel.app`)

---

## 🔄 Post-Deployment

- [ ] Update `FRONTEND_URL` di Railway dengan URL Vercel
- [ ] Update `CACHE_NAME` di `frontend/public/sw.js` (increment versi)
- [ ] Commit dan push perubahan:
  ```bash
  git add frontend/public/sw.js
  git commit -m "Update cache version for deployment"
  git push
  ```

- [ ] Test production:
  - [ ] Buka frontend URL
  - [ ] Test login
  - [ ] Test semua fitur:
    - [ ] Dashboard
    - [ ] Data Siswa (CRUD)
    - [ ] Data Buku (CRUD)
    - [ ] Peminjaman
    - [ ] Pengembalian
    - [ ] Transaksi
    - [ ] Account Management

- [ ] Test PWA:
  - [ ] Install di mobile/desktop
  - [ ] Test offline mode
  - [ ] Test update notification

---

## 🐛 Troubleshooting

- [ ] Cek Railway logs untuk backend errors
- [ ] Cek Vercel logs untuk frontend errors
- [ ] Cek browser Console (F12) untuk client errors
- [ ] Test API endpoint: `https://your-backend.railway.app/health`
- [ ] Verifikasi CORS settings
- [ ] Verifikasi environment variables

---

## 📋 Final Checklist

- [ ] Semua fitur bekerja di production
- [ ] PWA bisa diinstall
- [ ] Tidak ada error di Console
- [ ] API calls berhasil
- [ ] Cache management bekerja
- [ ] Security: file sensitif tidak ter-commit
- [ ] Documentation sudah lengkap

---

**Deployment selesai! 🎉**

