const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://admin:kartal2024@localhost:5432/salon_kartal'
});

pool.on('connect', () => console.log('✅ PostgreSQL bağlantısı kuruldu'));
pool.on('error', (err) => console.error('❌ PostgreSQL hatası:', err));

module.exports = pool;
