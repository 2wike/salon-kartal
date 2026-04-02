const router = require('express').Router();
const pool = require('../db/pool');
const { adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/barbers');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `barber_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Tüm ustaları getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM barbers WHERE is_active=TRUE ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Tek usta
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM barbers WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ error: 'Usta bulunamadı' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Usta ekle (admin)
router.post('/', adminOnly, upload.single('photo'), async (req, res) => {
  const { name, title, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Ad zorunludur' });
  const photo_url = req.file ? `/uploads/barbers/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      'INSERT INTO barbers (name, title, description, photo_url) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, title || 'Usta Kuaför', description || null, photo_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Usta güncelle (admin)
router.put('/:id', adminOnly, upload.single('photo'), async (req, res) => {
  const { name, title, description, is_active } = req.body;
  try {
    const current = await pool.query('SELECT * FROM barbers WHERE id=$1', [req.params.id]);
    if (!current.rows.length) return res.status(404).json({ error: 'Usta bulunamadı' });
    const photo_url = req.file ? `/uploads/barbers/${req.file.filename}` : current.rows[0].photo_url;
    const result = await pool.query(
      'UPDATE barbers SET name=COALESCE($1,name), title=COALESCE($2,title), description=COALESCE($3,description), photo_url=$4, is_active=COALESCE($5,is_active), updated_at=NOW() WHERE id=$6 RETURNING *',
      [name, title, description, photo_url, is_active !== undefined ? is_active : null, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Usta sil (admin)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE barbers SET is_active=FALSE WHERE id=$1', [req.params.id]);
    res.json({ message: 'Usta kaldırıldı' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
