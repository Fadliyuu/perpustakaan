import React, { useEffect, useState, useRef } from 'react';
import api from '../api.js';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [showReduceStockModal, setShowReduceStockModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    year: '',
    publisher: '',
    totalCopies: 1,
    location: ''
  });
  const [editFormData, setEditFormData] = useState({
    title: '',
    author: '',
    category: '',
    year: '',
    publisher: '',
    location: ''
  });
  const [addStockData, setAddStockData] = useState({ quantity: 1, entryDate: '', location: '' });
  const [reduceStockData, setReduceStockData] = useState({ quantity: 1, reason: '', notes: '' });
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/books');
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage('Gagal memuat data buku');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/books', formData);
      setMessage('✅ Buku berhasil ditambahkan. QR code otomatis dibuat untuk buku ini.');
      setShowForm(false);
      setFormData({ title: '', author: '', category: '', year: '', publisher: '', totalCopies: 1, location: '' });
      loadBooks();
    } catch (err) {
      setMessage('❌ Gagal menambahkan buku');
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/books/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `data-buku-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('✅ Data berhasil diekspor');
    } catch (err) {
      setMessage('❌ Gagal mengekspor data');
      console.error(err);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/books/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(`✅ Import selesai: ${res.data.success} berhasil, ${res.data.errors} error`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadBooks();
    } catch (err) {
      setMessage('❌ Gagal mengimpor data');
      console.error(err);
    }
  };

  const openAddStockModal = (book) => {
    setSelectedBook(book);
    setAddStockData({ quantity: 1, entryDate: new Date().toISOString().split('T')[0], location: book.location || '' });
    setShowAddStockModal(true);
  };

  const openReduceStockModal = (book) => {
    setSelectedBook(book);
    setReduceStockData({ quantity: 1, reason: '', notes: '' });
    setShowReduceStockModal(true);
  };

  const handleAddStock = async () => {
    if (!selectedBook) return;
    try {
      await api.post(`/books/${selectedBook.id}/add-stock`, addStockData);
      setMessage(`✅ Stok berhasil ditambahkan: ${addStockData.quantity} eksemplar`);
      setShowAddStockModal(false);
      loadBooks();
    } catch (err) {
      setMessage('❌ Gagal menambahkan stok');
      console.error(err);
    }
  };

  const handleReduceStock = async () => {
    if (!selectedBook) return;
    if (!reduceStockData.reason) {
      setMessage('⚠️ Pilih alasan pengurangan stok');
      return;
    }
    try {
      await api.post(`/books/${selectedBook.id}/reduce-stock`, reduceStockData);
      setMessage(`✅ Stok berhasil dikurangi: ${reduceStockData.quantity} eksemplar (${reduceStockData.reason})`);
      setShowReduceStockModal(false);
      loadBooks();
    } catch (err) {
      setMessage('❌ Gagal mengurangi stok');
      console.error(err);
    }
  };

  const openQrModal = async (book) => {
    setSelectedBook(book);
    // QR code sekarang disimpan di level buku, tidak perlu fetch items
    setShowQrModal(true);
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setEditFormData({
      title: book.title || '',
      author: book.author || '',
      category: book.category || '',
      year: book.year || '',
      publisher: book.publisher || '',
      location: book.location || ''
    });
    setShowEditModal(true);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;
    setMessage('');
    try {
      await api.put(`/books/${selectedBook.id}`, editFormData);
      setMessage('✅ Data buku berhasil diperbarui');
      setShowEditModal(false);
      setSelectedBook(null);
      await loadBooks();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Gagal memperbarui data buku';
      setMessage(`❌ ${errorMsg}`);
      console.error('Edit book error:', err);
    }
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedBook) return;
    setDeleting(true);
    setMessage('');
    try {
      const res = await api.delete(`/books/${selectedBook.id}`);
      setMessage(`✅ Data buku berhasil dihapus. ${res.data.itemsDeleted || 0} eksemplar juga terhapus.`);
      setShowDeleteModal(false);
      setSelectedBook(null);
      await loadBooks();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Gagal menghapus data buku';
      setMessage(`❌ ${errorMsg}`);
      console.error('Delete book error:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">📚 Data Buku</h2>
        <div className="page-actions">
          <button type="button" className="btn-secondary" onClick={handleExport}>
            📥 Export Excel
          </button>
          <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
            📤 Import Excel
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </label>
          <button type="button" className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Batal' : '+ Tambah Buku'}
          </button>
          <button type="button" className="btn-secondary" onClick={loadBooks}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {message && (
        <div className={`form-message ${message.includes('✅') ? 'form-message-success' : message.includes('⚠️') ? 'form-message-warning' : 'form-message-error'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="form-card">
          <h3 className="form-card-title">Tambah Buku Baru</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-label">
                Judul Buku *
                <input
                  className="form-input"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </label>
              <label className="form-label">
                Penulis *
                <input
                  className="form-input"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </label>
              <label className="form-label">
                Kategori
                <input
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </label>
              <label className="form-label">
                Tahun Terbit
                <input
                  type="number"
                  className="form-input"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </label>
              <label className="form-label">
                Penerbit
                <input
                  className="form-input"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                />
              </label>
              <label className="form-label">
                Jumlah Eksemplar *
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  required
                  value={formData.totalCopies}
                  onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) || 1 })}
                />
                <small style={{ color: '#64748b', fontSize: '12px' }}>
                  QR code akan otomatis dibuat untuk setiap eksemplar
                </small>
              </label>
              <label className="form-label">
                Lokasi Rak
                <input
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Contoh: Rak A-1"
                />
              </label>
            </div>
            <button type="submit" className="btn-primary">
              💾 Simpan
            </button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Judul</th>
              <th>Penulis</th>
              <th>Kategori</th>
              <th>Tahun</th>
              <th>Stok</th>
              <th>Lokasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {books.map((b, idx) => (
              <tr key={b.id}>
                <td>{idx + 1}</td>
                <td><strong>{b.title || '-'}</strong></td>
                <td>{b.author || '-'}</td>
                <td><span className="badge">{b.category || '-'}</span></td>
                <td>{b.year || '-'}</td>
                <td><strong style={{ fontSize: '16px' }}>{b.totalCopies || 0}</strong></td>
                <td>{b.location || '-'}</td>
                <td>
                  <div className="table-actions">
                    <button
                      type="button"
                      className="btn-icon btn-qr"
                      onClick={() => openQrModal(b)}
                      title="Lihat QR Codes"
                      disabled={!b.totalCopies || b.totalCopies === 0}
                    >
                      📷
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-edit"
                      onClick={() => openEditModal(b)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-add"
                      onClick={() => openAddStockModal(b)}
                      title="Tambah Stok"
                    >
                      ➕
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-remove"
                      onClick={() => openReduceStockModal(b)}
                      title="Kurangi Stok"
                      disabled={!b.totalCopies || b.totalCopies === 0}
                    >
                      ➖
                    </button>
                    <button
                      type="button"
                      className="btn-icon btn-delete"
                      onClick={() => openDeleteModal(b)}
                      title="Hapus"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px' }}>
                  <div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <p>Belum ada data buku</p>
                    <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>
                      Tambah Buku Pertama
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Stok */}
      {showAddStockModal && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowAddStockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Stok: {selectedBook.title}</h3>
              <button className="modal-close" onClick={() => setShowAddStockModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="form-label">
                Jumlah Stok yang Ditambahkan *
                <input
                  type="number"
                  min="1"
                  className="form-input"
                  required
                  value={addStockData.quantity}
                  onChange={(e) => setAddStockData({ ...addStockData, quantity: parseInt(e.target.value) || 1 })}
                />
              </label>
              <label className="form-label">
                Tanggal Masuk
                <input
                  type="date"
                  className="form-input"
                  value={addStockData.entryDate}
                  onChange={(e) => setAddStockData({ ...addStockData, entryDate: e.target.value })}
                />
              </label>
              <label className="form-label">
                Lokasi Rak
                <input
                  className="form-input"
                  value={addStockData.location}
                  onChange={(e) => setAddStockData({ ...addStockData, location: e.target.value })}
                  placeholder={selectedBook.location || 'Contoh: Rak A-1'}
                />
              </label>
              <p className="form-hint">
                💡 QR code akan otomatis dibuat untuk setiap eksemplar baru
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowAddStockModal(false)}>
                Batal
              </button>
              <button type="button" className="btn-primary" onClick={handleAddStock}>
                ✅ Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kurangi Stok */}
      {showReduceStockModal && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowReduceStockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Kurangi Stok: {selectedBook.title}</h3>
              <button className="modal-close" onClick={() => setShowReduceStockModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="form-label">
                Jumlah Stok yang Dikurangi *
                <input
                  type="number"
                  min="1"
                  max={selectedBook.totalCopies || 0}
                  className="form-input"
                  required
                  value={reduceStockData.quantity}
                  onChange={(e) => setReduceStockData({ ...reduceStockData, quantity: parseInt(e.target.value) || 1 })}
                />
                <small style={{ color: '#64748b' }}>Stok saat ini: {selectedBook.totalCopies || 0}</small>
              </label>
              <label className="form-label">
                Alasan Pengurangan *
                <select
                  className="form-input"
                  required
                  value={reduceStockData.reason}
                  onChange={(e) => setReduceStockData({ ...reduceStockData, reason: e.target.value })}
                >
                  <option value="">Pilih alasan...</option>
                  <option value="hilang">❌ Hilang</option>
                  <option value="rusak">⚠️ Rusak</option>
                  <option value="ditarik">📤 Ditarik</option>
                  <option value="lainnya">📝 Lainnya</option>
                </select>
              </label>
              <label className="form-label">
                Catatan Tambahan
                <textarea
                  className="form-input"
                  rows="3"
                  value={reduceStockData.notes}
                  onChange={(e) => setReduceStockData({ ...reduceStockData, notes: e.target.value })}
                  placeholder="Keterangan tambahan (opsional)"
                />
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowReduceStockModal(false)}>
                Batal
              </button>
              <button type="button" className="btn-primary" onClick={handleReduceStock}>
                ✅ Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR Codes */}
      {showQrModal && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowQrModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>QR Codes: {selectedBook.title}</h3>
              <button className="modal-close" onClick={() => setShowQrModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedBook.qrCodeUrl ? (
                <div className="qr-display-container">
                  <div className="qr-main-card">
                    <img src={selectedBook.qrCodeUrl} alt={`QR ${selectedBook.title}`} className="qr-image-large" />
                    <div className="qr-book-info">
                      <h4>{selectedBook.title}</h4>
                      <p><strong>Penulis:</strong> {selectedBook.author || '-'}</p>
                      <p><strong>Kategori:</strong> {selectedBook.category || '-'}</p>
                      <p><strong>Kode Buku:</strong> <span className="qr-code-text">{selectedBook.id}</span></p>
                      <p><strong>Stok:</strong> {selectedBook.totalCopies || 0} eksemplar</p>
                      <p className="qr-note">📌 QR code ini sama untuk semua eksemplar buku ini</p>
                    </div>
                  </div>
                  <div className="qr-actions">
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedBook.qrCodeUrl;
                        link.download = `QR-${selectedBook.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
                        link.click();
                      }}
                    >
                      💾 Download QR Code
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        window.print();
                      }}
                    >
                      🖨️ Cetak QR Code
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📷</div>
                  <p>QR code belum dibuat untuk buku ini</p>
                  <small>QR code akan otomatis dibuat saat menambah stok</small>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowQrModal(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Buku */}
      {showEditModal && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Edit Data Buku</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEdit} className="modal-body">
              <div className="form-grid">
                <label className="form-label">
                  Judul Buku *
                  <input
                    className="form-input"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  />
                </label>
                <label className="form-label">
                  Penulis
                  <input
                    className="form-input"
                    value={editFormData.author}
                    onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })}
                  />
                </label>
                <label className="form-label">
                  Kategori
                  <input
                    className="form-input"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  />
                </label>
                <label className="form-label">
                  Tahun Terbit
                  <input
                    type="number"
                    className="form-input"
                    value={editFormData.year}
                    onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                  />
                </label>
                <label className="form-label">
                  Penerbit
                  <input
                    className="form-input"
                    value={editFormData.publisher}
                    onChange={(e) => setEditFormData({ ...editFormData, publisher: e.target.value })}
                  />
                </label>
                <label className="form-label">
                  Lokasi Rak
                  <input
                    className="form-input"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    placeholder="Contoh: Rak A-1"
                  />
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  💾 Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Buku */}
      {showDeleteModal && selectedBook && (
        <div className="modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="modal-content modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h3 className="confirm-title">Hapus Data Buku?</h3>
            <p className="confirm-message">
              Apakah Anda yakin ingin menghapus buku <strong>"{selectedBook.title}"</strong>?
            </p>
            <div className="confirm-warning-box">
              <p className="confirm-warning">
                ⚠️ <strong>PERINGATAN:</strong> Tindakan ini akan menghapus:
              </p>
              <ul className="confirm-warning-list">
                <li>📚 Data buku secara permanen</li>
                <li>📦 Seluruh stok buku ({selectedBook.totalCopies || 0} eksemplar)</li>
                <li>🔗 Semua data eksemplar terkait</li>
              </ul>
              <p className="confirm-warning">
                Tindakan ini <strong>tidak dapat dibatalkan</strong>!
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? '⏳ Menghapus...' : '🗑️ Ya, Hapus Semua'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

