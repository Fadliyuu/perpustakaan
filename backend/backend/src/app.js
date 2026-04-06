const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
let app = express();

try {
  const { configureCloudinary } = require('./cloudinary');
  const { getFirestore } = require('./firebase');
  
  dotenv.config();
  configureCloudinary();
  getFirestore(); // ensure initialized

  // CORS: Mengizinkan SEMUA origin agar proses login / akses API dari Vercel/localhost terjamin tanpa error
  const corsOptions = {
    // origin: true akan memantulkan origin dari request pengirim, sehingga semua diizinkan dengan kredensial
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({ 
      message: 'Perpustakaan API - Backend is running',
      status: 'ok',
      time: new Date().toISOString(),
      endpoints: {
        health: '/health',
        api: '/api'
      }
    });
  });

  // Simple health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Routers
  // Menggunakan require di dalam blok try untuk memastikan module-level error tertangkap
  app.use('/api/students', require('./routes/students'));
  app.use('/api/books', require('./routes/books'));
  app.use('/api/items', require('./routes/items'));
  app.use('/api/transactions', require('./routes/transactions'));
  app.use('/api/inventories', require('./routes/inventories'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));

  // Fallback
  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

} catch (bootstrapError) {
  console.error("FATAL INITIALIZATION ERROR:", bootstrapError);
  // Jika server gagal diinisialisasi (misal Firebase gagal, JWT_SECRET kurang),
  // kembalikan JSON error agar mudah di-debug dari frontend Vercel.
  app.use(cors());
  app.use((req, res) => {
    res.status(500).json({
      error: "API Bootstrap Failed",
      message: bootstrapError.message,
      instruction: "Periksa pengaturan Environment Variables di Dashboard Vercel Anda.",
      stack: process.env.NODE_ENV === 'production' ? undefined : bootstrapError.stack
    });
  });
}

module.exports = app;
