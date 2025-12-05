import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

function QrScanner({ onResult, onClose }) {
  const scannerIdRef = useRef(`qr-scanner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      const element = document.getElementById(scannerIdRef.current);
      if (!element) {
        console.error('Scanner element not found:', scannerIdRef.current);
        return;
      }

      // Clear any existing content
      element.innerHTML = '';

      try {
        console.log('Initializing QR scanner with ID:', scannerIdRef.current);
        const scanner = new Html5QrcodeScanner(
          scannerIdRef.current,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            // Enable both QR code and barcode scanning
            formatsToSupport: [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.CODE_128
            ],
            // Additional config for better barcode detection
            rememberLastUsedCamera: true,
            showTorchButtonIfSupported: true
          },
          false // verbose
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
            // Ignore scan errors (camera not ready, etc.)
            if (!errorMessage.includes('No MultiFormat Readers') && 
                !errorMessage.includes('NotFoundException')) {
              // console.log('Scan error:', errorMessage);
            }
          }
        );
      } catch (err) {
        console.error('Error initializing QR scanner:', err);
        alert('Gagal menginisialisasi scanner. Pastikan kamera tersedia dan izin kamera sudah diberikan.\n\nError: ' + err.message);
      }
    }, 100);

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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className="scanner-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div className="scanner-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <span style={{ fontSize: '18px', fontWeight: '600' }}>📷 Scan QR Code / Barcode</span>
          <button type="button" className="btn-secondary" onClick={handleClose}>
            ✕ Tutup
          </button>
        </div>
        <div 
          id={scannerIdRef.current} 
          className="scanner-area" 
          style={{ 
            minHeight: '300px',
            width: '100%',
            marginBottom: '15px',
            position: 'relative'
          }} 
        />
        <p className="scanner-hint" style={{ padding: '10px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
          Arahkan kamera ke QR code / barcode hingga terdeteksi. Hasil scan akan otomatis dimasukkan.
        </p>
      </div>
    </div>
  );

  // Use Portal to render at document.body level
  return createPortal(overlayContent, document.body);
}

export default QrScanner;
