import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Giris() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) { setError('Email ve şifre zorunludur'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/login', { email, password, isAdmin });
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş yapılamadı');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Salon <span style={{ color: 'var(--gold)' }}>Kartal</span>
          </div>
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Hesabınıza giriş yapın</p>
        </div>

        <div style={{ background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '36px' }}>
          {isAdmin && (
            <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '6px', padding: '10px 14px', marginBottom: '20px', fontSize: '13px', color: 'var(--gold)', textAlign: 'center' }}>
              ⚙ Admin Girişi
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="ornek@mail.com" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div className="form-group">
              <label className="form-label">Şifre</label>
              <input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>

            {error && (
              <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '4px', padding: '10px 14px', fontSize: '13px', color: '#e74c3c' }}>
                {error}
              </div>
            )}

            <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button onClick={() => { setIsAdmin(!isAdmin); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--gray)', fontSize: '12px', cursor: 'pointer', letterSpacing: '0.04em', textDecoration: 'underline', textDecorationColor: 'rgba(136,136,128,0.3)' }}>
                {isAdmin ? '← Müşteri Girişine Dön' : 'Admin Girişi'}
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '14px', marginTop: '20px' }}>
          Hesabınız yok mu?{' '}
          <Link to="/kayit" style={{ color: 'var(--gold)' }}>Kayıt Olun</Link>
        </p>
      </div>
    </div>
  );
}
