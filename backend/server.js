require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/barbers', require('./routes/barbers'));
app.use('/api/products', require('./routes/products'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/working-hours', require('./routes/workingHours'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Salon Kartal API çalışıyor' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Salon Kartal Backend port ${PORT}'de çalışıyor`));
