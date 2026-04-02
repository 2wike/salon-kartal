import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        padding: '0 24px',
        background: scrolled ? 'rgba(10,10,10,0.97)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
        height: '72px',
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: '700', color: 'var(--black)',
              fontFamily: 'var(--font-display)',
            }}>K</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '700', color: 'var(--white)', letterSpacing: '0.02em' }}>
              Salon <span style={{ color: 'var(--gold)' }}>Kartal</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
            {[
              { to: '/', label: 'Ana Sayfa' },
              { to: '/hakkimizda', label: 'Hakkımızda' },
              { to: '/ustalarimiz', label: 'Ustalarımız' },
              { to: '/urunler', label: 'Ürünler' },
            ].map(({ to, label }) => (
              <Link key={to} to={to} style={{
                fontSize: '14px', fontWeight: '400', letterSpacing: '0.04em',
                color: location.pathname === to ? 'var(--gold)' : 'var(--gray-light)',
                transition: 'color 0.2s',
                position: 'relative',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--white)'}
              onMouseLeave={e => e.target.style.color = location.pathname === to ? 'var(--gold)' : 'var(--gray-light)'}
              >{label}</Link>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!user ? (
              <>
                <Link to="/giris" className="btn btn-ghost btn-sm">Giriş Yap</Link>
                <Link to="/kayit" className="btn btn-ghost btn-sm">Kayıt Ol</Link>
                <Link to="/ustalarimiz" className="btn btn-gold btn-sm">Randevu Al</Link>
              </>
            ) : (
              <>
                {isAdmin && <Link to="/admin" className="btn btn-outline btn-sm">⚙ Admin</Link>}
                <div style={{ position: 'relative' }}>
                  <button
                    style={{
                      background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)',
                      borderRadius: '50px', padding: '8px 16px',
                      color: 'var(--gold)', fontSize: '13px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <span>👤</span> {user.name?.split(' ')[0]}
                  </button>
                  {menuOpen && (
                    <div style={{
                      position: 'absolute', top: '110%', right: 0,
                      background: 'var(--dark)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 'var(--radius-lg)', padding: '8px',
                      minWidth: '160px', boxShadow: 'var(--shadow)',
                    }}>
                      <Link to="/profil" style={{ display: 'block', padding: '10px 12px', fontSize: '14px', color: 'var(--white)', borderRadius: 'var(--radius)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >Profilim</Link>
                      <button onClick={handleLogout} style={{
                        display: 'block', width: '100%', padding: '10px 12px',
                        fontSize: '14px', color: '#e74c3c',
                        background: 'none', border: 'none', textAlign: 'left',
                        borderRadius: 'var(--radius)', cursor: 'pointer',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >Çıkış Yap</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
    </>
  );
}
