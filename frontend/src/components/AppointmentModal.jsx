import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
const MONTHS = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

export default function AppointmentModal({ barber, onClose, onSuccess }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=tarih, 2=saat+not
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/appointments/available/1/2024-01-01').catch(() => {}); // warm up
    // Load services from backend (static for now)
    setServices([
      { id: 1, name: 'Saç Kesimi', price: 150, duration: 30 },
      { id: 2, name: 'Sakal Tıraşı', price: 100, duration: 20 },
      { id: 3, name: 'Saç + Sakal', price: 220, duration: 45 },
      { id: 4, name: 'Çocuk Kesimi', price: 100, duration: 20 },
      { id: 5, name: 'Fön & Şekillendirme', price: 130, duration: 30 },
    ]);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const formatDate = (y, m, d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

  const handleDateSelect = async (day) => {
    const { year, month } = getDaysInMonth(currentMonth);
    const dateStr = formatDate(year, month, day);
    const today = new Date(); today.setHours(0,0,0,0);
    const selected = new Date(dateStr);
    if (selected < today) return;
    
    setSelectedDate(dateStr);
    setSelectedTime(null);
    setSlotsLoading(true);
    try {
      const res = await axios.get(`/api/appointments/available/${barber.id}/${dateStr}`);
      setSlots(res.data.slots || []);
    } catch {
      setSlots([]);
    }
    setSlotsLoading(false);
    setStep(2);
  };

  const handleBook = async () => {
    if (!user) { navigate('/giris'); return; }
    if (!selectedTime) { setError('Lütfen bir saat seçin'); return; }
    setLoading(true); setError('');
    try {
      await axios.post('/api/appointments', {
        barber_id: barber.id,
        service_id: selectedService || null,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        note: note || null,
      });
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Randevu alınamadı');
    }
    setLoading(false);
  };

  const { firstDay, daysInMonth, year, month } = getDaysInMonth(currentMonth);
  const today = new Date(); today.setHours(0,0,0,0);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div>
            <p style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.1em', marginBottom: '4px' }}>RANdEVU AL</p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>{barber.name}</h3>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Step indicators */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
            {['Tarih Seç', 'Saat & Detay'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: step > i ? 'var(--gold)' : step === i+1 ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${step >= i+1 ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: step > i ? 'var(--black)' : 'var(--gold)',
                  fontWeight: '600',
                }}>{step > i ? '✓' : i+1}</div>
                <span style={{ fontSize: '13px', color: step === i+1 ? 'var(--white)' : 'var(--gray)' }}>{label}</span>
                {i === 0 && <span style={{ color: 'var(--gray)', margin: '0 4px' }}>›</span>}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              {/* Calendar header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <button onClick={() => setCurrentMonth(new Date(year, month-1))} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '18px', padding: '4px 8px' }}>‹</button>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>{MONTHS[month]} {year}</span>
                <button onClick={() => setCurrentMonth(new Date(year, month+1))} style={{ background: 'none', border: 'none', color: 'var(--gold)', fontSize: '18px', padding: '4px 8px' }}>›</button>
              </div>
              
              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: '11px', color: 'var(--gray)', padding: '6px 0', letterSpacing: '0.06em' }}>{d}</div>)}
              </div>
              
              {/* Days grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const dateStr = formatDate(year, month, day);
                  const isPast = new Date(dateStr) < today;
                  const isSelected = selectedDate === dateStr;
                  const isToday = new Date(dateStr).toDateString() === today.toDateString();
                  return (
                    <button key={day} onClick={() => !isPast && handleDateSelect(day)}
                      style={{
                        padding: '10px 4px', borderRadius: '6px', border: 'none',
                        background: isSelected ? 'var(--gold)' : isToday ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                        color: isPast ? 'rgba(255,255,255,0.15)' : isSelected ? 'var(--black)' : 'var(--white)',
                        fontSize: '13px', fontWeight: isSelected ? '600' : '400',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => !isPast && !isSelected && (e.target.style.background = 'rgba(201,168,76,0.15)')}
                      onMouseLeave={e => !isSelected && (e.target.style.background = isToday ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)')}
                    >{day}</button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'var(--gray)', padding: '6px 12px', fontSize: '13px' }}>‹ Tarih</button>
                <span style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: '500' }}>
                  {new Date(selectedDate).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>

              {/* Hizmet seç */}
              <div className="form-group">
                <label className="form-label">Hizmet (Opsiyonel)</label>
                <select className="form-input" value={selectedService} onChange={e => setSelectedService(e.target.value)}>
                  <option value="">Seçiniz...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.name} — {s.price}₺</option>)}
                </select>
              </div>

              {/* Saat seç */}
              <div>
                <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Saat Seçin</label>
                {slotsLoading ? (
                  <div className="loading" style={{ padding: '30px' }}>Saatler yükleniyor...</div>
                ) : slots.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--gray)', padding: '24px' }}>Bu gün için müsait saat bulunamadı.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {slots.map(slot => (
                      <button key={slot.time} onClick={() => slot.available && setSelectedTime(slot.time)}
                        style={{
                          padding: '10px 4px', borderRadius: '6px', fontSize: '13px',
                          border: `1px solid ${selectedTime === slot.time ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                          background: selectedTime === slot.time ? 'var(--gold)' : !slot.available ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                          color: selectedTime === slot.time ? 'var(--black)' : !slot.available ? 'rgba(255,255,255,0.2)' : 'var(--white)',
                          cursor: slot.available ? 'pointer' : 'not-allowed',
                          textDecoration: !slot.available ? 'line-through' : 'none',
                          transition: 'all 0.15s',
                        }}
                      >{slot.time}</button>
                    ))}
                  </div>
                )}
              </div>

              {/* Not */}
              <div className="form-group">
                <label className="form-label">Ustaya Not Bırak (Opsiyonel)</label>
                <textarea className="form-input" placeholder="Örn: Üstten kısa, yandan uzun bırak..." value={note} onChange={e => setNote(e.target.value)}
                  style={{ resize: 'vertical', minHeight: '80px' }}
                />
              </div>

              {error && <div style={{ color: '#e74c3c', fontSize: '13px', background: 'rgba(231,76,60,0.1)', padding: '10px 14px', borderRadius: '4px' }}>{error}</div>}

              {!user && (
                <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '14px 16px', fontSize: '13px', color: 'var(--gold)' }}>
                  Randevu almak için giriş yapmanız gerekiyor.
                </div>
              )}

              <button onClick={handleBook} disabled={loading || !selectedTime}
                className="btn btn-gold" style={{ width: '100%', opacity: (!selectedTime || loading) ? 0.5 : 1 }}>
                {loading ? 'Randevu Alınıyor...' : user ? 'Randevuyu Onayla' : 'Giriş Yap & Randevu Al'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
