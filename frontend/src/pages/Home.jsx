import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import mainImg from "../assets/foto1_mirror.png";

const stats = [
  { number: "12+", label: "Yıl Deneyim" },
  { number: "2298+", label: "Mutlu Müşteri" },
  { number: "2", label: "Usta Kuaför" },
  { number: "5★", label: "Ortalama Puan" },
];

export default function Home() {
  const [homeBarbers, setHomeBarbers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("/api/barbers")
      .then((r) => setHomeBarbers(r.data))
      .catch(() => {});
    // Hizmetler backend'den gelecek, şimdilik statik
    setServices([
      {
        icon: "✂",
        name: "Saç Kesimi",
        desc: "Klasik ve modern kesim teknikleri",
        price: "150₺",
      },
      {
        icon: "🪒",
        name: "Sakal Tıraşı",
        desc: "Geleneksel ustura ile hassas tıraş",
        price: "100₺",
      },
      {
        icon: "✦",
        name: "Saç + Sakal",
        desc: "Komple bakım paketi",
        price: "220₺",
      },
      {
        icon: "⚡",
        name: "Çocuk Kesimi",
        desc: "12 yaş altı özel fiyat",
        price: "100₺",
      },
    ]);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: "var(--black)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "600px",
              height: "600px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "-5%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
            paddingTop: "100px",
          }}
        >
          <div style={{ animation: "slideUp 0.8s ease" }}>
            <div
              style={{
                color: "var(--gold)",
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "16px",
                fontWeight: "600",
              }}
            >
              ◆ &nbsp; İstanbul Kartal'ın Ustası
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(42px, 6vw, 80px)",
                fontWeight: "900",
                lineHeight: "1.05",
                color: "var(--white)",
                marginBottom: "24px",
              }}
            >
              Stil Bir
              <br />
              <span style={{ color: "var(--gold)" }}>Sanattır.</span>
            </h1>
            <p
              style={{
                color: "var(--gray)",
                fontSize: "16px",
                lineHeight: "1.8",
                maxWidth: "420px",
                marginBottom: "36px",
              }}
            >
              15 yılı aşkın deneyimimizle saçınızı ve sakalınızı profesyonel
              ellere bırakın. Klasik barberlık geleneğini modern tekniklerle
              buluşturuyoruz.
            </p>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link to="/ustalarimiz" className="btn btn-gold btn-lg">
                Randevu Al
              </Link>
              <Link to="/hakkimizda" className="btn btn-ghost btn-lg">
                Daha Fazla
              </Link>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "100%",
                paddingBottom: "120%",
                background:
                  "linear-gradient(160deg, var(--dark2) 0%, #1e1e1e 100%)",
                borderRadius: "12px",
                border: "1px solid rgba(201,168,76,0.15)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <img
                src={mainImg}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-2px",
                  left: "20%",
                  right: "20%",
                  height: "3px",
                  background:
                    "linear-gradient(90deg, transparent, var(--gold), transparent)",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "-20px",
                background: "var(--dark)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "8px",
                padding: "16px 20px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  fontFamily: "var(--font-display)",
                  fontWeight: "700",
                  color: "var(--gold)",
                }}
              >
                15+
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--gray)",
                  letterSpacing: "0.06em",
                }}
              >
                Yıl Deneyim
              </div>
            </div>
          </div>
        </div>

        <style>{`@media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } }`}</style>
      </section>

      {/* STATS */}
      <section
        style={{
          padding: "60px 0",
          background: "var(--dark)",
          borderTop: "1px solid rgba(201,168,76,0.1)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "40px",
              textAlign: "center",
            }}
          >
            {stats.map(({ number, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "42px",
                    fontWeight: "700",
                    color: "var(--gold)",
                    lineHeight: 1,
                  }}
                >
                  {number}
                </div>
                <div
                  style={{
                    color: "var(--gray)",
                    fontSize: "13px",
                    marginTop: "6px",
                    letterSpacing: "0.06em",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HİZMETLER */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-subtitle">Neler Yapıyoruz</div>
            <h2 className="section-title">Hizmetlerimiz</h2>
            <div className="gold-divider center" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "24px",
            }}
          >
            {services.map(({ icon, name, desc, price }) => (
              <div key={name} className="card" style={{ padding: "32px 28px" }}>
                <div style={{ fontSize: "36px", marginBottom: "16px" }}>
                  {icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "20px",
                    marginBottom: "8px",
                  }}
                >
                  {name}
                </h3>
                <p
                  style={{
                    color: "var(--gray)",
                    fontSize: "14px",
                    marginBottom: "16px",
                    lineHeight: "1.6",
                  }}
                >
                  {desc}
                </p>
                <div
                  style={{
                    color: "var(--gold)",
                    fontWeight: "600",
                    fontSize: "18px",
                  }}
                >
                  {price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USTALAR - veritabanından */}
      <section className="section" style={{ background: "var(--dark)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div className="section-subtitle">Ekibimiz</div>
            <h2 className="section-title">Ustalarımız</h2>
            <div className="gold-divider center" />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "32px",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {homeBarbers.map((barber) => (
              <div
                key={barber.id}
                className="card"
                style={{ overflow: "hidden" }}
              >
                <div
                  style={{
                    height: "280px",
                    background: "var(--dark2)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {barber.photo_url ? (
                    <img
                      src={barber.photo_url}
                      alt={barber.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--gold-dim)",
                        fontSize: "48px",
                      }}
                    >
                      👤
                    </div>
                  )}
                </div>
                <div style={{ padding: "24px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "20px",
                      marginBottom: "4px",
                    }}
                  >
                    {barber.name}
                  </h3>
                  <div
                    style={{
                      color: "var(--gold)",
                      fontSize: "13px",
                      marginBottom: "16px",
                    }}
                  >
                    {barber.title}
                  </div>
                  <Link
                    to="/ustalarimiz"
                    className="btn btn-outline btn-sm"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Randevu Al
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "100px 0",
          textAlign: "center",
          background:
            "linear-gradient(180deg, var(--black) 0%, rgba(201,168,76,0.05) 50%, var(--black) 100%)",
        }}
      >
        <div className="container">
          <p
            style={{
              color: "var(--gold)",
              fontSize: "12px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Hemen Başlayın
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Farkı Hissedeceksiniz.
          </h2>
          <p
            style={{
              color: "var(--gray)",
              fontSize: "16px",
              maxWidth: "480px",
              margin: "0 auto 40px",
            }}
          >
            Online randevu alın, bekleme stresini unutun. Tam zamanında gelin,
            kusursuz hizmet alın.
          </p>
          <Link to="/ustalarimiz" className="btn btn-gold btn-lg">
            Randevu Al →
          </Link>
        </div>
      </section>
    </div>
  );
}
