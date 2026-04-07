import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import StudentsPage from './pages/StudentsPage.jsx';
import BooksPage from './pages/BooksPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import BorrowPage from './pages/BorrowPage.jsx';
import ReturnPage from './pages/ReturnPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import ScanQrPage from './pages/ScanQrPage.jsx';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Token exists, let it through
  // If token is invalid, API interceptor will handle 401 and redirect
  return children;
}

export default function App() {
  const deferredPromptRef = useRef(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const PROMPTED_KEY = 'pwa_install_prompted_v1';

    const isProbablyInstalled = () => {
      // Standalone mode (Android/Edge PWA)
      try {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
      } catch (_) {}

      // iOS/Safari may not support getInstalledRelatedApps, so just ignore errors.
      if ('getInstalledRelatedApps' in navigator) {
        return false;
      }

      return false;
    };

    if (isProbablyInstalled()) return;

    const onBeforeInstallPrompt = (e) => {
      // e is BeforeInstallPromptEvent
      e.preventDefault();
      deferredPromptRef.current = e;

      // Prompt hanya sekali per device/browser
      const alreadyPrompted = localStorage.getItem(PROMPTED_KEY);
      if (!alreadyPrompted) {
        setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    const deferredPrompt = deferredPromptRef.current;
    if (!deferredPrompt) return;

    try {
      deferredPromptRef.current = deferredPrompt;
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      // Jangan prompt lagi setelah user memilih.
      localStorage.setItem('pwa_install_prompted_v1', '1');
      setShowInstallPrompt(false);
      deferredPromptRef.current = null;

      // Catatan: outcome bisa 'accepted' atau 'dismissed'
      // Kita tidak melakukan apa-apa tambahan.
      void choice;
    } catch (_) {
      // Jika prompt gagal (mis. tidak installable lagi), tetap mark sebagai prompted biar tidak spam.
      localStorage.setItem('pwa_install_prompted_v1', '1');
      setShowInstallPrompt(false);
      deferredPromptRef.current = null;
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa_install_prompted_v1', '1');
    setShowInstallPrompt(false);
    deferredPromptRef.current = null;
  };

  return (
    <>
      {/* Install prompt (muncul 1x di kunjungan pertama yang installable) */}
      {showInstallPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={handleDismiss}
        >
          <div
            style={{
              width: 'min(520px, 92vw)',
              background: 'white',
              borderRadius: 16,
              padding: 18,
              border: '1px solid rgba(2, 6, 23, 0.08)',
              boxShadow: '0 20px 50px rgba(2, 6, 23, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>
              Install Aplikasi?
            </div>
            <div style={{ color: '#475569', fontSize: 14, lineHeight: 1.4, marginBottom: 14 }}>
              Tambahkan aplikasi ini ke layar utama untuk akses lebih cepat.
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDismiss}
                style={{ padding: '10px 14px' }}
              >
                Nanti
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleInstall}
                style={{ padding: '10px 14px' }}
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="students" element={<StudentsPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="scan" element={<ScanQrPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="borrow" element={<BorrowPage />} />
          <Route path="return" element={<ReturnPage />} />
          <Route path="accounts" element={<AccountsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}


