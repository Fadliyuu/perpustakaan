import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/Logo/logo.png" alt="Logo YP. Tunas Karya" className="sidebar-logo-icon" />
            <div>
              <div className="sidebar-logo-title">Perpustakaan</div>
              <div className="sidebar-logo-subtitle">YP. Tunas Karya</div>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/app" end className="nav-link">
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/app/students" className="nav-link">
            <span className="nav-icon">👥</span>
            <span>Data Siswa</span>
          </NavLink>
          <NavLink to="/app/books" className="nav-link">
            <span className="nav-icon">📖</span>
            <span>Data Buku</span>
          </NavLink>
          <NavLink to="/app/borrow" className="nav-link">
            <span className="nav-icon">📤</span>
            <span>Peminjaman</span>
          </NavLink>
          <NavLink to="/app/return" className="nav-link">
            <span className="nav-icon">📥</span>
            <span>Pengembalian</span>
          </NavLink>
          <NavLink to="/app/transactions" className="nav-link">
            <span className="nav-icon">📋</span>
            <span>Transaksi</span>
          </NavLink>
          <NavLink to="/app/accounts" className="nav-link">
            <span className="nav-icon">🧑‍💼</span>
            <span>Akun</span>
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="user-info">
              {user ? (
                <>
                  <div className="user-name">{user.username}</div>
                  <div className="user-role">{user.role}</div>
                </>
              ) : (
                <div className="user-name">Belum login</div>
              )}
            </div>
          </div>
          <button type="button" onClick={handleLogout} className="btn-logout">
            <span className="btn-logout-icon">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-logo">
            <img src="/Logo/logo.png" alt="Logo YP. Tunas Karya" className="mobile-logo-icon" />
            <div className="mobile-logo-text">
              <div className="mobile-logo-title">Perpustakaan</div>
              <div className="mobile-logo-subtitle">YP. Tunas Karya</div>
            </div>
          </div>
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <button type="button" onClick={handleLogout} className="mobile-logout-btn" title="Logout">
              🚪
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="bottom-nav">
        <div className="bottom-nav-scroll">
          <NavLink to="/app" end className="bottom-nav-link">
            <span className="bottom-nav-icon">📊</span>
            <span className="bottom-nav-label">Dashboard</span>
          </NavLink>
          <NavLink to="/app/students" className="bottom-nav-link">
            <span className="bottom-nav-icon">👥</span>
            <span className="bottom-nav-label">Siswa</span>
          </NavLink>
          <NavLink to="/app/books" className="bottom-nav-link">
            <span className="bottom-nav-icon">📖</span>
            <span className="bottom-nav-label">Buku</span>
          </NavLink>
          <NavLink to="/app/borrow" className="bottom-nav-link">
            <span className="bottom-nav-icon">📤</span>
            <span className="bottom-nav-label">Pinjam</span>
          </NavLink>
          <NavLink to="/app/return" className="bottom-nav-link">
            <span className="bottom-nav-icon">📥</span>
            <span className="bottom-nav-label">Kembali</span>
          </NavLink>
          <NavLink to="/app/transactions" className="bottom-nav-link">
            <span className="bottom-nav-icon">📋</span>
            <span className="bottom-nav-label">Transaksi</span>
          </NavLink>
          <NavLink to="/app/accounts" className="bottom-nav-link">
            <span className="bottom-nav-icon">🧑‍💼</span>
            <span className="bottom-nav-label">Akun</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}


