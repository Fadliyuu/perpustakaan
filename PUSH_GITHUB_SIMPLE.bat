@echo off
echo ========================================================================
echo                    PUSH KE GITHUB - SCRIPT OTOMATIS
echo ========================================================================
echo.

REM Setup Git Path
set GIT_CMD="C:\Program Files\Git\cmd\git.exe"

echo [1/8] Checking Git...
%GIT_CMD% --version
if errorlevel 1 (
    echo ERROR: Git tidak ditemukan!
    pause
    exit /b 1
)

echo.
echo [2/8] Setup Git Config (Pertama Kali Saja)...
echo Masukkan nama Anda:
set /p GIT_NAME="Nama: "
echo Masukkan email Anda:
set /p GIT_EMAIL="Email: "
%GIT_CMD% config --global user.name "%GIT_NAME%"
%GIT_CMD% config --global user.email "%GIT_EMAIL%"

echo.
echo [3/8] Initialize Git Repository...
cd /d "%~dp0"
%GIT_CMD% init

echo.
echo [4/8] Add semua file...
%GIT_CMD% add .

echo.
echo [5/8] Checking files yang akan di-commit...
%GIT_CMD% status
echo.
echo PASTIKAN file .env dan firebase-service-account.json TIDAK MUNCUL!
pause

echo.
echo [6/8] Commit...
%GIT_CMD% commit -m "Initial commit - Sistem Perpustakaan Digital SMK Swasta Tunas Karya"

echo.
echo [7/8] Setup Remote Repository...
echo Masukkan username GitHub Anda:
set /p GITHUB_USER="Username: "
echo Masukkan nama repository (default: perpustakaan-yp-tunaskarya):
set /p REPO_NAME="Repository name: "
if "%REPO_NAME%"=="" set REPO_NAME=perpustakaan-yp-tunaskarya

%GIT_CMD% remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git

echo.
echo [8/8] Push ke GitHub...
echo Pastikan repository sudah dibuat di GitHub.com dulu!
echo https://github.com/new
pause

%GIT_CMD% branch -M main
%GIT_CMD% push -u origin main

echo.
echo ========================================================================
echo                            SELESAI!
echo ========================================================================
echo Repository sudah di-push ke GitHub!
echo URL: https://github.com/%GITHUB_USER%/%REPO_NAME%
echo.
pause

