import React, { useState, useEffect } from 'react';
import api from '../api.js';
import QrScanner from '../components/QrScanner.jsx';

export default function ReturnPage() {
  const [searchMode, setSearchMode] = useState('student'); // 'student', 'receipt', 'found'
  const [studentQuery, setStudentQuery] = useState('');
  const [receiptQuery, setReceiptQuery] = useState('');
  const [studentResults, setStudentResults] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionItems, setTransactionItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({}); // { itemId: { condition, fine, notes } }
  const [paymentStatus, setPaymentStatus] = useState('paid'); // 'paid' or 'pending'
  const [officerName, setOfficerName] = useState('');
  const [officerTitle, setOfficerTitle] = useState('Petugas Perpustakaan');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanType, setScanType] = useState(''); // 'receipt' or 'book'
  const [showFoundBookModal, setShowFoundBookModal] = useState(false);
  const [foundBookData, setFoundBookData] = useState({ code: '', description: '' });
  const [returnSuccess, setReturnSuccess] = useState(null); // { transactionId, totalFine, status }

  const searchStudents = async (q) => {
    if (!q) {
      setStudentResults([]);
      return;
    }
    try {
      const res = await api.get('/transactions/search-by-student', { params: { q } });
      setStudentResults(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const searchByReceipt = async (receiptNumber) => {
    if (!receiptNumber) return;
    try {
      const res = await api.get(`/transactions/by-receipt/${receiptNumber}`);
      setSelectedTransaction(res.data);
      loadTransactionItems(res.data.id);
    } catch (err) {
      setMessage('❌ Transaksi tidak ditemukan');
      console.error(err);
    }
  };

  const loadTransactionItems = async (transactionId) => {
    try {
      const res = await api.get(`/transactions/${transactionId}/items`);
      setTransactionItems(res.data || []);
      
      // Initialize selected items
      const initial = {};
      res.data.forEach((item) => {
        initial[item.itemId] = {
          selected: false,
          condition: 'good',
          fine: 0,
          notes: ''
        };
      });
      setSelectedItems(initial);
    } catch (err) {
      console.error(err);
      setMessage('❌ Gagal memuat detail transaksi');
    }
  };

  const handleSelectTransaction = (tx) => {
    setSelectedTransaction(tx);
    setStudentQuery('');
    setStudentResults([]);
    loadTransactionItems(tx.id);
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        selected: !prev[itemId]?.selected
      }
    }));
  };

  const updateItemCondition = (itemId, field, value) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleReturn = async () => {
    const selected = Object.entries(selectedItems)
      .filter(([_, data]) => data.selected)
      .map(([itemId, data]) => ({
        itemId,
        condition: data.condition,
        fine: data.fine || 0,
        notes: data.notes || ''
      }));

    if (selected.length === 0) {
      setMessage('⚠️ Pilih minimal satu buku untuk dikembalikan');
      return;
    }

    if (!selectedTransaction) {
      setMessage('⚠️ Pilih transaksi terlebih dahulu');
      return;
    }

    if (!officerName.trim()) {
      setMessage('⚠️ Nama petugas wajib diisi');
      return;
    }
    if (!officerTitle.trim()) {
      setMessage('⚠️ Jabatan petugas wajib diisi');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/transactions/return', {
        transactionId: selectedTransaction.id,
        items: selected,
        paymentStatus: paymentStatus,
        officerName: officerName.trim(),
        officerTitle: officerTitle.trim()
      });
      setReturnSuccess({
        transactionId: selectedTransaction.id,
        receiptNumber: selectedTransaction.receiptNumber || selectedTransaction.id,
        totalFine: res.data.totalFine || 0,
        status: res.data.status,
        paymentStatus: paymentStatus
      });
      setMessage('✅ Pengembalian berhasil diproses');
      setSelectedItems({});
      setSelectedTransaction(null);
      setOfficerName('');
      setOfficerTitle('Petugas Perpustakaan');
      setTransactionItems([]);
      setPaymentStatus('paid');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal memproses pengembalian';
      setMessage(`❌ ${errorMsg}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFoundBook = async () => {
    if (!foundBookData.code) {
      setMessage('⚠️ Masukkan kode buku');
      return;
    }
    setLoading(true);
    try {
      await api.post('/transactions/found-book', foundBookData);
      setMessage('✅ Buku ditemukan berhasil dicatat');
      setShowFoundBookModal(false);
      setFoundBookData({ code: '', description: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal mencatat buku ditemukan';
      setMessage(`❌ ${errorMsg}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalFine = () => {
    return Object.values(selectedItems)
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + (Number(item.fine) || 0), 0);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">📥 Pengembalian Buku</h2>
          <p className="page-subtitle">Proses pengembalian buku dengan berbagai metode pencarian</p>
        </div>
      </div>

      {/* Search Mode Tabs */}
      <div className="search-mode-tabs">
        <button
          type="button"
          className={`tab-button ${searchMode === 'student' ? 'active' : ''}`}
          onClick={() => {
            setSearchMode('student');
            setSelectedTransaction(null);
            setTransactionItems([]);
          }}
        >
          👤 Cari Peminjam
        </button>
        <button
          type="button"
          className={`tab-button ${searchMode === 'receipt' ? 'active' : ''}`}
          onClick={() => {
            setSearchMode('receipt');
            setSelectedTransaction(null);
            setTransactionItems([]);
          }}
        >
          🎫 Scan Kode Peminjaman
        </button>
        <button
          type="button"
          className={`tab-button ${searchMode === 'found' ? 'active' : ''}`}
          onClick={() => {
            setSearchMode('found');
            setShowFoundBookModal(true);
          }}
        >
          🔍 Buku Ditemukan
        </button>
      </div>

      {message && (
        <div className={`form-message ${message.includes('✅') ? 'form-message-success' : 'form-message-error'}`}>
          {message}
        </div>
      )}

      {/* Search by Student */}
      {searchMode === 'student' && (
        <div className="form-card">
          <div className="form-card-header">
            <span className="form-card-icon">👤</span>
            <h3 className="form-card-title">Cari Peminjam</h3>
          </div>
          <div className="form-card-body">
            <label className="form-label">
              Nama Peminjam
              <input
                className="form-input"
                placeholder="🔍 Ketik nama peminjam..."
                value={studentQuery}
                onChange={(e) => {
                  const v = e.target.value;
                  setStudentQuery(v);
                  searchStudents(v);
                }}
              />
            </label>
            {studentResults.length > 0 && (
              <div className="dropdown">
                {studentResults.map((tx) => (
                  <button
                    key={tx.id}
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleSelectTransaction(tx)}
                  >
                    <div>
                      <strong>{tx.student?.name || '-'}</strong>
                      <div className="dropdown-meta">
                        Kode: {tx.receiptNumber} • {tx.borrowDate ? new Date(tx.borrowDate).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search by Receipt */}
      {searchMode === 'receipt' && (
        <div className="form-card">
          <div className="form-card-header">
            <span className="form-card-icon">🎫</span>
            <h3 className="form-card-title">Kode Peminjaman</h3>
          </div>
          <div className="form-card-body">
            <div className="code-input-group">
              <input
                className="form-input code-input"
                placeholder="Masukkan kode peminjaman atau scan barcode..."
                value={receiptQuery}
                onChange={(e) => setReceiptQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    searchByReceipt(receiptQuery);
                  }
                }}
              />
              <button
                type="button"
                className="btn-primary btn-scan"
                onClick={() => {
                  setScanType('receipt');
                  setShowScanner(true);
                }}
              >
                📷 Scan Barcode
              </button>
            </div>
            <p className="form-hint">
              💡 Scan barcode dari struk peminjaman atau masukkan kode secara manual
            </p>
          </div>
        </div>
      )}

      {/* Selected Transaction Info */}
      {selectedTransaction && (
        <div className="form-card">
          <div className="form-card-header">
            <span className="form-card-icon">📋</span>
            <h3 className="form-card-title">Detail Transaksi</h3>
          </div>
          <div className="form-card-body">
            <div className="transaction-info">
              <div className="info-row">
                <span className="info-label">Peminjam:</span>
                <span className="info-value">{selectedTransaction.student?.name || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Kode Peminjaman:</span>
                <span className="info-value">{selectedTransaction.receiptNumber || '-'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tanggal Pinjam:</span>
                <span className="info-value">
                  {selectedTransaction.borrowDate
                    ? new Date(selectedTransaction.borrowDate).toLocaleDateString('id-ID')
                    : '-'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Jatuh Tempo:</span>
                <span className="info-value">
                  {selectedTransaction.dueDate
                    ? new Date(selectedTransaction.dueDate).toLocaleDateString('id-ID')
                    : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Items */}
      {selectedTransaction && transactionItems.length > 0 && (
        <div className="form-card">
          <div className="form-card-header">
            <span className="form-card-icon">📚</span>
            <h3 className="form-card-title">Daftar Buku yang Dipinjam</h3>
          </div>
          <div className="form-card-body">
            <div className="items-list">
              {transactionItems.map((item) => {
                const isSelected = selectedItems[item.itemId]?.selected || false;
                const itemData = selectedItems[item.itemId] || {
                  selected: false,
                  condition: 'good',
                  fine: 0,
                  notes: ''
                };

                return (
                  <div key={item.itemId} className={`item-card ${isSelected ? 'selected' : ''}`}>
                    <div className="item-header">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleItemSelection(item.itemId)}
                        />
                        <span className="item-title">{item.book?.title || 'Buku tidak ditemukan'}</span>
                      </label>
                      <button
                        type="button"
                        className="btn-icon btn-scan-small"
                        onClick={() => {
                          setScanType('book');
                          setShowScanner(true);
                        }}
                        title="Scan QR Buku"
                      >
                        📷
                      </button>
                    </div>
                    {item.book && (
                      <div className="item-meta">
                        <span>Penulis: {item.book.author || '-'}</span>
                        <span>Kode: {item.item?.uniqueCode || '-'}</span>
                      </div>
                    )}
                    {isSelected && (
                      <div className="item-conditions">
                        <label className="form-label">
                          Kondisi
                          <select
                            className="form-input"
                            value={itemData.condition}
                            onChange={(e) => updateItemCondition(item.itemId, 'condition', e.target.value)}
                          >
                            <option value="good">✅ Baik</option>
                            <option value="damaged">⚠️ Rusak</option>
                            <option value="lost">❌ Hilang</option>
                          </select>
                        </label>
                        {(itemData.condition === 'lost' || itemData.condition === 'damaged') && (
                          <>
                            <label className="form-label">
                              Denda (Rp)
                              <input
                                type="number"
                                className="form-input"
                                min="0"
                                value={itemData.fine}
                                onChange={(e) => updateItemCondition(item.itemId, 'fine', e.target.value)}
                                placeholder="0"
                              />
                            </label>
                            <label className="form-label">
                              Catatan
                              <textarea
                                className="form-input"
                                value={itemData.notes}
                                onChange={(e) => updateItemCondition(item.itemId, 'notes', e.target.value)}
                                placeholder="Catatan tambahan..."
                                rows="2"
                              />
                            </label>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {Object.values(selectedItems).filter((item) => item.selected).length > 0 && (
              <div className="return-summary">
                <div className="summary-row">
                  <span>Total Denda:</span>
                  <strong>Rp {calculateTotalFine().toLocaleString('id-ID')}</strong>
                </div>
                {calculateTotalFine() > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <label className="form-label">
                      Status Pembayaran
                      <select
                        className="form-input"
                        value={paymentStatus}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                      >
                        <option value="paid">💳 Bayar Langsung</option>
                        <option value="pending">⏳ Bayar Nanti</option>
                      </select>
                    </label>
                    <p className="form-hint">
                      {paymentStatus === 'paid' 
                        ? '✅ Transaksi akan langsung selesai setelah pengembalian'
                        : '⚠️ Transaksi akan menunggu pembayaran denda, perlu konfirmasi lagi nanti'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTransaction && Object.values(selectedItems).filter((item) => item.selected).length > 0 && (
        <div className="form-card">
          <div className="form-card-header">
            <span className="form-card-icon">✍️</span>
            <h3 className="form-card-title">Petugas yang Menandatangani</h3>
          </div>
          <div className="form-card-body">
            <label className="form-label">
              Jabatan / Posisi
              <select
                className="form-input"
                value={officerTitle}
                onChange={(e) => setOfficerTitle(e.target.value)}
                required
              >
                <option value="Petugas Perpustakaan">Petugas Perpustakaan</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Guru">Guru</option>
                <option value="Karyawan">Karyawan</option>
                <option value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</option>
                <option value="Wali Kelas">Wali Kelas</option>
                <option value="Staf Administrasi">Staf Administrasi</option>
              </select>
            </label>
            <label className="form-label">
              Nama Petugas
              <input
                type="text"
                className="form-input"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                placeholder="Contoh: Karin, Ata Fadli, dll"
                required
              />
              <small style={{ color: '#64748b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Nama lengkap petugas yang akan menandatangani struk
              </small>
            </label>
          </div>
        </div>
      )}

      {message && (
        <div className={`form-message ${message.includes('berhasil') || message.includes('✅') ? 'form-message-success' : 'form-message-error'}`}>
          {message}
        </div>
      )}

      {selectedTransaction && (
        <button
          type="button"
          className="btn-submit"
          onClick={handleReturn}
          disabled={loading || Object.values(selectedItems).filter((item) => item.selected).length === 0 || !officerName.trim() || !officerTitle.trim()}
        >
          {loading ? '⏳ Memproses...' : '✅ Proses Pengembalian'}
        </button>
      )}

      {/* Return Success Modal */}
      {returnSuccess && (
        <div className="modal-overlay" onClick={() => setReturnSuccess(null)}>
          <div className="modal-content modal-success" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✅ Pengembalian Berhasil!</h3>
              <button className="modal-close" onClick={() => setReturnSuccess(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                  QR Code Pengembalian
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(returnSuccess.receiptNumber)}`}
                    alt={`QR Code ${returnSuccess.receiptNumber}`}
                    style={{ width: '200px', height: '200px', border: '2px solid #e2e8f0', borderRadius: '8px', padding: '8px', background: 'white' }}
                  />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '1px', fontFamily: 'monospace' }}>
                      {returnSuccess.receiptNumber}
                    </div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>
                      Kode transaksi pengembalian
                    </p>
                  </div>
                </div>
              </div>
              {returnSuccess.totalFine > 0 && (
                <div className="payment-info" style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <p><strong>Total Denda:</strong> Rp {returnSuccess.totalFine.toLocaleString('id-ID')}</p>
                  <p style={{ color: returnSuccess.paymentStatus === 'paid' ? '#166534' : '#92400e', marginTop: '4px' }}>
                    Status: {returnSuccess.paymentStatus === 'paid' ? '✅ LUNAS' : '⏳ BELUM LUNAS'}
                  </p>
                </div>
              )}
              <div className="success-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={async () => {
                    try {
                      const res = await api.get(`/transactions/${returnSuccess.transactionId}/return-receipt`, {
                        responseType: 'text'
                      });
                      const w = window.open('', '_blank');
                      if (w) {
                        w.document.open();
                        w.document.write(res.data);
                        w.document.close();
                      } else {
                        alert('Popup diblokir. Silakan izinkan popup untuk browser ini.');
                      }
                    } catch (err) {
                      console.error('Receipt error:', err);
                      let errorMsg = 'Gagal membuka struk';
                      if (err.response) {
                        if (typeof err.response.data === 'string') {
                          errorMsg = err.response.data;
                        } else {
                          errorMsg = err.response.data?.message || JSON.stringify(err.response.data);
                        }
                      } else if (err.message) {
                        errorMsg = err.message;
                      }
                      alert('Gagal membuka struk:\n\n' + errorMsg + '\n\nSilakan cek console untuk detail error.');
                    }
                  }}
                >
                  🖨️ Cetak Struk
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setReturnSuccess(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner */}
      {showScanner && (
        <QrScanner
          onResult={(code) => {
            const trimmed = (code || '').trim();
            if (!trimmed) return;
            
            if (scanType === 'receipt') {
              setReceiptQuery(trimmed);
              searchByReceipt(trimmed);
            } else if (scanType === 'book') {
              // Find item by code and auto-select
              const item = transactionItems.find(
                (i) =>
                  i.item?.uniqueCode === trimmed || // barcode unik item
                  i.itemId === trimmed || // id item
                  i.book?.id === trimmed || // QR buku (bookId) - dukung scan book-level QR
                  i.bookId === trimmed || // fallback jika bookId ada di record
                  i.item?.bookId === trimmed // fallback jika bookId tersimpan di item
              );
              if (item) {
                if (!selectedItems[item.itemId]?.selected) {
                  toggleItemSelection(item.itemId);
                }
                setMessage(`✅ Buku "${item.book?.title || trimmed}" berhasil dipilih`);
              } else {
                setMessage(`⚠️ Buku dengan kode ${trimmed} tidak ditemukan dalam transaksi ini`);
              }
            } else if (scanType === 'found') {
              setFoundBookData((prev) => ({ ...prev, code: trimmed }));
              setMessage(`✅ Kode ${trimmed} berhasil ditambahkan`);
            }
            setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Found Book Modal */}
      {showFoundBookModal && (
        <div className="modal-overlay" onClick={() => setShowFoundBookModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔍 Buku Ditemukan</h3>
              <button className="modal-close" onClick={() => setShowFoundBookModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="form-label">
                Kode Buku
                <div className="code-input-group">
                  <input
                    className="form-input"
                    placeholder="Masukkan kode atau scan QR..."
                    value={foundBookData.code}
                    onChange={(e) => setFoundBookData({ ...foundBookData, code: e.target.value })}
                  />
                  <button
                    type="button"
                    className="btn-primary btn-scan"
                    onClick={() => {
                      setScanType('found');
                      setShowScanner(true);
                    }}
                  >
                    📷 Scan
                  </button>
                </div>
              </label>
              <label className="form-label">
                Deskripsi Temuan
                <textarea
                  className="form-input"
                  placeholder="Deskripsi lokasi atau kondisi buku yang ditemukan..."
                  value={foundBookData.description}
                  onChange={(e) => setFoundBookData({ ...foundBookData, description: e.target.value })}
                  rows="4"
                />
              </label>
              <p className="form-hint">
                💡 Buku yang ditemukan akan dicatat dan bisa dikembalikan ke peminjam jika ada yang mengklaim
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowFoundBookModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleFoundBook}
                disabled={loading || !foundBookData.code}
              >
                {loading ? '⏳ Menyimpan...' : '💾 Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
