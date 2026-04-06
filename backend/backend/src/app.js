const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { configureCloudinary } = require('./cloudinary');
const { getFirestore } = require('./firebase');

dotenv.config();
configureCloudinary();
getFirestore(); // ensure initialized

const app = express();

// CORS: utamakan FRONTEND_URL; wildcard hanya untuk dev lokal dan tidak di production.
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

const isProd = process.env.NODE_ENV === 'production';
const allowLanWildcard = process.env.ALLOW_LAN_DEV === '1' && !isProd;
const extraOrigins = process.env.DEV_EXTRA_ORIGINS
  ? process.env.DEV_EXTRA_ORIGINS.split(',').map((url) => url.trim())
  : [];

const configuredOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map((url) => url.trim()).concat(extraOrigins)
  : defaultOrigins.concat(extraOrigins);

if (!process.env.FRONTEND_URL) {
  console.warn('[CORS] FRONTEND_URL tidak di-set, menggunakan default origins dev.');
}
if (allowLanWildcard) {
  console.warn('[CORS] ALLOW_LAN_DEV aktif (non-production) — origin wildcard diizinkan.');
}

const corsOptions = {
  origin: (origin, callback) => {
    // Izinkan request tanpa Origin (mis. curl / health check / same-origin)
    if (!origin) {
      return callback(null, true);
    }

    if (configuredOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Izinkan Vercel deployment domains secara otomatis
    if (/\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    }

    // Izinkan origin IP private LAN saat bukan production (untuk dev via perangkat lain)
    const privateLanRegex =
      /^https?:\/\/(?:(?:10\.)|(?:192\.168\.)|(?:172\.(1[6-9]|2\d|3[01])\.))[0-9.]+(?::\d+)?$/i;
    if (!isProd && privateLanRegex.test(origin)) {
      return callback(null, true);
    }
    // Jika ALLOW_LAN_DEV=1, tetap izinkan private LAN meski isProd=false sudah tertutup di atas
    if (allowLanWildcard && privateLanRegex.test(origin)) {
      return callback(null, true);
    }
    // Izinkan domain ngrok/grok sementara di dev
    if (!isProd && /\.ngrok-free\.dev$/i.test(origin)) {
      return callback(null, true);
    }

    // Jangan throw Error agar tidak memicu 500 Internal Server Error, kembalikan false saja
    return callback(null, false);
  },
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

module.exports = app;
