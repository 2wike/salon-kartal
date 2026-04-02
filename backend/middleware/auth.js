const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'salon_kartal_secret';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Yetkisiz erişim' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

const adminOnly = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin yetkisi gerekli' });
    next();
  });
};

const barberOrAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (!['admin', 'barber'].includes(req.user.role)) return res.status(403).json({ error: 'Yetersiz yetki' });
    next();
  });
};

module.exports = { auth, adminOnly, barberOrAdmin };
