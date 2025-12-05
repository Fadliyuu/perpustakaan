# 🔧 Troubleshooting Git Installation

## ❌ Problem: Git tidak bisa digunakan setelah install

### ✅ Solusi 1: Restart Terminal/PowerShell (Paling Sering)

1. **Tutup semua terminal/PowerShell yang terbuka**
2. **Buka PowerShell baru** (bukan yang lama)
3. **Test:**
   ```powershell
   git --version
   ```
4. Jika muncul versi Git, berarti sudah OK!

---

### ✅ Solusi 2: Cek PATH Environment Variable

1. **Buka System Properties:**
   - Tekan `Win + R`
   - Ketik: `sysdm.cpl`
   - Enter

2. **Advanced** tab → **Environment Variables**

3. **Di "System variables"**, cari **Path** → **Edit**

4. **Cek apakah ada:**
   - `C:\Program Files\Git\cmd`
   - `C:\Program Files (x86)\Git\cmd`

5. **Jika tidak ada, tambahkan:**
   - Klik **New**
   - Tambahkan: `C:\Program Files\Git\cmd`
   - Klik **OK** di semua window

6. **Restart PowerShell** dan test lagi

---

### ✅ Solusi 3: Reinstall Git dengan PATH Option

1. **Download Git lagi:** https://git-scm.com/download/win
2. **Install dengan opsi:**
   - ✅ **"Git from the command line and also from 3rd-party software"**
   - ✅ **"Use bundled OpenSSH"**
   - ✅ **"Use the OpenSSL library"**
   - ✅ **"Checkout Windows-style, commit Unix-style line endings"**
   - ✅ **"Use MinTTY"**
   - ✅ **"Enable file system caching"**

3. **Setelah install, restart komputer** (disarankan)

---

### ✅ Solusi 4: Gunakan GitHub Desktop (Paling Mudah!)

**Jika Git masih tidak jalan, gunakan GitHub Desktop:**

1. **Download:** https://desktop.github.com/
2. **Install GitHub Desktop**
3. **Login dengan GitHub**
4. **File → Add Local Repository**
5. **Pilih folder project**
6. **Publish Repository** → Done!

**GitHub Desktop akan handle Git untuk Anda!**

---

## 🧪 Test Git Installation

Setelah install/restart, test dengan:

```powershell
# Test Git
git --version

# Jika muncul versi, berarti OK!
# Contoh output: git version 2.42.0.windows.1
```

---

## 🚀 Alternatif: Langsung Pakai GitHub Desktop

**Tidak perlu Git command line!**

### Step-by-Step dengan GitHub Desktop:

1. **Install GitHub Desktop:**
   - Download: https://desktop.github.com/
   - Install dan login

2. **Add Repository:**
   - File → Add Local Repository
   - Browse → Pilih: `C:\Users\Faddd\OneDrive\Documents\web karin`
   - Add Repository

3. **Publish ke GitHub:**
   - Klik "Publish repository"
   - Name: `perpustakaan-yp-tunaskarya`
   - ✅ Keep this code private
   - Publish

4. **Commit & Push:**
   - Di bawah, ketik summary: "Initial commit"
   - Klik "Commit to main"
   - Klik "Push origin"

**Selesai! Tidak perlu command line!**

---

## 📋 Checklist

- [ ] Git sudah di-install
- [ ] PowerShell/Terminal sudah di-restart
- [ ] PATH sudah benar (jika pakai command line)
- [ ] Atau pakai GitHub Desktop (lebih mudah)

---

## 🎯 Rekomendasi

**Pakai GitHub Desktop!** Lebih mudah dan tidak perlu setup PATH.

Setelah push ke GitHub dengan GitHub Desktop, langsung bisa deploy ke Railway/Vercel!

---

**Jika masih error, screenshot error message dan saya bantu troubleshoot lebih lanjut!**

