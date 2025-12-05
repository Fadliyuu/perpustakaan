# 🖥️ Panduan Push ke GitHub dengan GitHub Desktop

## ✅ Keuntungan GitHub Desktop:
- ✅ Tidak perlu install Git command line
- ✅ Tidak perlu setup PATH
- ✅ GUI yang mudah digunakan
- ✅ Auto-handle Git untuk Anda

---

## 📥 Step 1: Install GitHub Desktop

1. **Download:** https://desktop.github.com/
2. **Install** dengan default settings
3. **Login** dengan akun GitHub Anda
   - Jika belum punya akun, daftar di: https://github.com/signup

---

## 📂 Step 2: Add Local Repository

1. **Buka GitHub Desktop**
2. **File** → **Add Local Repository**
3. **Browse** → Pilih folder:
   ```
   C:\Users\Faddd\OneDrive\Documents\web karin
   ```
4. Klik **"Add Repository"**

---

## 🔍 Step 3: Verifikasi File (PENTING!)

Setelah add repository, GitHub Desktop akan menampilkan semua file.

**PASTIKAN file berikut TIDAK muncul:**
- ❌ `.env` (di backend atau frontend)
- ❌ `backend/firebase-service-account.json`
- ❌ `node_modules/` (folder besar)

**File yang HARUS muncul:**
- ✅ `backend/env.txt` (template, AMAN)
- ✅ `frontend/env.txt` (template, AMAN)
- ✅ Semua file `.js`, `.jsx`, `.css`
- ✅ `README.md`
- ✅ `DEPLOY_CEPAT.md`
- ✅ dll

**Jika file sensitif muncul:**
- File `.gitignore` mungkin belum bekerja
- Cek file `.gitignore` sudah benar
- File sensitif akan otomatis di-ignore

---

## 📤 Step 4: Publish ke GitHub

1. Di GitHub Desktop, klik **"Publish repository"** (di pojok kanan atas)
2. **Name:** `perpustakaan-yp-tunaskarya`
   - Atau nama lain yang Anda inginkan
3. **Description:** "Sistem Perpustakaan Digital SMK Swasta Tunas Karya"
4. ✅ **Keep this code private** (disarankan untuk project sekolah)
5. Klik **"Publish Repository"**

**Tunggu beberapa detik... Repository akan dibuat di GitHub!**

---

## 💾 Step 5: Commit & Push

### 5.1 Commit Pertama
1. Di GitHub Desktop, Anda akan melihat semua file di panel kiri
2. Di bawah, ada kotak **"Summary"**
3. Ketik: `Initial commit - Sistem Perpustakaan Digital`
4. Klik **"Commit to main"**

### 5.2 Push ke GitHub
1. Setelah commit, klik **"Push origin"** (di pojok kanan atas)
2. Tunggu upload selesai
3. ✅ **Selesai!**

---

## 🔄 Step 6: Update Repository (Jika Ada Perubahan)

Setelah push pertama, jika ada perubahan:

1. **GitHub Desktop akan otomatis detect perubahan**
2. Di panel kiri, file yang berubah akan muncul
3. **Summary:** Ketik deskripsi perubahan
   - Contoh: "Update: tambah fitur baru"
4. Klik **"Commit to main"**
5. Klik **"Push origin"**

---

## ✅ Verifikasi di GitHub

1. **Buka:** https://github.com/YOUR_USERNAME/perpustakaan-yp-tunaskarya
2. **Cek file sudah ter-upload**
3. **Pastikan file sensitif TIDAK ada:**
   - `.env` tidak ada ✅
   - `firebase-service-account.json` tidak ada ✅

---

## 🚀 Setelah Push ke GitHub

### Langkah Selanjutnya:

1. **Deploy Backend ke Railway:**
   - Buka: https://railway.app
   - New Project → Deploy from GitHub
   - Pilih repository: `perpustakaan-yp-tunaskarya`
   - Setup environment variables dari `RAILWAY_VARIABLES.txt`

2. **Deploy Frontend ke Vercel:**
   - Buka: https://vercel.com
   - Add New Project → Import GitHub repo
   - Pilih repository: `perpustakaan-yp-tunaskarya`
   - Root Directory: `frontend`
   - Setup environment variable dari `VERCEL_VARIABLES.txt`

---

## 🐛 Troubleshooting

### Problem: "Repository not found"
- Pastikan sudah login ke GitHub di GitHub Desktop
- Cek repository sudah dibuat di GitHub.com

### Problem: "Permission denied"
- Pastikan sudah login dengan akun GitHub yang benar
- Cek repository visibility (private/public)

### Problem: File sensitif muncul
- Cek file `.gitignore` sudah benar
- File yang sudah ter-commit perlu dihapus manual:
  - Di GitHub Desktop: Repository → Repository Settings → Ignored Files
  - Atau edit `.gitignore` dan commit ulang

---

## 📝 Tips

1. **Commit sering-sering** untuk backup code
2. **Gunakan commit message yang jelas**
3. **Push setelah commit** untuk sync ke GitHub
4. **Jangan commit file sensitif** (sudah di-ignore)

---

## ✅ Checklist

- [ ] GitHub Desktop sudah di-install
- [ ] Sudah login dengan GitHub
- [ ] Repository sudah di-add
- [ ] File sensitif TIDAK muncul
- [ ] Repository sudah di-publish
- [ ] File sudah di-commit
- [ ] File sudah di-push ke GitHub
- [ ] Verifikasi di GitHub.com

---

**Selamat! Repository Anda sudah di GitHub! 🎉**

**Lanjutkan ke deployment dengan membaca `DEPLOY_CEPAT.md`**

