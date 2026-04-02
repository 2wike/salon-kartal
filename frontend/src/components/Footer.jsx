import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark)',
      borderTop: '1px solid rgba(201,168,76,0.15)',
      padding: '60px 0 30px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>
              Salon <span style={{ color: 'var(--gold)' }}>Kartal</span>
            </div>
            <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: '1.7', maxWidth: '220px' }}>
              Profesyonel erkek kuaförü hizmetleriyle stilinizi tamamlıyoruz.
            </p>
          </div>

          <div>
            <div style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Sayfalar</div>
            {[
              { to: '/', label: 'Ana Sayfa' },
              { to: '/hakkimizda', label: 'Hakkımızda' },
              { to: '/ustalarimiz', label: 'Ustalarımız' },
              { to: '/urunler', label: 'Ürünler' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'var(--gray)', fontSize: '14px', marginBottom: '8px', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--white)'}
                onMouseLeave={e => e.target.style.color = 'var(--gray)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <div style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>İletişim</div>
            {[
              { icon: '📍', text: 'Kartal Mah. Örnek Sk. No:1, İstanbul' },
              { icon: '📞', text: '+90 (216) 000 00 00' },
              { icon: '🕐', text: 'Pzt–Cmt: 09:00–19:00' },
            ].map(({ icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', color: 'var(--gray)', fontSize: '14px' }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>

          <div>
            <div style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: '600' }}>Randevu</div>
            <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '16px' }}>
              Online randevu alarak bekleme süresini sıfıra indirin.
            </p>
            <Link to="/ustalarimiz" className="btn btn-gold btn-sm">Randevu Al</Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: 'var(--gray)', fontSize: '13px' }}>© 2024 Salon Kartal. Tüm hakları saklıdır.</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['◆', '◇', '◆'].map((s, i) => (
              <span key={i} style={{ color: i === 1 ? 'var(--gold)' : 'var(--gold-dim)', fontSize: '8px' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
