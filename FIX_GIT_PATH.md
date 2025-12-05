# 🔧 Fix Git PATH - Tambahkan ke Environment Variables

## ✅ Git sudah terinstall di: `C:\Program Files\Git\cmd`

Tapi belum ada di PATH, jadi perlu ditambahkan.

---

## 🚀 Cara Menambahkan Git ke PATH

### **Opsi 1: Via System Properties (Recommended)**

1. **Buka System Properties:**
   - Tekan `Win + R`
   - Ketik: `sysdm.cpl`
   - Enter

2. **Klik tab "Advanced"**

3. **Klik "Environment Variables"**

4. **Di bagian "System variables"**, cari **"Path"**
   - Klik untuk select
   - Klik **"Edit"**

5. **Klik "New"**

6. **Tambahkan:**
   ```
   C:\Program Files\Git\cmd
   ```

7. **Klik "OK" di semua window**

8. **Restart PowerShell/Terminal**

9. **Test:**
   ```powershell
   git --version
   ```

---

### **Opsi 2: Via PowerShell (Quick)**

Jalankan PowerShell sebagai **Administrator**, lalu:

```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Git\cmd", [EnvironmentVariableTarget]::Machine)
```

**Restart PowerShell** setelahnya.

---

## ✅ Setelah Git di PATH

Setelah Git ditambahkan ke PATH, Anda bisa pakai Git dari folder manapun!

---

## 🚀 Atau Langsung Push Sekarang (Tanpa Fix PATH)

Jika tidak ingin fix PATH sekarang, bisa pakai Git langsung dari folder Git:

```cmd
cd "C:\Program Files\Git\cmd"
git --version
```

Tapi lebih baik fix PATH dulu agar bisa pakai Git dari folder manapun.

---

**Setelah Git di PATH, lanjutkan push ke GitHub!**

