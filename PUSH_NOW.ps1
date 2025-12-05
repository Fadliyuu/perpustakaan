# Script untuk Push ke GitHub
# Jalankan di PowerShell di folder project

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "                    PUSH KE GITHUB" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

# Setup Git Path
$git = "C:\Program Files\Git\cmd\git.exe"

# 1. Setup Git Config (Pertama Kali Saja)
Write-Host "[1/8] Setup Git Config..." -ForegroundColor Yellow
$name = Read-Host "Masukkan nama Anda"
$email = Read-Host "Masukkan email Anda"
& $git config --global user.name "$name"
& $git config --global user.email "$email"

# 2. Initialize Repository
Write-Host ""
Write-Host "[2/8] Initialize Git Repository..." -ForegroundColor Yellow
& $git init

# 3. Add Semua File
Write-Host ""
Write-Host "[3/8] Add semua file..." -ForegroundColor Yellow
& $git add .

# 4. Cek Status
Write-Host ""
Write-Host "[4/8] Checking files..." -ForegroundColor Yellow
& $git status
Write-Host ""
Write-Host "PASTIKAN file .env dan firebase-service-account.json TIDAK MUNCUL!" -ForegroundColor Red
Read-Host "Tekan Enter untuk lanjut"

# 5. Commit
Write-Host ""
Write-Host "[5/8] Commit..." -ForegroundColor Yellow
& $git commit -m "Initial commit - Sistem Perpustakaan Digital SMK Swasta Tunas Karya"

# 6. Setup Remote
Write-Host ""
Write-Host "[6/8] Setup Remote Repository..." -ForegroundColor Yellow
Write-Host "Pastikan repository sudah dibuat di GitHub.com dulu!" -ForegroundColor Green
Write-Host "Buka: https://github.com/new" -ForegroundColor Green
Write-Host ""
$username = Read-Host "Masukkan username GitHub Anda"
$repoName = Read-Host "Masukkan nama repository (default: perpustakaan-yp-tunaskarya)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "perpustakaan-yp-tunaskarya"
}

& $git remote add origin "https://github.com/$username/$repoName.git"

# 7. Push
Write-Host ""
Write-Host "[7/8] Push ke GitHub..." -ForegroundColor Yellow
Write-Host "Jika diminta login:" -ForegroundColor Green
Write-Host "  Username: username GitHub Anda" -ForegroundColor Green
Write-Host "  Password: Personal Access Token (bukan password!)" -ForegroundColor Green
Write-Host "  Buat token di: https://github.com/settings/tokens" -ForegroundColor Green
Write-Host ""
Read-Host "Tekan Enter untuk push"

& $git branch -M main
& $git push -u origin main

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Green
Write-Host "                            SELESAI!" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Green
Write-Host "Repository sudah di-push ke GitHub!" -ForegroundColor Green
Write-Host "URL: https://github.com/$username/$repoName" -ForegroundColor Cyan
Write-Host ""

