# 📤 Panduan Push ke GitHub

## 🎯 Opsi 1: Menggunakan GitHub Desktop (Paling Mudah)

### Step 1: Install GitHub Desktop
1. Download: **https://desktop.github.com/**
2. Install dan login dengan akun GitHub Anda

### Step 2: Add Repository
1. Buka GitHub Desktop
2. **File** → **Add Local Repository**
3. Pilih folder: `C:\Users\Faddd\OneDrive\Documents\web karin`
4. Klik **"Add Repository"**

### Step 3: Publish ke GitHub
1. Di GitHub Desktop, klik **"Publish repository"**
2. **Name**: `perpustakaan-yp-tunaskarya` (atau nama lain)
3. **Description**: "Sistem Perpustakaan Digital SMK Swasta Tunas Karya"
4. ✅ **Keep this code private** (disarankan untuk project sekolah)
5. Klik **"Publish Repository"**

### Step 4: Commit & Push
1. Di GitHub Desktop, Anda akan melihat semua file yang berubah
2. **Summary**: Ketik pesan commit, contoh: "Initial commit - Perpustakaan System"
3. Klik **"Commit to main"**
4. Klik **"Push origin"** untuk upload ke GitHub

---

## 🎯 Opsi 2: Menggunakan Command Line (Git)

### Step 1: Install Git
1. Download: **https://git-scm.com/download/win**
2. Install dengan default settings
3. Restart terminal/PowerShell

### Step 2: Setup Git (Pertama Kali)
```bash
git config --global user.name "Nama Anda"
git config --global user.email "email@example.com"
```

### Step 3: Initialize Repository
```bash
cd "C:\Users\Faddd\OneDrive\Documents\web karin"
git init
```

### Step 4: Add Files
```bash
# Add semua file (kecuali yang di .gitignore)
git add .

# Cek file yang akan di-commit (pastikan .env TIDAK ada)
git status
```

### Step 5: Commit
```bash
git commit -m "Initial commit - Sistem Perpustakaan Digital SMK Swasta Tunas Karya"
```

### Step 6: Buat Repository di GitHub
1. Buka: **https://github.com/new**
2. **Repository name**: `perpustakaan-yp-tunaskarya`
3. **Description**: "Sistem Perpustakaan Digital SMK Swasta Tunas Karya"
4. ✅ **Private** (disarankan)
5. ❌ **JANGAN** centang "Initialize with README"
6. Klik **"Create repository"**

### Step 7: Push ke GitHub
```bash
# Add remote (ganti YOUR_USERNAME dengan username GitHub Anda)
git remote add origin https://github.com/YOUR_USERNAME/perpustakaan-yp-tunaskarya.git

# Push ke GitHub
git branch -M main
git push -u origin main
```

---

## ✅ Verifikasi File Sensitif TIDAK Ter-Commit

### Cek dengan GitHub Desktop:
- Di GitHub Desktop, lihat file yang akan di-commit
- **PASTIKAN** file berikut TIDAK muncul:
  - ❌ `.env`
  - ❌ `backend/firebase-service-account.json`
  - ❌ `node_modules/`

### Cek dengan Command Line:
```bash
git status
# Pastikan .env dan firebase-service-account.json TIDAK muncul
```

---

## 📋 Checklist Sebelum Push

- [ ] File `.gitignore` sudah ada dan benar
- [ ] File `.env` TIDAK muncul di git status
- [ ] File `firebase-service-account.json` TIDAK muncul di git status
- [ ] File `node_modules/` TIDAK muncul di git status
- [ ] Semua file penting sudah ada:
  - [ ] `backend/env.txt` (template, AMAN)
  - [ ] `frontend/env.txt` (template, AMAN)
  - [ ] `DEPLOY_CEPAT.md`
  - [ ] `RAILWAY_VARIABLES.txt`
  - [ ] `VERCEL_VARIABLES.txt`

---

## 🚀 Setelah Push ke GitHub

### Langkah Selanjutnya:
1. **Deploy Backend ke Railway:**
   - Buka Railway → Deploy from GitHub
   - Pilih repository yang baru di-push

2. **Deploy Frontend ke Vercel:**
   - Buka Vercel → Import GitHub repo
   - Pilih repository yang baru di-push

3. **Setup Environment Variables:**
   - Copy dari `RAILWAY_VARIABLES.txt` ke Railway
   - Copy dari `VERCEL_VARIABLES.txt` ke Vercel

---

## 🐛 Troubleshooting

### Error: "Repository not found"
- Pastikan repository sudah dibuat di GitHub
- Pastikan URL remote benar
- Pastikan sudah login ke GitHub

### Error: "Permission denied"
- Pastikan sudah login ke GitHub
- Cek credentials GitHub Anda

### File sensitif ter-commit?
- **JANGAN PANIK!**
- Hapus file dari git:
  ```bash
  git rm --cached backend/firebase-service-account.json
  git rm --cached backend/.env
  git commit -m "Remove sensitive files"
  git push
  ```
- **PENTING:** Rotate credentials yang sudah ter-expose!

---

## 📝 Catatan Penting

1. **File yang AMAN di-commit:**
   - ✅ `backend/env.txt` (template)
   - ✅ `frontend/env.txt` (template)
   - ✅ Semua file `.txt` (template)
   - ✅ Semua file code (`.js`, `.jsx`, `.css`, dll)

2. **File yang TIDAK BOLEH di-commit:**
   - ❌ `.env` (real credentials)
   - ❌ `firebase-service-account.json` (real credentials)
   - ❌ `node_modules/`

3. **Setelah push:**
   - Repository akan terlihat di GitHub
   - Bisa langsung deploy ke Railway/Vercel
   - Environment variables tetap di-set di hosting platform

---

**Selamat push! 🚀**

