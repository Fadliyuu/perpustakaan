import React, { useEffect, useState } from 'react';
import api from '../api.js';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalStudents: 0,
    activeLoans: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [booksRes, studentsRes, transactionsRes] = await Promise.all([
        api.get('/books').catch(() => ({ data: [] })),
        api.get('/students').catch(() => ({ data: [] })),
        api.get('/transactions').catch(() => ({ data: [] }))
      ]);

      const books = booksRes.data || [];
      const students = studentsRes.data || [];
      const transactions = transactionsRes.data || [];

      const activeLoans = transactions.filter((t) => t.status === 'ongoing').length;
      const overdue = transactions.filter((t) => {
        if (t.status !== 'ongoing' || !t.dueDate) return false;
        return new Date(t.dueDate) < new Date();
      }).length;

      setStats({
        totalBooks: books.length,
        totalStudents: students.length,
        activeLoans,
        overdueBooks: overdue
      });

      setRecentTransactions(transactions.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2 className="page-title">Dashboard</h2>
        <button type="button" className="btn-secondary btn-refresh" onClick={loadDashboardData}>
          <span>🔄</span> Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalBooks}</div>
            <div className="stat-label">Total Buku</div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalStudents}</div>
            <div className="stat-label">Total Siswa</div>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeLoans}</div>
            <div className="stat-label">Peminjaman Aktif</div>
          </div>
        </div>

        <div className="stat-card stat-danger">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.overdueBooks}</div>
            <div className="stat-label">Terlambat</div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3 className="section-title">Transaksi Terbaru</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Tanggal Pinjam</th>
                <th>Jatuh Tempo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t) => (
                <tr key={t.id}>
                  <td>{formatDate(t.borrowDate)}</td>
                  <td>{formatDate(t.dueDate)}</td>
                  <td>
                    <span className={`status-badge status-${t.status}`}>{t.status}</span>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                    <div className="empty-state">
                      <div className="empty-icon">📋</div>
                      <p>Belum ada transaksi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


