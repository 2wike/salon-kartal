const router = require('express').Router();
const pool = require('../db/pool');
const { auth, barberOrAdmin } = require('../middleware/auth');

// Ustanın müsait saatlerini getir
router.get('/available/:barberId/:date', async (req, res) => {
  const { barberId, date } = req.params;
  try {
    const dayOfWeek = new Date(date).getDay();
    
    // Çalışma saatleri
    const workHours = await pool.query(
      'SELECT * FROM working_hours WHERE barber_id=$1 AND day_of_week=$2',
      [barberId, dayOfWeek]
    );
    
    if (!workHours.rows.length || !workHours.rows[0].is_open) {
      return res.json({ available: false, slots: [], message: 'Bu gün kapalı' });
    }
    
    const { start_time, end_time } = workHours.rows[0];
    
    // Kapalı zaman dilimleri
    const unavailable = await pool.query(
      'SELECT * FROM barber_unavailability WHERE barber_id=$1 AND date=$2',
      [barberId, date]
    );
    
    if (unavailable.rows.some(u => u.is_full_day)) {
      return res.json({ available: false, slots: [], message: 'Bu gün tatil/kapalı' });
    }
    
    // Mevcut randevular
    const existing = await pool.query(
      'SELECT appointment_time FROM appointments WHERE barber_id=$1 AND appointment_date=$2 AND status != $3',
      [barberId, date, 'cancelled']
    );
    
    const bookedTimes = existing.rows.map(r => r.appointment_time.slice(0, 5));
    const blockedRanges = unavailable.rows.filter(u => !u.is_full_day);
    
    // Saatleri 30dk aralıklarla oluştur
    const slots = [];
    let [startH, startM] = start_time.split(':').map(Number);
    let [endH, endM] = end_time.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    
    for (let m = startMins; m < endMins - 30; m += 30) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const timeStr = `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
      
      const isBooked = bookedTimes.includes(timeStr);
      const isBlocked = blockedRanges.some(b => timeStr >= b.start_time.slice(0,5) && timeStr < b.end_time.slice(0,5));
      
      slots.push({ time: timeStr, available: !isBooked && !isBlocked });
    }
    
    res.json({ available: true, slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Randevu oluştur
router.post('/', auth, async (req, res) => {
  const { barber_id, service_id, appointment_date, appointment_time, note } = req.body;
  if (!barber_id || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'Usta, tarih ve saat zorunludur' });
  }
  try {
    // Çakışma kontrolü
    const conflict = await pool.query(
      'SELECT id FROM appointments WHERE barber_id=$1 AND appointment_date=$2 AND appointment_time=$3 AND status != $4',
      [barber_id, appointment_date, appointment_time, 'cancelled']
    );
    if (conflict.rows.length) return res.status(409).json({ error: 'Bu saat dolu' });
    
    const result = await pool.query(
      'INSERT INTO appointments (user_id, barber_id, service_id, appointment_date, appointment_time, note) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.id, barber_id, service_id || null, appointment_date, appointment_time, note || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcının randevuları
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, b.name as barber_name, s.name as service_name 
       FROM appointments a 
       LEFT JOIN barbers b ON a.barber_id=b.id
       LEFT JOIN services s ON a.service_id=s.id
       WHERE a.user_id=$1 ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Ustanın randevuları
router.get('/barber/:barberId', barberOrAdmin, async (req, res) => {
  const { date } = req.query;
  try {
    let query = `SELECT a.*, u.name as customer_name, u.phone as customer_phone, s.name as service_name
                 FROM appointments a
                 LEFT JOIN users u ON a.user_id=u.id
                 LEFT JOIN services s ON a.service_id=s.id
                 WHERE a.barber_id=$1`;
    const params = [req.params.barberId];
    if (date) { query += ' AND a.appointment_date=$2'; params.push(date); }
    query += ' ORDER BY a.appointment_date, a.appointment_time';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Randevu güncelle (usta veya admin)
router.put('/:id', barberOrAdmin, async (req, res) => {
  const { status, note, appointment_date, appointment_time } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET status=COALESCE($1,status), note=COALESCE($2,note), appointment_date=COALESCE($3,appointment_date), appointment_time=COALESCE($4,appointment_time), updated_at=NOW() WHERE id=$5 RETURNING *',
      [status, note, appointment_date, appointment_time, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Randevu iptal (kullanıcı kendi iptal edebilir)
router.delete('/:id', auth, async (req, res) => {
  try {
    const appt = await pool.query('SELECT * FROM appointments WHERE id=$1', [req.params.id]);
    if (!appt.rows.length) return res.status(404).json({ error: 'Randevu bulunamadı' });
    if (appt.rows[0].user_id !== req.user.id && !['admin','barber'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Yetkisiz' });
    }
    await pool.query("UPDATE appointments SET status='cancelled' WHERE id=$1", [req.params.id]);
    res.json({ message: 'Randevu iptal edildi' });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
