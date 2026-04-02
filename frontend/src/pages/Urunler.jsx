import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Urunler() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/products').then(res => {
      setProducts(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <p className="section-subtitle">Koleksiyonumuz</p>
          <h1 className="section-title">Ürünlerimiz</h1>
          <div className="gold-divider center" />
          <p style={{ color: 'var(--gray)', marginTop: '20px', fontSize: '15px', maxWidth: '480px', margin: '20px auto 0' }}>
            Uzman kuaförlerimizin kullandığı ve önerdiği premium saç & sakal bakım ürünleri.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="loading">Ürünler yükleniyor...</div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <p>Henüz ürün eklenmemiş.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '28px' }}>
              {products.map(product => (
                <div key={product.id} className="card">
                  {/* Product image */}
                  <div style={{ height: '240px', background: 'var(--dark)', position: 'relative', overflow: 'hidden' }}>
                    {product.photo_url ? (
                      <img src={product.photo_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--gold-dim)' }}>
                        <span style={{ fontSize: '48px' }}>🧴</span>
                        <span style={{ fontSize: '11px', opacity: 0.5 }}>[ Ürün Görseli ]</span>
                      </div>
                    )}
                  </div>

                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px' }}>{product.name}</h3>
                    {product.description && (
                      <p style={{ color: 'var(--gray)', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px' }}>{product.description}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {product.price ? (
                        <span style={{ color: 'var(--gold)', fontSize: '20px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>{Number(product.price).toFixed(0)}₺</span>
                      ) : (
                        <span style={{ color: 'var(--gray)', fontSize: '14px' }}>Fiyat belirtilmemiş</span>
                      )}
                      {product.stock > 0 ? (
                        <span className="badge badge-green">Stokta</span>
                      ) : (
                        <span className="badge badge-gray">Tükendi</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
