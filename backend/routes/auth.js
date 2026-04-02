const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const SECRET = process.env.JWT_SECRET || 'salon_kartal_secret';

// Kayıt ol
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Ad, email ve şifre zorunludur' });
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rows.length) return res.status(409).json({ error: 'Bu email zaten kayıtlı' });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, phone, role) VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role',
      [name, email, hash, phone || null, 'customer']
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Giriş yap (müşteri + admin + usta)
router.post('/login', async (req, res) => {
  const { email, password, isAdmin } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email ve şifre zorunludur' });
  try {
    const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (!result.rows.length) return res.status(401).json({ error: 'Email veya şifre hatalı' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Email veya şifre hatalı' });
    if (isAdmin && user.role !== 'admin') return res.status(403).json({ error: 'Admin yetkisi yok' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Profil bilgisi
router.get('/me', require('../middleware/auth').auth, async (req, res) => {
  const result = await pool.query('SELECT id, name, email, phone, role FROM users WHERE id=$1', [req.user.id]);
  if (!result.rows.length) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  res.json(result.rows[0]);
});

module.exports = router;
