import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

function QrScanner({ onResult, onClose }) {
  const scannerIdRef = useRef(`qr-scanner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraId, setCameraId] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState(null);

  useEffect(() => {
    const element = document.getElementById(scannerIdRef.current);
    if (!element) {
      console.error('Scanner element not found:', scannerIdRef.current);
      return;
    }

    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMsg = 'Browser tidak mendukung akses kamera. Pastikan menggunakan browser modern (Chrome, Firefox, Safari, Edge) dan HTTPS.';
      console.error(errorMsg);
      alert(errorMsg);
      if (onClose) {
        onClose();
      }
      return;
    }

    // Initialize Html5Qrcode
    const html5QrCode = new Html5Qrcode(scannerIdRef.current);
    html5QrCodeRef.current = html5QrCode;

    // Get available cameras
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setAvailableCameras(devices);
          // Prefer back camera on mobile
          const backCamera = devices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('rear') ||
            device.label.toLowerCase().includes('environment')
          );
          const defaultCamera = backCamera || devices[0];
          setSelectedCameraId(defaultCamera.id);
          startScanning(html5QrCode, defaultCamera.id);
        } else {
          alert('Tidak ada kamera yang tersedia.');
          if (onClose) {
            onClose();
          }
        }
      })
      .catch((err) => {
        console.error('Error getting cameras:', err);
        alert('Gagal mengakses kamera. Pastikan izin kamera sudah diberikan.');
        if (onClose) {
          onClose();
        }
      });

    return () => {
      stopScanning();
    };
  }, []);

  const startScanning = async (html5QrCode, cameraId) => {
    try {
      setIsScanning(true);
      setCameraId(cameraId);

      await html5QrCode.start(
        cameraId,
        {
          fps: 30,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            // Use 80% of the smaller dimension for better detection
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.min(minEdge * 0.8, 400);
            return {
              width: qrboxSize,
              height: qrboxSize
            };
          },
          aspectRatio: 1.0,
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.CODE_93
          ],
          videoConstraints: {
            facingMode: "environment"
          }
        },
        (decodedText, decodedResult) => {
          console.log('QR Code/Barcode scanned:', decodedText);
          if (onResult) {
            onResult(decodedText);
            // Auto close after successful scan
            setTimeout(() => {
              stopScanning();
              if (onClose) {
                onClose();
              }
            }, 300);
          }
        },
        (errorMessage) => {
          // Ignore common scan errors
          if (!errorMessage.includes('No MultiFormat Readers') && 
              !errorMessage.includes('NotFoundException') &&
              !errorMessage.includes('QR code parse error')) {
            // Only log important errors
            if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowedError')) {
              console.error('Camera permission denied:', errorMessage);
              alert('Izin kamera ditolak. Silakan berikan izin kamera di pengaturan browser.');
              stopScanning();
              if (onClose) {
                onClose();
              }
            }
          }
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      setIsScanning(false);
      if (err.message.includes('Permission') || err.message.includes('NotAllowedError')) {
        alert('Izin kamera ditolak. Silakan:\n1. Klik ikon gembok di address bar\n2. Izinkan akses kamera\n3. Refresh halaman dan coba lagi');
      } else if (err.message.includes('NotFoundError')) {
        alert('Kamera tidak ditemukan. Pastikan kamera tersedia.');
      } else {
        alert('Gagal memulai scanner: ' + err.message);
      }
      if (onClose) {
        onClose();
      }
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.warn('Error stopping scanner:', err);
      }
      setIsScanning(false);
      setCameraId(null);
    }
  };

  const handleCameraChange = async (newCameraId) => {
    if (isScanning) {
      await stopScanning();
    }
    setSelectedCameraId(newCameraId);
    if (html5QrCodeRef.current) {
      await startScanning(html5QrCodeRef.current, newCameraId);
    }
  };

  const handleClose = async () => {
    await stopScanning();
    if (onClose) {
      onClose();
    }
  };

  const overlayContent = (
    <div 
      className="scanner-overlay" 
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div 
        className="scanner-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '24px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          animation: 'fadeInUp 0.4s ease-out'
        }}
      >
        <div className="scanner-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '2px solid #f1f5f9'
        }}>
          <div>
            <h3 style={{ 
              margin: 0, 
              fontSize: '20px', 
              fontWeight: '700', 
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>📷</span>
              Scan QR Code / Barcode
            </h3>
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '13px', 
              color: '#64748b' 
            }}>
              {isScanning ? 'Sedang memindai...' : 'Siap untuk memindai'}
            </p>
          </div>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={handleClose}
            style={{
              minWidth: '40px',
              height: '40px',
              borderRadius: '10px',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: '600'
            }}
          >
            ✕
          </button>
        </div>

        {/* Camera Selection */}
        {availableCameras.length > 1 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '13px', 
              fontWeight: '600', 
              color: '#475569' 
            }}>
              📹 Pilih Kamera:
            </label>
            <select
              value={selectedCameraId || ''}
              onChange={(e) => handleCameraChange(e.target.value)}
              disabled={!isScanning}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                fontSize: '14px',
                background: 'white',
                color: '#0f172a',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {availableCameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Kamera ${camera.id.substring(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scanner Area */}
        <div 
          id={scannerIdRef.current} 
          className="scanner-area" 
          style={{ 
            minHeight: '400px',
            width: '100%',
            marginBottom: '16px',
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#000',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }} 
        />

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px'
        }}>
          {isScanning ? (
            <button
              type="button"
              onClick={stopScanning}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
            >
              ⏹️ Stop Scanning
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (html5QrCodeRef.current && selectedCameraId) {
                  startScanning(html5QrCodeRef.current, selectedCameraId);
                }
              }}
              style={{
                flex: 1,
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              ▶️ Start Scanning
            </button>
          )}
        </div>

        {/* Tips */}
        <div style={{
          padding: '12px 16px',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <p className="scanner-hint" style={{ 
            margin: 0,
            textAlign: 'center', 
            color: '#475569', 
            fontSize: '13px',
            lineHeight: '1.6'
          }}>
            💡 <strong>Tips:</strong> Pastikan kode jelas, cukup terang, dan dalam jarak optimal (6-40 cm). Hasil scan akan otomatis dimasukkan.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        /* Style for Html5Qrcode generated elements */
        #${scannerIdRef.current} video {
          width: 100% !important;
          height: auto !important;
          border-radius: 16px;
        }
        #${scannerIdRef.current} canvas {
          display: none;
        }
        #${scannerIdRef.current} .qr-shaded-region {
          border-radius: 16px;
        }
      `}</style>
    </div>
  );

  // Use Portal to render at document.body level
  return createPortal(overlayContent, document.body);
}

export default QrScanner;
