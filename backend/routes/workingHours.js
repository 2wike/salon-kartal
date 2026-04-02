const router = require('express').Router();
const pool = require('../db/pool');
const { barberOrAdmin } = require('../middleware/auth');

// Ustanın çalışma saatlerini getir
router.get('/:barberId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM working_hours WHERE barber_id=$1 ORDER BY day_of_week',
      [req.params.barberId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Çalışma saatlerini güncelle
router.put('/:barberId', barberOrAdmin, async (req, res) => {
  const { hours } = req.body; // [{day_of_week, start_time, end_time, is_open}]
  try {
    for (const h of hours) {
      await pool.query(
        `INSERT INTO working_hours (barber_id, day_of_week, start_time, end_time, is_open)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (barber_id, day_of_week) DO UPDATE
         SET start_time=$3, end_time=$4, is_open=$5`,
        [req.params.barberId, h.day_of_week, h.start_time, h.end_time, h.is_open]
      );
    }
    res.json({ message: 'Çalışma saatleri güncellendi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kapalı günler listesi
router.get('/:barberId/unavailability', async (req, res) => {
  const { month, year } = req.query;
  try {
    let query = 'SELECT * FROM barber_unavailability WHERE barber_id=$1';
    const params = [req.params.barberId];
    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM date)=$2 AND EXTRACT(YEAR FROM date)=$3`;
      params.push(month, year);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kapalı gün ekle
router.post('/:barberId/unavailability', barberOrAdmin, async (req, res) => {
  const { date, start_time, end_time, reason, is_full_day } = req.body;
  if (!date) return res.status(400).json({ error: 'Tarih zorunludur' });
  try {
    const result = await pool.query(
      'INSERT INTO barber_unavailability (barber_id, date, start_time, end_time, reason, is_full_day) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.params.barberId, date, start_time || null, end_time || null, reason || null, is_full_day || false]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kapalı gün sil
router.delete('/:barberId/unavailability/:id', barberOrAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM barber_unavailability WHERE id=$1 AND barber_id=$2', [req.params.id, req.params.barberId]);
    res.json({ message: 'Silindi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
