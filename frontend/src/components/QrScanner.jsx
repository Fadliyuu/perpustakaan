import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

function QrScanner({ onResult, onClose }) {
  const scannerIdRef = useRef(`qr-scanner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    // Wait for DOM to be ready - increased delay for better compatibility
    const timer = setTimeout(() => {
      const element = document.getElementById(scannerIdRef.current);
      if (!element) {
        console.error('Scanner element not found:', scannerIdRef.current);
        return;
      }

      // Clear any existing content
      element.innerHTML = '';

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

      try {
        console.log('Initializing QR scanner with ID:', scannerIdRef.current);
        const scanner = new Html5QrcodeScanner(
          scannerIdRef.current,
          {
            fps: 30, // Increased FPS for better responsiveness
            qrbox: { width: 300, height: 300 }, // Larger scan area for better detection
            aspectRatio: 1.0,
            // Enable both QR code and barcode scanning
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
            // Additional config for better barcode detection
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true,
            supportedScanTypes: [0, 1], // Camera and file
            videoConstraints: {
              facingMode: "environment" // Use back camera on mobile
            }
          },
          true // verbose - enable for debugging
        );

        scannerInstanceRef.current = scanner;

        scanner.render(
          (decodedText) => {
            console.log('QR Code/Barcode scanned:', decodedText);
            if (onResult) {
              onResult(decodedText);
              // Auto close after successful scan
              setTimeout(() => {
                // Cleanup scanner
                if (scannerInstanceRef.current) {
                  try {
                    scannerInstanceRef.current.clear().catch((err) => {
                      console.warn('Error clearing scanner:', err);
                    });
                  } catch (err) {
                    console.warn('Error during cleanup:', err);
                  }
                  scannerInstanceRef.current = null;
                }
                // Call onClose callback
                if (onClose) {
                  onClose();
                }
              }, 500);
            }
          },
          (errorMessage) => {
            // Log important errors for debugging
            if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowedError')) {
              console.error('Camera permission denied:', errorMessage);
              alert('Izin kamera ditolak. Silakan berikan izin kamera di pengaturan browser dan coba lagi.');
            } else if (errorMessage.includes('NotFoundError') || errorMessage.includes('No camera')) {
              console.error('Camera not found:', errorMessage);
              alert('Kamera tidak ditemukan. Pastikan kamera tersedia dan tidak digunakan aplikasi lain.');
            } else if (!errorMessage.includes('No MultiFormat Readers') && 
                !errorMessage.includes('NotFoundException') &&
                !errorMessage.includes('QR code parse error')) {
              // Only log non-common errors
              console.warn('Scan error:', errorMessage);
            }
          }
        );
      } catch (err) {
        console.error('Error initializing QR scanner:', err);
        let errorMsg = 'Gagal menginisialisasi scanner.\n\n';
        if (err.message.includes('Permission') || err.message.includes('NotAllowedError')) {
          errorMsg += 'Izin kamera ditolak. Silakan:\n';
          errorMsg += '1. Klik ikon gembok di address bar\n';
          errorMsg += '2. Izinkan akses kamera\n';
          errorMsg += '3. Refresh halaman dan coba lagi';
        } else if (err.message.includes('NotFoundError')) {
          errorMsg += 'Kamera tidak ditemukan. Pastikan kamera tersedia.';
        } else {
          errorMsg += 'Error: ' + err.message;
        }
        alert(errorMsg);
        if (onClose) {
          onClose();
        }
      }
    }, 300); // Increased delay for better compatibility

    return () => {
      clearTimeout(timer);
      // Cleanup scanner on unmount
      if (scannerInstanceRef.current) {
        try {
          scannerInstanceRef.current.clear().catch((err) => {
            console.warn('Error clearing scanner:', err);
          });
        } catch (err) {
          console.warn('Error during cleanup:', err);
        }
        scannerInstanceRef.current = null;
      }
    };
  }, [onResult, onClose]);

  const handleClose = () => {
    // Cleanup scanner
    if (scannerInstanceRef.current) {
      try {
        scannerInstanceRef.current.clear().catch((err) => {
          console.warn('Error clearing scanner:', err);
        });
      } catch (err) {
        console.warn('Error during cleanup:', err);
      }
      scannerInstanceRef.current = null;
    }
    // Call onClose callback
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
          maxWidth: '600px',
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
              Arahkan kamera ke kode hingga terdeteksi
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
              fontSize: '18px'
            }}
          >
            ✕
          </button>
        </div>
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
            💡 <strong>Tips:</strong> Pastikan kode jelas dan cukup terang. Hasil scan akan otomatis dimasukkan.
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
      `}</style>
    </div>
  );

  // Use Portal to render at document.body level
  return createPortal(overlayContent, document.body);
}

export default QrScanner;
