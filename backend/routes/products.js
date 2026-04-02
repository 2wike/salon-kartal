const router = require('express').Router();
const pool = require('../db/pool');
const { adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `product_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE is_active=TRUE ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Tüm ürünler (admin - pasifler dahil)
router.get('/admin/all', adminOnly, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Ürün ekle (admin)
router.post('/', adminOnly, upload.single('photo'), async (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name) return res.status(400).json({ error: 'Ürün adı zorunludur' });
  const photo_url = req.file ? `/uploads/products/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, photo_url, stock) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, description || null, price || null, photo_url, stock || 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Ürün güncelle (admin)
router.put('/:id', adminOnly, upload.single('photo'), async (req, res) => {
  const { name, description, price, stock, is_active } = req.body;
  try {
    const current = await pool.query('SELECT * FROM products WHERE id=$1', [req.params.id]);
    if (!current.rows.length) return res.status(404).json({ error: 'Ürün bulunamadı' });
    const photo_url = req.file ? `/uploads/products/${req.file.filename}` : current.rows[0].photo_url;
    const result = await pool.query(
      `UPDATE products SET 
        name=COALESCE($1,name), 
        description=COALESCE($2,description), 
        price=COALESCE($3,price), 
        stock=COALESCE($4,stock),
        photo_url=$5,
        is_active=COALESCE($6,is_active),
        updated_at=NOW() 
       WHERE id=$7 RETURNING *`,
      [name || null, description || null, price || null, stock || null, photo_url, is_active !== undefined ? is_active : null, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Ürün sil (admin - soft delete)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE products SET is_active=FALSE WHERE id=$1', [req.params.id]);
    res.json({ message: 'Ürün kaldırıldı' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
