A full-stack barber shop application where users can register, log in, select a barber, and book appointments.

The system includes an admin panel for managing products, barbers, and appointments. Built with a Docker-based architecture using a Node.js backend, React frontend, and MySQL database.

# 🏛 Salon Kartal — Kurulum Rehberi

## Gereksinimler

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) kurulu olmalı
- [Git](https://git-scm.com/) (opsiyonel, taşıma için)

---

## 🚀 İlk Kurulum (Tek Seferlik)

### 1. Docker Desktop'ı İndir ve Kur

https://www.docker.com/products/docker-desktop/
Kurulduktan sonra Docker'ı başlat (sistem tepsisinde balina simgesi görünmeli)

### 2. Projeyi Çalıştır

Proje klasörüne gel, terminal aç ve şunu yaz:

```bash
docker-compose up --build
```

İlk seferde biraz bekle (~3-5 dakika), paketler indirilecek.

### 3. Siteye Gir

- 🌐 Site: http://localhost:3000
- ⚙ Admin: http://localhost:3000/giris → "Admin Girişi"

---

## 👤 Admin Giriş Bilgileri

```
Email:  admin@salonkartal.com
Şifre:  admin123
```

> ⚠ Canlıya geçmeden önce şifreyi değiştir!

## ✂ Usta Giriş Bilgileri (Şimdilik)

```
ibrahim@salonkartal.com / admin123
baran@salonkartal.com   / admin123
```

---

## 📁 Klasör Yapısı

```
salon-kartal/
├── docker-compose.yml     ← Her şeyi ayağa kaldıran dosya
├── backend/               ← Node.js + Express API
│   ├── routes/            ← API endpoint'leri
│   ├── db/
│   │   ├── init.sql       ← Veritabanı tabloları ve başlangıç verileri
│   │   └── pool.js        ← DB bağlantısı
│   └── server.js
└── frontend/              ← React + Vite
    └── src/
        ├── pages/         ← Sayfalar
        ├── components/    ← Ortak bileşenler
        └── context/       ← Global state
```

---

## 📷 Fotoğraf Ekleme

Fotoğrafları şu klasörlere at:

- **Ustalar:** `backend/uploads/barbers/ibrahim.jpg`, `baran.jpg`
- **Ürünler:** `backend/uploads/products/`
- Fotoğraf boyutları: Ustalar için **400×533px**, Ürünler için **400×400px** önerilir

Admin panelinden de fotoğraf yükleyebilirsin!

---

## 🔄 Günlük Kullanım

```bash
# Başlat
docker-compose up

# Arka planda başlat
docker-compose up -d

# Durdur
docker-compose down

# Logları gör
docker-compose logs -f
```

---

## 💻 Başka Bilgisayara Taşıma

1. Tüm `salon-kartal` klasörünü kopyala (USB veya zip)
2. Hedef bilgisayara Docker Desktop kur
3. Klasörün içinde terminal aç
4. `docker-compose up --build` yaz
5. Bitti! 🎉

---

## 🌐 Canlıya Alma (İleride)

Hosting aldığında:

1. Sunucuya Docker kur
2. Projeyi sunucuya kopyala
3. `.env` dosyasındaki şifreleri güncelle
4. `docker-compose up -d` yaz

---

## 🛠 Admin Panel Özellikleri

- **Ürünler:** Ekle, düzenle, fotoğraf yükle, kaldır
- **Ustalar:** Profil güncelle, fotoğraf değiştir
- **Randevular:** Günlük randevuları gör, onayla/iptal et

## 📅 Usta Takvim Yönetimi

Ustalar `/profil` sayfasından veya admin panelinden:

- Belirli günleri kapalı olarak işaretleyebilir
- Saatlik kapanış ekleyebilir
- Randevu durumlarını güncelleyebilir
