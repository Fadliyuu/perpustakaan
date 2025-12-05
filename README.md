# 📚 Sistem Perpustakaan Digital - SMK Swasta Tunas Karya

Sistem manajemen perpustakaan berbasis web dengan fitur QR Code untuk peminjaman dan pengembalian buku.

## 🚀 Fitur

- ✅ Manajemen Data Siswa (CRUD)
- ✅ Manajemen Data Buku (CRUD)
- ✅ Peminjaman Buku dengan QR Code
- ✅ Pengembalian Buku dengan QR Code Scanner
- ✅ Cetak Struk Peminjaman & Pengembalian
- ✅ Manajemen Akun (Admin, Petugas, Magang)
- ✅ Dashboard dengan Statistik Real-time
- ✅ PWA Support (Bisa diinstall di mobile/desktop)
- ✅ Responsive Design (Desktop & Mobile)

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Axios
- HTML5 QR Code Scanner

### Backend
- Node.js
- Express.js
- Firebase Firestore
- Cloudinary (untuk QR Code)
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm atau yarn
- Firebase Project
- Cloudinary Account (optional)

### Setup

1. **Clone repository:**
```bash
git clone https://github.com/YOUR_USERNAME/perpustakaan-yp-tunaskarya.git
cd perpustakaan-yp-tunaskarya
```

2. **Backend Setup:**
```bash
cd backend
npm install
# Copy env-local.txt menjadi .env dan isi credentials
cp env-local.txt .env
# Edit .env dengan credentials Anda
npm start
```

3. **Frontend Setup:**
```bash
cd frontend
npm install
# Copy env.txt menjadi .env
cp env.txt .env
# Edit .env dengan API URL
npm run dev
```

## 🚀 Deployment

### Quick Deploy
Baca file: `DEPLOY_CEPAT.md`

### Detailed Guide
Baca file: `DEPLOYMENT_GUIDE.md` dan `SECURE_DEPLOYMENT.md`

### Environment Variables
- Backend: Lihat `backend/env.txt`
- Frontend: Lihat `frontend/env-production.txt`

## 📖 Documentation

- `DEPLOY_CEPAT.md` - Quick deploy guide
- `DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- `SECURE_DEPLOYMENT.md` - Secure deployment guide
- `DEPLOY_CHECKLIST.md` - Deployment checklist
- `CACHE_MANAGEMENT.md` - Cache management guide
- `ENV_SETUP_GUIDE.txt` - Environment variables setup

## 🔐 Security

- ✅ File sensitif sudah di-ignore (.gitignore)
- ✅ Environment variables untuk production
- ✅ JWT authentication
- ✅ CORS protection
- ✅ Service Worker untuk PWA

## 📱 PWA Support

Aplikasi bisa diinstall sebagai PWA di:
- ✅ Mobile (Android/iOS)
- ✅ Desktop (Chrome/Edge)

## 👥 Roles

- **Admin**: Full access
- **Petugas**: Bisa manage peminjaman
- **Magang**: Limited access

## 📝 License

Private - SMK Swasta Tunas Karya

## 👨‍💻 Developer

Dikembangkan untuk SMK Swasta Tunas Karya, Batang Kuis, Deli Serdang, Sumatera Utara.

---

**Selamat menggunakan! 🎉**

"# perpustakaan" 
"# perpus-tunas-karya" 
