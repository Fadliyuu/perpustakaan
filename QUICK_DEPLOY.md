# 🚀 Quick Deploy Guide

## ⚡ Langkah Cepat Deployment

### **1. Setup Local Environment**

#### Backend:
```bash
cd backend
# Copy template (jika belum ada)
copy .env.example .env
# Edit .env dan isi dengan credentials Anda
```

#### Frontend:
```bash
cd frontend
# Buat file .env
echo VITE_API_BASE_URL=http://localhost:4000/api > .env
```

---

### **2. Verifikasi Keamanan**

```bash
# Cek apakah file sensitif tidak ter-commit
git status

# Pastikan file berikut TIDAK muncul:
# - .env
# - firebase-service-account.json
```

Jika muncul, **JANGAN commit!** File sudah di-ignore oleh `.gitignore`.

---

### **3. Deploy Backend ke Railway**

1. Buka https://railway.app → Login → New Project
2. Deploy from GitHub → Pilih repo Anda
3. Settings → Variables → Add:

```
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app

FIREBASE_PROJECT_ID=peminjaman-buku-223b6
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[PASTE_DARI_firebase-service-account.json]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@peminjaman-buku-223b6.iam.gserviceaccount.com

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

JWT_SECRET=[GENERATE_RANDOM_STRING_MIN_32_CHARS]
```

4. Copy backend URL: `https://your-app.railway.app`

---

### **4. Deploy Frontend ke Vercel**

1. Buka https://vercel.com → Login → Add New Project
2. Import GitHub repo
3. Settings:
   - Root: `frontend`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
4. Environment Variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```
5. Deploy → Copy frontend URL: `https://your-app.vercel.app`

---

### **5. Update CORS**

Kembali ke Railway → Variables → Update:
```
FRONTEND_URL=https://your-frontend.vercel.app
```

---

### **6. Test**

- Frontend: https://your-app.vercel.app
- Backend Health: https://your-backend.railway.app/health
- Test login dan semua fitur

---

## 🔐 Mengambil Firebase Credentials

Dari file `backend/firebase-service-account.json`:

1. **FIREBASE_PROJECT_ID**: Copy nilai `project_id`
2. **FIREBASE_PRIVATE_KEY**: Copy seluruh `private_key` (termasuk `-----BEGIN PRIVATE KEY-----`)
3. **FIREBASE_CLIENT_EMAIL**: Copy nilai `client_email`

---

## ✅ Done!

Aplikasi sudah online! 🎉

Baca `SECURE_DEPLOYMENT.md` untuk detail lengkap.

