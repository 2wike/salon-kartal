import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Kayit() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { setError('Ad, email ve şifre zorunludur'); return; }
    if (form.password !== form.password2) { setError('Şifreler eşleşmiyor'); return; }
    if (form.password.length < 6) { setError('Şifre en az 6 karakter olmalıdır'); return; }
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/auth/register', { name: form.name, email: form.email, phone: form.phone, password: form.password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt yapılamadı');
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
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Yeni hesap oluşturun</p>
        </div>

        <div style={{ background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '36px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { key: 'name', label: 'Ad Soyad', placeholder: 'Ahmet Yılmaz', type: 'text' },
              { key: 'email', label: 'Email', placeholder: 'ornek@mail.com', type: 'email' },
              { key: 'phone', label: 'Telefon (Opsiyonel)', placeholder: '+90 5XX XXX XX XX', type: 'tel' },
              { key: 'password', label: 'Şifre', placeholder: '••••••••', type: 'password' },
              { key: 'password2', label: 'Şifre Tekrar', placeholder: '••••••••', type: 'password' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" type={type} placeholder={placeholder} value={form[key]} onChange={set(key)} />
              </div>
            ))}

            {error && (
              <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '4px', padding: '10px 14px', fontSize: '13px', color: '#e74c3c' }}>
                {error}
              </div>
            )}

            <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
              onClick={handleSubmit} disabled={loading}>
              {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--gray)', fontSize: '14px', marginTop: '20px' }}>
          Zaten hesabınız var mı?{' '}
          <Link to="/giris" style={{ color: 'var(--gold)' }}>Giriş Yapın</Link>
        </p>
      </div>
    </div>
  );
}
