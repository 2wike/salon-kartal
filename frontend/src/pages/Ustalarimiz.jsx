import { useState, useEffect } from 'react';
import axios from 'axios';
import AppointmentModal from '../components/AppointmentModal';
import { useToast } from '../context/useToast';

export default function Ustalarimiz() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const { showToast, Toast } = useToast();

  useEffect(() => {
    axios.get('/api/barbers').then(res => {
      setBarbers(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <p className="section-subtitle">Ekibimiz</p>
          <h1 className="section-title">Ustalarımız</h1>
          <div className="gold-divider center" />
          <p style={{ color: 'var(--gray)', marginTop: '20px', fontSize: '15px', maxWidth: '480px', margin: '20px auto 0' }}>
            Uzman kadromuzdan randevu alın, bekleme süresini sıfıra indirin.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading">Ustalar yükleniyor...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '48px',
              maxWidth: '900px',
              margin: '0 auto',
            }}>
              {barbers.map((barber, idx) => (
                <div key={barber.id} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: idx % 2 === 0 ? 'flex-end' : 'flex-start',
                  gap: '0',
                }}>
                  {/* Photo */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '3/4',
                    background: 'var(--dark2)',
                    borderRadius: '8px',
                    border: '1px solid rgba(201,168,76,0.15)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {barber.photo_url ? (
                      <img
                        src={barber.photo_url}
                        alt={barber.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: '10px', color: 'var(--gold-dim)',
                      }}>
                        <span style={{ fontSize: '64px' }}>👤</span>
                        <span style={{ fontSize: '12px', opacity: 0.5 }}>[ {barber.name.split(' ')[0].toLowerCase()}.jpg ]</span>
                        <span style={{ fontSize: '11px', color: 'var(--gray)', opacity: 0.4 }}>Önerilen: 400×533px</span>
                      </div>
                    )}

                    {/* Overlay gradient */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    }} />
                  </div>

                  {/* Info card */}
                  <div style={{
                    background: 'var(--dark)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderTop: '2px solid var(--gold)',
                    borderRadius: '0 0 8px 8px',
                    padding: '28px 32px 32px',
                    width: '100%',
                  }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', marginBottom: '4px' }}>{barber.name}</h2>
                    <p style={{ color: 'var(--gold)', fontSize: '13px', letterSpacing: '0.06em', marginBottom: '16px' }}>{barber.title}</p>
                    
                    {barber.description && (
                      <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: '1.8', marginBottom: '24px' }}>
                        {barber.description}
                      </p>
                    )}

                    <button
                      className="btn btn-gold"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => setSelectedBarber(barber)}
                    >
                      Randevu Al — {barber.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedBarber && (
        <AppointmentModal
          barber={selectedBarber}
          onClose={() => setSelectedBarber(null)}
          onSuccess={() => {
            setSelectedBarber(null);
            showToast('Randevunuz başarıyla alındı! 🎉');
          }}
        />
      )}

      {Toast}
    </div>
  );
}
