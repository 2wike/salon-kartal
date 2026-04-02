-- ============================================
-- SALON KARTAL - VERİTABANI ŞEMASI
-- ============================================

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'barber')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ustalar tablosu
CREATE TABLE IF NOT EXISTS barbers (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) DEFAULT 'Usta Kuaför',
  description TEXT,
  photo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  photo_url VARCHAR(500),
  stock INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hizmetler tablosu (randevu için)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  duration_minutes INT DEFAULT 30,
  price DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE
);

-- Randevular tablosu
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  barber_id INT REFERENCES barbers(id) ON DELETE CASCADE,
  service_id INT REFERENCES services(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ustaların kapalı zaman dilimleri
CREATE TABLE IF NOT EXISTS barber_unavailability (
  id SERIAL PRIMARY KEY,
  barber_id INT REFERENCES barbers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  reason VARCHAR(200),
  is_full_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Çalışma saatleri tablosu
CREATE TABLE IF NOT EXISTS working_hours (
  id SERIAL PRIMARY KEY,
  barber_id INT REFERENCES barbers(id) ON DELETE CASCADE,
  day_of_week INT CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Pazar, 1=Pazartesi...
  start_time TIME DEFAULT '09:00',
  end_time TIME DEFAULT '19:00',
  is_open BOOLEAN DEFAULT TRUE
);

-- ============================================
-- BAŞLANGIÇ VERİLERİ
-- ============================================

-- Admin kullanıcısı (şifre: admin123)
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@salonkartal.com', '$2b$10$rQZ9uAVKJ7QW5KQi8N5xaO8J7YZ6VGBQn1mK2pL4sT8uR3dE9fH2W', 'admin')
ON CONFLICT DO NOTHING;

-- Ustalar
INSERT INTO users (name, email, password_hash, role)
VALUES 
  ('Ibrahim Usta', 'ibrahim@salonkartal.com', '$2b$10$rQZ9uAVKJ7QW5KQi8N5xaO8J7YZ6VGBQn1mK2pL4sT8uR3dE9fH2W', 'barber'),
  ('Baran Usta', 'baran@salonkartal.com', '$2b$10$rQZ9uAVKJ7QW5KQi8N5xaO8J7YZ6VGBQn1mK2pL4sT8uR3dE9fH2W', 'barber')
ON CONFLICT DO NOTHING;

INSERT INTO barbers (name, title, description, photo_url)
VALUES 
  ('İbrahim Usta', 'Baş Kuaför & Kurucu', '15 yılı aşkın deneyimiyle İbrahim Usta, klasik erkek kesimlerinden modern stillere kadar her teknikte ustadır. Müşteri memnuniyetini her şeyin önünde tutarak, her kesimde mükemmeliyeti hedefler.', '/uploads/barbers/ibrahim.jpg'),
  ('Baran Usta', 'Saç Uzmanı & Stilist', 'Genç ve dinamik bir profesyonel olan Baran Usta, güncel trendleri takip ederek müşterilerine en modern görünümü sunar. Fade tekniklerinde ve sakal şekillendirmede uzmanlaşmıştır.', '/uploads/barbers/baran.jpg')
ON CONFLICT DO NOTHING;

-- Hizmetler
INSERT INTO services (name, duration_minutes, price)
VALUES
  ('Saç Kesimi', 30, 150),
  ('Sakal Tıraşı', 20, 100),
  ('Saç + Sakal', 45, 220),
  ('Çocuk Kesimi', 20, 100),
  ('Fön & Şekillendirme', 30, 130)
ON CONFLICT DO NOTHING;

-- Örnek ürünler
INSERT INTO products (name, description, price, stock)
VALUES
  ('Wax - Güçlü Tutuş', 'Yüksek tutuşlu saç şekillendirme wax''ı. Mat görünüm sağlar.', 120, 50),
  ('Pomade - Islak Görünüm', 'Klasik ıslak görünüm için su bazlı pomad. Kolay yıkanır.', 135, 40),
  ('Sakal Yağı', 'Sakalı yumuşatır, besler ve hoş bir koku bırakır. 30ml.', 90, 60),
  ('Şampuan - Erkek', 'Erkek saçı için özel formüllü derinlemesine temizleyici şampuan. 300ml.', 75, 80)
ON CONFLICT DO NOTHING;

-- Çalışma saatleri (İbrahim - barber_id 1)
INSERT INTO working_hours (barber_id, day_of_week, start_time, end_time, is_open)
VALUES
  (1, 0, '10:00', '18:00', FALSE), -- Pazar kapalı
  (1, 1, '09:00', '19:00', TRUE),
  (1, 2, '09:00', '19:00', TRUE),
  (1, 3, '09:00', '19:00', TRUE),
  (1, 4, '09:00', '19:00', TRUE),
  (1, 5, '09:00', '19:00', TRUE),
  (1, 6, '10:00', '17:00', TRUE), -- Cumartesi
-- Baran (barber_id 2)
  (2, 0, '10:00', '18:00', FALSE),
  (2, 1, '09:00', '19:00', TRUE),
  (2, 2, '09:00', '19:00', TRUE),
  (2, 3, '09:00', '19:00', TRUE),
  (2, 4, '09:00', '19:00', TRUE),
  (2, 5, '09:00', '19:00', TRUE),
  (2, 6, '10:00', '17:00', TRUE)
ON CONFLICT DO NOTHING;
