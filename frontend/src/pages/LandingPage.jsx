import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    booksToday: 0,
    activeStudents: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get today's date range
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      // Try to get data - handle 401 gracefully (no auth required for landing page)
      const [booksRes, studentsRes, transactionsRes] = await Promise.all([
        api.get('/books').catch((err) => {
          // If 401, return empty array (no auth)
          if (err.response?.status === 401) return { data: [] };
          throw err;
        }).catch(() => ({ data: [] })),
        api.get('/students').catch((err) => {
          if (err.response?.status === 401) return { data: [] };
          throw err;
        }).catch(() => ({ data: [] })),
        api.get('/transactions').catch((err) => {
          if (err.response?.status === 401) return { data: [] };
          throw err;
        }).catch(() => ({ data: [] }))
      ]);

      const books = booksRes?.data || [];
      const students = studentsRes?.data || [];
      const transactions = transactionsRes?.data || [];

      // Count books borrowed today
      const booksToday = transactions.filter((t) => {
        if (!t.borrowDate) return false;
        const borrowDate = new Date(t.borrowDate);
        return borrowDate >= today && borrowDate <= todayEnd;
      }).length;

      // Count active students (students with ongoing transactions)
      const activeStudentIds = new Set(
        transactions
          .filter((t) => t.status === 'ongoing')
          .map((t) => t.studentId)
          .filter(Boolean)
      );
      const activeStudents = activeStudentIds.size || (students.length > 0 ? students.length : 0);

      // Count overdue books
      const overdue = transactions.filter((t) => {
        if (t.status !== 'ongoing' || !t.dueDate) return false;
        return new Date(t.dueDate) < new Date();
      }).length;

      setStats({
        booksToday,
        activeStudents,
        overdueBooks: overdue
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
      // Keep default values (0) on error
      setStats({
        booksToday: 0,
        activeStudents: 0,
        overdueBooks: 0
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-root">
      <div className="landing-bg-orb orb-1" />
      <div className="landing-bg-orb orb-2" />
      <header className="landing-header">
        <div className="landing-logo">
          <img src="/Logo/logo.png" alt="Logo YP. Tunas Karya" className="landing-logo-img" />
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate('/login')}
        >
          Login Admin / Petugas
        </button>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero-text">
            <div className="landing-school-badge">
              <span className="badge-icon">🏆</span>
              <span>Akreditasi A</span>
            </div>
            <h1>
              Sistem Perpustakaan Digital
              <span> SMK Swasta Tunas Karya</span>
            </h1>
            <p className="landing-description">
              Sistem modern berbasis QR Code untuk mengelola peminjaman buku perpustakaan. 
              Scan QR, pilih siswa, cetak struk, dan pantau riwayat peminjaman langsung dari web &amp; Android.
            </p>
            <div className="landing-school-info">
              <div className="info-item">
                <span className="info-icon">📍</span>
                <span>Jl. Batang Kuis, Tanjung Sari, Batang Kuis, Deli Serdang, Sumatera Utara</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📞</span>
                <span>061-7949099</span>
              </div>
              <div className="info-item">
                <span className="info-icon">📧</span>
                <span>smktunaskarya1@gmail.com</span>
              </div>
            </div>
            <div className="landing-hero-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/login')}
              >
                Mulai Masuk
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/login')}
              >
                Lihat Dashboard
              </button>
            </div>
            <div className="landing-social-links">
              <a href="https://www.instagram.com/smk_tunaskaryabkuis?igsh=NjByNzRpZGhqZGI0" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>📷</span> Instagram
              </a>
              <a href="https://www.tiktok.com/@smks_tuskar_hebat?_r=1&_t=ZS-91y2IdHU0Lo" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>🎵</span> TikTok
              </a>
              <a href="https://www.facebook.com/share/1AAZYsNs1y/" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>👥</span> Facebook
              </a>
              <a href="http://www.yptunaskarya.id" target="_blank" rel="noopener noreferrer" className="social-link">
                <span>🌐</span> Website
              </a>
            </div>
          </div>
          <div className="landing-hero-card">
            <div className="landing-card-header">
              <span className="card-icon">📚</span>
              Tampilan Cepat Sistem
            </div>
            <div className="landing-card-body">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
                  <div className="login-btn-spinner" style={{ margin: '0 auto 10px', width: '24px', height: '24px' }} />
                  Memuat data...
                </div>
              ) : (
                <>
                  <div className="landing-metric-row">
                    <span>Buku dipinjam hari ini</span>
                    <strong>{stats.booksToday}</strong>
                  </div>
                  <div className="landing-metric-row">
                    <span>Siswa aktif</span>
                    <strong>{stats.activeStudents}</strong>
                  </div>
                  <div className="landing-metric-row">
                    <span>Buku terlambat</span>
                    <strong className="late">{stats.overdueBooks}</strong>
                  </div>
                </>
              )}
              <div className="landing-bar-chart">
                <div className="bar bar-1" />
                <div className="bar bar-2" />
                <div className="bar bar-3" />
                <div className="bar bar-4" />
              </div>
              <div className="landing-jurusan">
                <h4>Program Keahlian</h4>
                <div className="jurusan-list">
                  <span className="jurusan-badge">Otomatisasi & Tata Kelola Perkantoran</span>
                  <span className="jurusan-badge">Akuntansi & Keuangan Lembaga</span>
                  <span className="jurusan-badge">Perhotelan</span>
                  <span className="jurusan-badge">Tata Boga</span>
                </div>
              </div>
              <p className="landing-card-foot">
                Sistem perpustakaan digital yang dirancang untuk layanan cepat, rapi, dan modern.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-features">
          <div className="landing-feature">
            <div className="feature-icon">📱</div>
            <h3>Scan QR dari Android</h3>
            <p>
              Petugas cukup mengarahkan kamera ponsel ke QR code buku. Sistem otomatis mengenali
              kode dan menambahkannya ke transaksi peminjaman.
            </p>
          </div>
          <div className="landing-feature">
            <div className="feature-icon">🖨️</div>
            <h3>Struk Digital &amp; Cetak</h3>
            <p>
              Setiap peminjaman menghasilkan surat peminjaman yang bisa langsung ditandatangani
              siswa dan petugas, baik secara fisik maupun digital.
            </p>
          </div>
          <div className="landing-feature">
            <div className="feature-icon">🚀</div>
            <h3>Siap Dikembangkan</h3>
            <p>
              Arsitektur backend &amp; frontend terpisah, siap diintegrasikan dengan sistem sekolah
              lain, notifikasi, dan analitik lanjutan.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


