import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/useToast';

const TAB_PRODUCTS = 'products';
const TAB_BARBERS = 'barbers';
const TAB_APPOINTMENTS = 'appointments';

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast, Toast } = useToast();
  const [tab, setTab] = useState(TAB_PRODUCTS);

  useEffect(() => {
    if (!isAdmin) navigate('/giris');
  }, [isAdmin]);

  const tabs = [
    { key: TAB_PRODUCTS, label: '📦 Ürünler' },
    { key: TAB_BARBERS, label: '✂ Ustalar' },
    { key: TAB_APPOINTMENTS, label: '📅 Randevular' },
  ];

  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--black)' }}>
      <div style={{ background: 'var(--dark)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '28px 0' }}>
        <div className="container">
          <p style={{ color: 'var(--gold)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Yönetim Paneli</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px' }}>Admin Dashboard</h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '32px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                padding: '10px 20px', borderRadius: '6px', border: 'none', fontSize: '14px',
                background: tab === t.key ? 'rgba(201,168,76,0.12)' : 'transparent',
                color: tab === t.key ? 'var(--gold)' : 'var(--gray)',
                cursor: 'pointer', transition: 'all 0.2s',
                borderBottom: tab === t.key ? '2px solid var(--gold)' : '2px solid transparent',
              }}>{t.label}</button>
          ))}
        </div>

        {tab === TAB_PRODUCTS && <ProductsPanel showToast={showToast} />}
        {tab === TAB_BARBERS && <BarbersPanel showToast={showToast} />}
        {tab === TAB_APPOINTMENTS && <AppointmentsPanel showToast={showToast} />}
      </div>

      {Toast}
    </div>
  );
}

// ===================== PRODUCTS PANEL =====================
function ProductsPanel({ showToast }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const loadProducts = () => axios.get('/api/products/admin/all').then(r => setProducts(r.data)).catch(() => {});
  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Bu ürünü kaldırmak istiyor musunuz?')) return;
    await axios.delete(`/api/products/${id}`);
    showToast('Ürün kaldırıldı'); loadProducts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>Ürün Yönetimi</h2>
        <button className="btn btn-gold btn-sm" onClick={() => { setEditProduct(null); setShowForm(true); }}>+ Ürün Ekle</button>
      </div>

      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
          onSave={() => { setShowForm(false); setEditProduct(null); loadProducts(); showToast(editProduct ? 'Ürün güncellendi' : 'Ürün eklendi'); }}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {products.map(p => (
          <div key={p.id} className="card" style={{ opacity: p.is_active ? 1 : 0.5 }}>
            <div style={{ height: '160px', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {p.photo_url ? <img src={p.photo_url} alt={p.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '40px', color: 'var(--gold-dim)' }}>🧴</span>}
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{p.name}</h3>
                <span className={`badge ${p.is_active ? 'badge-green' : 'badge-gray'}`}>{p.is_active ? 'Aktif' : 'Pasif'}</span>
              </div>
              {p.description && <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '8px', lineHeight: '1.5' }}>{p.description}</p>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ color: 'var(--gold)', fontWeight: '600' }}>{p.price ? `${p.price}₺` : '—'}</span>
                <span style={{ color: 'var(--gray)', fontSize: '12px' }}>Stok: {p.stock}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => { setEditProduct(p); setShowForm(true); }}>Düzenle</button>
                <button className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }} onClick={() => handleDelete(p.id)}>Kaldır</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onSave }) {
  const [form, setForm] = useState({ name: product?.name || '', description: product?.description || '', price: product?.price || '', stock: product?.stock || 0, is_active: product?.is_active !== false });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name) return;
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('photo', file);
    try {
      if (product) await axios.put(`/api/products/${product.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await axios.post('/api/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSave();
    } catch (err) { alert(err.response?.data?.error || 'Hata'); }
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', padding: '28px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>{product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</h3>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label className="form-label">Ürün Adı *</label>
          <input className="form-input" value={form.name} onChange={set('name')} placeholder="Ürün adını girin" />
        </div>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label className="form-label">Açıklama (Opsiyonel)</label>
          <textarea className="form-input" value={form.description} onChange={set('description')} placeholder="Ürün açıklaması..." style={{ resize: 'vertical', minHeight: '80px' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Fiyat (₺) (Opsiyonel)</label>
          <input className="form-input" type="number" value={form.price} onChange={set('price')} placeholder="0.00" />
        </div>
        <div className="form-group">
          <label className="form-label">Stok</label>
          <input className="form-input" type="number" value={form.stock} onChange={set('stock')} />
        </div>
        <div className="form-group">
          <label className="form-label">Fotoğraf (Opsiyonel)</label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
          <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current.click()}>
            {file ? `✓ ${file.name}` : product?.photo_url ? 'Fotoğrafı Değiştir' : 'Fotoğraf Seç'}
          </button>
        </div>
        <div className="form-group">
          <label className="form-label">Durum</label>
          <select className="form-input" value={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'true' }))}>
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button className="btn btn-gold" onClick={handleSave} disabled={loading || !form.name}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</button>
        <button className="btn btn-ghost" onClick={onClose}>İptal</button>
      </div>
    </div>
  );
}

// ===================== BARBERS PANEL =====================
function BarbersPanel({ showToast }) {
  const [barbers, setBarbers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBarber, setEditBarber] = useState(null);

  const loadBarbers = () => axios.get('/api/barbers').then(r => setBarbers(r.data)).catch(() => {});
  useEffect(() => { loadBarbers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Bu ustayı kaldırmak istiyor musunuz?')) return;
    await axios.delete(`/api/barbers/${id}`);
    showToast('Usta kaldırıldı'); loadBarbers();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>Usta Yönetimi</h2>
        <button className="btn btn-gold btn-sm" onClick={() => { setEditBarber(null); setShowForm(true); }}>+ Usta Ekle</button>
      </div>

      {showForm && (
        <BarberForm
          barber={editBarber}
          onClose={() => { setShowForm(false); setEditBarber(null); }}
          onSave={() => { setShowForm(false); setEditBarber(null); loadBarbers(); showToast(editBarber ? 'Usta güncellendi' : 'Usta eklendi'); }}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {barbers.map(b => (
          <div key={b.id} className="card">
            <div style={{ height: '200px', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {b.photo_url ? <img src={b.photo_url} alt={b.name} style={{ height: '100%', width: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '52px' }}>👤</span>}
            </div>
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '4px' }}>{b.name}</h3>
              <p style={{ color: 'var(--gold)', fontSize: '13px', marginBottom: '12px' }}>{b.title}</p>
              {b.description && <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>{b.description.slice(0, 100)}...</p>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => { setEditBarber(b); setShowForm(true); }}>Düzenle</button>
                <button className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }} onClick={() => handleDelete(b.id)}>Kaldır</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarberForm({ barber, onClose, onSave }) {
  const [form, setForm] = useState({ name: barber?.name || '', title: barber?.title || '', description: barber?.description || '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.name) return;
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('photo', file);
    try {
      if (barber) await axios.put(`/api/barbers/${barber.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await axios.post('/api/barbers', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSave();
    } catch (err) { alert(err.response?.data?.error || 'Hata'); }
    setLoading(false);
  };

  return (
    <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', padding: '28px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>{barber ? 'Ustayı Düzenle' : 'Yeni Usta Ekle'}</h3>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Ad Soyad *</label>
          <input className="form-input" value={form.name} onChange={set('name')} placeholder="İsim Soyisim Usta" />
        </div>
        <div className="form-group">
          <label className="form-label">Ünvan</label>
          <input className="form-input" value={form.title} onChange={set('title')} placeholder="Baş Kuaför" />
        </div>
        <div className="form-group">
          <label className="form-label">Açıklama</label>
          <textarea className="form-input" value={form.description} onChange={set('description')} placeholder="Usta hakkında kısa bir açıklama..." style={{ resize: 'vertical', minHeight: '100px' }} />
        </div>
        <div className="form-group">
          <label className="form-label">Fotoğraf</label>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
          <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current.click()}>
            {file ? `✓ ${file.name}` : barber?.photo_url ? 'Fotoğrafı Değiştir' : 'Fotoğraf Seç'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-gold" onClick={handleSave} disabled={loading || !form.name}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</button>
          <button className="btn btn-ghost" onClick={onClose}>İptal</button>
        </div>
      </div>
    </div>
  );
}

// ===================== APPOINTMENTS PANEL =====================
function AppointmentsPanel({ showToast }) {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get('/api/barbers').then(r => { setBarbers(r.data); if (r.data.length) setSelectedBarber(r.data[0].id); });
  }, []);

  useEffect(() => {
    if (!selectedBarber) return;
    axios.get(`/api/appointments/barber/${selectedBarber}?date=${date}`).then(r => setAppointments(r.data)).catch(() => {});
  }, [selectedBarber, date]);

  const statusColors = { pending: 'badge-gold', confirmed: 'badge-green', cancelled: 'badge-red', completed: 'badge-gray' };
  const statusLabels = { pending: 'Bekliyor', confirmed: 'Onaylandı', cancelled: 'İptal', completed: 'Tamamlandı' };

  const updateStatus = async (id, status) => {
    await axios.put(`/api/appointments/${id}`, { status });
    showToast('Durum güncellendi');
    axios.get(`/api/appointments/barber/${selectedBarber}?date=${date}`).then(r => setAppointments(r.data));
  };

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', marginBottom: '24px' }}>Randevu Yönetimi</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label">Usta</label>
          <select className="form-input" value={selectedBarber} onChange={e => setSelectedBarber(e.target.value)}>
            {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label className="form-label">Tarih</label>
          <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
      </div>

      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray)' }}>Bu tarihte randevu bulunamadı.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {appointments.map(a => (
            <div key={a.id} style={{ background: 'var(--dark2)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: '600', fontSize: '16px' }}>{a.appointment_time?.slice(0,5)}</span>
                  <span style={{ fontWeight: '500' }}>{a.customer_name}</span>
                  {a.customer_phone && <span style={{ color: 'var(--gray)', fontSize: '13px' }}>{a.customer_phone}</span>}
                  <span className={`badge ${statusColors[a.status]}`}>{statusLabels[a.status]}</span>
                </div>
                {a.service_name && <p style={{ color: 'var(--gray)', fontSize: '13px' }}>Hizmet: {a.service_name}</p>}
                {a.note && <p style={{ color: 'var(--gray)', fontSize: '13px', fontStyle: 'italic' }}>Not: "{a.note}"</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {a.status === 'pending' && <button className="btn btn-sm" style={{ background: 'rgba(46,204,113,0.1)', color: '#2ecc71', border: '1px solid rgba(46,204,113,0.3)' }} onClick={() => updateStatus(a.id, 'confirmed')}>Onayla</button>}
                {a.status !== 'cancelled' && a.status !== 'completed' && <button className="btn btn-sm" style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)' }} onClick={() => updateStatus(a.id, 'cancelled')}>İptal</button>}
                {a.status === 'confirmed' && <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.1)' }} onClick={() => updateStatus(a.id, 'completed')}>Tamamlandı</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
