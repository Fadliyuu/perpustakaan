// Vercel Serverless Function Entry Point
// File ini untuk deploy backend di Vercel sebagai serverless function

const app = require('../src/app');

// Export sebagai serverless function untuk Vercel
// Vercel akan memanggil function ini untuk setiap request
module.exports = (req, res) => {
  // Delegate semua request ke Express app
  return app(req, res);
};



