import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS = { pending: { label: 'Bekliyor', cls: 'badge-gold' }, confirmed: { label: 'Onaylandı', cls: 'badge-green' }, cancelled: { label: 'İptal', cls: 'badge-red' }, completed: { label: 'Tamamlandı', cls: 'badge-gray' } };

export default function Profil() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/appointments/my').then(r => { setAppointments(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Randevuyu iptal etmek istiyor musunuz?')) return;
    await axios.delete(`/api/appointments/${id}`);
    setAppointments(a => a.map(x => x.id === id ? { ...x, status: 'cancelled' } : x));
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ marginBottom: '40px' }}>
          <p className="section-subtitle">Hesabım</p>
          <h1 className="section-title">{user?.name}</h1>
          <div className="gold-divider" />
          <p style={{ color: 'var(--gray)', marginTop: '12px', fontSize: '14px' }}>{user?.email}</p>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '20px' }}>Randevularım</h2>

        {loading ? (
          <div className="loading">Yükleniyor...</div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray)', background: 'var(--dark2)', borderRadius: '8px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
            <p>Henüz randevunuz bulunmuyor.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {appointments.map(a => (
              <div key={a.id} style={{ background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: '600' }}>
                      {new Date(a.appointment_date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} — {a.appointment_time?.slice(0,5)}
                    </span>
                    <span className={`badge ${STATUS[a.status]?.cls}`}>{STATUS[a.status]?.label}</span>
                  </div>
                  <p style={{ color: 'var(--gray-light)', fontSize: '14px' }}>
                    {a.barber_name}
                    {a.service_name && ` · ${a.service_name}`}
                  </p>
                  {a.note && <p style={{ color: 'var(--gray)', fontSize: '13px', fontStyle: 'italic', marginTop: '4px' }}>"{a.note}"</p>}
                </div>
                {a.status === 'pending' && (
                  <button className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }} onClick={() => handleCancel(a.id)}>İptal Et</button>
                )}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button className="btn btn-ghost btn-sm" onClick={logout}>Çıkış Yap</button>
        </div>
      </div>
    </div>
  );
}
