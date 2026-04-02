export default function Hakkimizda() {
  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <p className="section-subtitle">Biz Kimiz</p>
          <h1 className="section-title">Hakkımızda</h1>
          <div className="gold-divider center" />
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              {/* PHOTO PLACEHOLDER */}
              <div style={{
                width: '100%', paddingBottom: '110%',
                background: 'var(--dark2)', borderRadius: '8px',
                border: '1px solid rgba(201,168,76,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: '12px',
                color: 'var(--gold-dim)', position: 'relative',
              }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '48px' }}>🏠</span>
                  <span style={{ fontSize: '12px', opacity: 0.5 }}>[ SALON FOTOĞRAFI ]</span>
                  <span style={{ fontSize: '11px', color: 'var(--gray)', opacity: 0.4 }}>Önerilen: 600×660px</span>
                </div>
              </div>
            </div>

            <div>
              <p className="section-subtitle">Hikayemiz</p>
              <h2 className="section-title" style={{ marginBottom: '16px' }}>15 Yılı Aşkın Bir Tutku</h2>
              <div className="gold-divider" />
              <p style={{ color: 'var(--gray)', lineHeight: '1.9', marginBottom: '20px', marginTop: '24px' }}>
                Salon Kartal, 2009 yılında İbrahim Usta'nın derin tutkusu ve uzmanlığıyla İstanbul Kartal'ın kalbinde kapılarını açtı. Küçük bir dükkan olarak başlayan bu serüven, yıllar içinde bölgenin en güvenilen erkek kuaförü haline geldi.
              </p>
              <p style={{ color: 'var(--gray)', lineHeight: '1.9', marginBottom: '20px' }}>
                Müşterilerimize sadece saç kesimi değil; özgüven, tarz ve en önemlisi dinlenme deneyimi sunuyoruz. Her sandalye, bir sohbete; her makas, bir karizma hikâyesine dönüşür.
              </p>
              <p style={{ color: 'var(--gray)', lineHeight: '1.9' }}>
                Bugün İbrahim Usta ve Baran Usta ile güçlü ekibimiz, geleneksel berberlık sanatını modern tekniklerle harmanlayarak binlerce müşterimize hizmet vermektedir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--dark)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className="section-subtitle">Değerlerimiz</p>
            <h2 className="section-title">Fark Yaratanlar</h2>
            <div className="gold-divider center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '✦', title: 'Kalite', desc: 'Her kesimde en yüksek kalite standartlarını hedefliyoruz.' },
              { icon: '⏰', title: 'Dakiklik', desc: 'Zamanınıza saygı gösteriyor, randevulara tam zamanında hazır oluyoruz.' },
              { icon: '🤝', title: 'Güven', desc: '15 yıldır binlerce müşterimizin güvenini kazandık ve sürdürdük.' },
              { icon: '✂', title: 'Ustalık', desc: 'Sürekli kendinizi geliştiren ustalarımızla daima güncel teknikler.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: '36px 28px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', color: 'var(--gold)', marginBottom: '16px' }}>{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', marginBottom: '10px' }}>{title}</h3>
                <p style={{ color: 'var(--gray)', fontSize: '14px', lineHeight: '1.7' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery placeholders */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <p className="section-subtitle">Salonumuz</p>
            <h2 className="section-title">Galeri</h2>
            <div className="gold-divider center" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{
                paddingBottom: '75%', position: 'relative',
                background: 'var(--dark2)', borderRadius: '6px',
                border: '1px solid rgba(201,168,76,0.1)',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--gold-dim)' }}>
                  <span style={{ fontSize: '24px' }}>📷</span>
                  <span style={{ fontSize: '11px', opacity: 0.5 }}>[ Galeri {i} ]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
