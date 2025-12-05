# 🔐 Panduan Deployment Aman

## ⚠️ PENTING: Keamanan File Sensitif

**JANGAN PERNAH commit file-file berikut ke Git:**
- ❌ `.env` (environment variables)
- ❌ `firebase-service-account.json` (Firebase credentials)
- ❌ File dengan password/API keys

File-file ini sudah ditambahkan ke `.gitignore` untuk keamanan.

---

## 🚀 Langkah Deployment Aman

### **Step 1: Setup Environment Variables di Local**

#### **Backend (.env)**

1. **Copy template:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` dan isi dengan credentials Anda:**
   ```env
   PORT=4000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   
   # Firebase (gunakan individual fields - lebih mudah)
   FIREBASE_PROJECT_ID=peminjaman-buku-223b6
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[PASTE_PRIVATE_KEY_DARI_firebase-service-account.json]\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@peminjaman-buku-223b6.iam.gserviceaccount.com
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # JWT Secret (buat random string kuat)
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   ```

3. **Ambil nilai dari `firebase-service-account.json`:**
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (paste seluruhnya termasuk `-----BEGIN PRIVATE KEY-----`)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

#### **Frontend (.env)**

1. **Buat file `.env` di folder `frontend`:**
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

---

### **Step 2: Verifikasi .gitignore**

Pastikan file `.gitignore` sudah ada dan berisi:
```
.env
firebase-service-account.json
node_modules/
dist/
```

**Cek apakah file sensitif sudah di-ignore:**
```bash
git status
# Pastikan .env dan firebase-service-account.json TIDAK muncul
```

---

### **Step 3: Deploy Backend ke Railway**

1. **Buka https://railway.app**
2. **Login dengan GitHub**
3. **New Project → Deploy from GitHub repo**
4. **Pilih repository Anda**
5. **Settings → Variables → Add semua environment variables:**

   ```
   PORT=4000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   
   FIREBASE_PROJECT_ID=peminjaman-buku-223b6
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[PASTE_PRIVATE_KEY]\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@peminjaman-buku-223b6.iam.gserviceaccount.com
   
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   ```

6. **Important:** 
   - Untuk `FIREBASE_PRIVATE_KEY`, paste seluruh private key termasuk `-----BEGIN PRIVATE KEY-----` dan `-----END PRIVATE KEY-----`
   - Pastikan ada `\n` untuk newlines (Railway akan handle ini)
   - Atau gunakan format JSON string jika lebih mudah

7. **Copy URL backend** dari Railway (contoh: `https://your-app.railway.app`)

---

### **Step 4: Deploy Frontend ke Vercel**

1. **Buka https://vercel.com**
2. **Login dengan GitHub**
3. **Add New Project → Import repository**
4. **Settings:**
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

6. **Deploy**
7. **Copy URL frontend** dari Vercel (contoh: `https://your-app.vercel.app`)

---

### **Step 5: Update CORS di Backend**

Kembali ke Railway → Settings → Variables:
- Update `FRONTEND_URL` dengan URL Vercel Anda
- Railway akan auto-restart

---

## 🔒 Keamanan Tambahan

### **1. JWT Secret**

**Gunakan random string yang kuat:**
```bash
# Generate random secret (minimal 32 karakter)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **2. Firebase Private Key**

**Format yang benar di Railway:**
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCsmA9iKiznPZIQ\n...\n-----END PRIVATE KEY-----\n"
```

**Atau gunakan JSON string (alternatif):**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

### **3. Cloudinary Credentials**

Dapatkan dari: https://cloudinary.com/console

---

## ✅ Checklist Sebelum Deploy

- [ ] `.env` sudah dibuat di local (tidak di-commit)
- [ ] `firebase-service-account.json` tidak di-commit (cek `.gitignore`)
- [ ] `git status` tidak menunjukkan file sensitif
- [ ] Backend environment variables sudah di-set di Railway
- [ ] Frontend environment variables sudah di-set di Vercel
- [ ] CORS sudah dikonfigurasi dengan URL production
- [ ] JWT_SECRET sudah diganti dengan random string
- [ ] Test build lokal berhasil (`npm run build`)

---

## 🧪 Test Setelah Deploy

1. **Test Frontend:**
   - Buka URL Vercel
   - Cek Console (F12) tidak ada error
   - Test login

2. **Test Backend:**
   - Buka `https://your-backend.railway.app/health`
   - Harus return `{"status":"ok"}`

3. **Test API Connection:**
   - Login di frontend
   - Cek Network tab (F12)
   - API calls harus ke URL Railway

---

## 🐛 Troubleshooting

### **Error: Firebase initialization failed**

**Solution:**
- Cek `FIREBASE_PRIVATE_KEY` format benar (dengan `\n` untuk newlines)
- Atau gunakan `FIREBASE_SERVICE_ACCOUNT` dengan JSON string
- Pastikan semua fields ada: PROJECT_ID, PRIVATE_KEY, CLIENT_EMAIL

### **Error: CORS**

**Solution:**
- Pastikan `FRONTEND_URL` di Railway sesuai dengan URL Vercel
- Format: `https://your-app.vercel.app` (tanpa trailing slash)
- Restart backend setelah update

### **Error: Environment variable not found**

**Solution:**
- Pastikan semua env vars sudah di-set di Railway/Vercel
- Cek spelling (case-sensitive)
- Restart setelah update env vars

---

## 📝 Catatan Penting

1. **JANGAN commit `.env` atau `firebase-service-account.json`**
2. **Gunakan environment variables di hosting platform**
3. **Update `CACHE_NAME` di `sw.js` setiap deploy baru**
4. **Test semua fitur setelah deploy**
5. **Monitor logs di Railway/Vercel untuk error**

---

**Selamat deploy! 🚀**

