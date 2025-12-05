# ⚡ DEPLOY CEPAT - Step by Step

## 🎯 Tujuan: Deploy Backend ke Railway & Frontend ke Vercel

---

## 📋 STEP 1: Persiapan (5 menit)

### ✅ Checklist:
- [ ] GitHub repository sudah ada
- [ ] File `backend/env.txt` sudah ada (untuk Railway)
- [ ] File `frontend/env-production.txt` sudah ada (untuk Vercel)
- [ ] Cloudinary credentials sudah siap (jika belum, bisa skip dulu)

---

## 🚂 STEP 2: Deploy Backend ke Railway (10 menit)

### 2.1 Buka Railway
1. Buka: **https://railway.app**
2. Klik **"Login"** → Login dengan **GitHub**
3. Klik **"New Project"**
4. Pilih **"Deploy from GitHub repo"**
5. Pilih repository Anda
6. Klik **"Deploy Now"**

### 2.2 Setup Environment Variables
1. Setelah deploy mulai, klik **"Variables"** tab
2. Klik **"New Variable"**
3. Copy-paste dari file `backend/env.txt` satu per satu:

**Variable 1:**
```
Name: PORT
Value: 4000
```

**Variable 2:**
```
Name: NODE_ENV
Value: production
```

**Variable 3:**
```
Name: FRONTEND_URL
Value: https://your-frontend.vercel.app
```
*(Update ini nanti setelah frontend deploy)*

**Variable 4:**
```
Name: FIREBASE_PROJECT_ID
Value: peminjaman-buku-223b6
```

**Variable 5:**
```
Name: FIREBASE_PRIVATE_KEY
Value: -----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsmA9iKiznPZIQ
i6e/FVZ5LsJfKHiOUIZJZ/8US8BBHkL4HM3UPpC5J/oe3rxOb9+xwxOMle5cI+Lm
2ww2oWVOIc4oIwF7YHfHA7LLkrejHoxoZv0QMfY7wIuLNzf0ZOGWd0YZKiS2zHEg
Qog+3vtIB5aItEccjSFgfVHTUVMlolJSLRezHNEoWXyYQpOYeeYdjdoKQIQ4sArh
kHKOxH6asLVdW6P3QAlAeQHGD6BVx7wIc1ErT3nFKWm9qcEZ4+m+Lk5owKOQOeJA
XAWJuWiwWx0Viz+MT7BjBVaw1DLp7egJp8nZVRaefXQV+yqmd+e9JaIYSNyjM4f9
aroM1RBTAgMBAAECggEAUsHs6mx/sHeI8K8ORaUVHDFMGTW+LLs20L7xhAlYi8DX
asHg/grr+SROnfu+PjwNfl6kIo6Hxx2cAIb7Abz85ux1vjAe10pn1IEU++EDdc9B
kxQC9v+F6pvGLYBSL7kppCzX61wWU6KPAeF1E/R2d9DPoQgUav/PB8W/dPyzSkES
5Uh1+3nxMin3DKg2KxymXuayKygPZ1AQpKWM+JitXdqQHovYd9lhuWYX6BDzMW/O
yEtadn57QG7oM8bxZoGeGijiwqHCLOOnrY3vy38R8RV6Hiu39NTJHwRJSHWncbED
lOj3p0HHHwHwfUPQXFGBcy9lQJmYj5TMHB41a27KPQKBgQDo3UAhpYtIDknX+cMs
NXll0ab6U/3y+n8Pr6P0JGpIOF3GB3Bi3nUbRXcpI/L9S5ZYl+RL5zhv5XO4pNnq
XdrtSRnECGZk5/DpdvdQ/AWx8+3YrieOBePCuwL8G3rKTUrUbPw9yWRVanZ+jJOl
3WlMgSegY4s2L+ZADX/WDWPJRwKBgQC9vd/tu1rC1t4MpzREFMjjn1VzMH4Ssz2a
x4M0CmnvfSOGyVfTp7Ec23gwJmAtbwOdkG9TEP7bk/Q8Sm9mI0/1Kfk899UoI6MF
1fAlcLSihwG6QQ+58bBUthQ3eVicbt2+3ELopDYo7i/JDyfGek5LKjF/R8pm+bVO
ahJllUzGlQKBgAkJJMbpdIkcPNNLlr4taQOBahhGkBEQlUOXjiYYD6OzxDe97Cd5
+FNRk7kd8vzPJQtVAX/Mfg0heycMBoSolaklcAGCTe7WbSux+RDEZrgr/eutfk1t
fxP8S7Zanp4g96lcfUEsgl8qHWT1sXj7KW3ViSMZGbrFiwqrO22j4V5bAoGANMDO
un0Fnfg5YlE2kdspg0ewbUdFNhPJg/gGfXiLvX8QWpAuL/WGo5xNTS3OPbOI0Mzw
dqraANig5gZX9JDK0UHrPs004WUPFTdG/lHYlvtsOomOQsd0nAjHlCjTvyJ/2mnI
3H+TY0vd00u4ZlFo5TME8ftWxcyVYQjStpWM9AUCgYEAsao9HVQhdj+uo7+kKSm3
DEr2xIxis1Pu67+DCn986w8yZAlACFCK6T6hX9E8lbDtaJfmECBa8Z30FXkBlngx
N9JbAY39TL3zPlJZwcPbIHWQ/otW6E7b3HibuQ9LQ0oLJd9MfiBy4TeiCrnWWMzK
Zh8JPM5L9RLXg7YErCnMCsc=
-----END PRIVATE KEY-----
```
*(Copy seluruhnya dari file backend/env.txt)*

**Variable 6:**
```
Name: FIREBASE_CLIENT_EMAIL
Value: firebase-adminsdk-fbsvc@peminjaman-buku-223b6.iam.gserviceaccount.com
```

**Variable 7-9: Cloudinary** (jika sudah punya):
```
Name: CLOUDINARY_CLOUD_NAME
Value: your-cloud-name

Name: CLOUDINARY_API_KEY
Value: your-api-key

Name: CLOUDINARY_API_SECRET
Value: your-api-secret
```
*(Jika belum punya, bisa skip dulu atau pakai dummy values)*

**Variable 10:**
```
Name: JWT_SECRET
Value: change-this-to-random-secret-min-32-chars-12345678901234567890
```
*(Ganti dengan random string yang kuat!)*

### 2.3 Setup Project Settings
1. Klik **"Settings"** tab
2. **Root Directory**: `backend`
3. **Start Command**: `npm start`
4. Railway akan auto-detect, tapi pastikan benar

### 2.4 Copy Backend URL
1. Setelah deploy selesai, klik **"Settings"** → **"Domains"**
2. Copy URL yang diberikan (contoh: `https://your-app.railway.app`)
3. **SIMPAN URL INI** untuk step berikutnya!

### 2.5 Test Backend
1. Buka URL backend di browser: `https://your-backend.railway.app/health`
2. Harus muncul: `{"status":"ok","time":"..."}`
3. ✅ Backend siap!

---

## ⚡ STEP 3: Deploy Frontend ke Vercel (10 menit)

### 3.1 Buka Vercel
1. Buka: **https://vercel.com**
2. Klik **"Login"** → Login dengan **GitHub**
3. Klik **"Add New Project"**
4. Pilih repository Anda
5. Klik **"Import"**

### 3.2 Setup Project
1. **Project Name**: (biarkan default atau ganti)
2. **Root Directory**: Klik **"Edit"** → ketik: `frontend`
3. **Framework Preset**: Vite (auto-detect)
4. **Build Command**: `npm run build` (auto-detect)
5. **Output Directory**: `dist` (auto-detect)
6. **Install Command**: `npm install` (auto-detect)

### 3.3 Setup Environment Variables
1. Scroll ke **"Environment Variables"**
2. Klik **"Add"**
3. **Name**: `VITE_API_BASE_URL`
4. **Value**: `https://your-backend.railway.app/api`
   *(Ganti dengan URL Railway yang Anda copy di Step 2.4)*
5. Klik **"Save"**

### 3.4 Deploy
1. Klik **"Deploy"**
2. Tunggu build selesai (2-5 menit)
3. Setelah selesai, Vercel akan memberikan URL

### 3.5 Copy Frontend URL
1. Setelah deploy selesai, copy URL yang diberikan
2. Contoh: `https://your-app.vercel.app`
3. **SIMPAN URL INI**!

---

## 🔄 STEP 4: Update CORS (2 menit)

### 4.1 Update FRONTEND_URL di Railway
1. Kembali ke **Railway**
2. Klik project Anda
3. **Variables** tab
4. Cari variable `FRONTEND_URL`
5. Klik **"Edit"**
6. Ganti value dengan URL Vercel Anda: `https://your-frontend.vercel.app`
7. Klik **"Save"**
8. Railway akan auto-restart

---

## ✅ STEP 5: Test (5 menit)

### 5.1 Test Frontend
1. Buka URL Vercel di browser
2. Cek Console (F12) - tidak ada error
3. Test login
4. Test semua fitur

### 5.2 Test Backend
1. Buka: `https://your-backend.railway.app/health`
2. Harus return: `{"status":"ok"}`

### 5.3 Test API Connection
1. Login di frontend
2. Buka DevTools → Network tab
3. Cek API calls harus ke URL Railway
4. Tidak ada CORS error

---

## 🎉 SELESAI!

Aplikasi Anda sudah online di:
- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-backend.railway.app`

---

## 🐛 Troubleshooting Cepat

### Backend tidak jalan?
- Cek Railway logs
- Pastikan semua environment variables sudah di-set
- Pastikan `FIREBASE_PRIVATE_KEY` format benar (dengan newlines)

### Frontend tidak connect ke backend?
- Cek `VITE_API_BASE_URL` di Vercel sudah benar
- Cek CORS di Railway sudah di-update dengan URL Vercel
- Cek Console browser untuk error

### CORS Error?
- Pastikan `FRONTEND_URL` di Railway sesuai dengan URL Vercel
- Pastikan tidak ada trailing slash di URL
- Restart backend setelah update CORS

---

## 📝 Catatan Penting

1. **JWT_SECRET**: Ganti dengan random string yang kuat!
2. **Cloudinary**: Jika belum punya, bisa skip dulu atau daftar di cloudinary.com
3. **URL Update**: Setelah frontend deploy, update `FRONTEND_URL` di Railway
4. **Cache**: Update `CACHE_NAME` di `frontend/public/sw.js` setiap deploy baru

---

**Total waktu: ~30 menit** ⚡

**Selamat deploy! 🚀**

