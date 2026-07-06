import { readContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const data = readContent();
  const { hero, about, cases, services, contact } = data;

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <span className="nav-logo">Настя</span>
          <ul className="nav-links">
            <li><a href="#about">Обо мне</a></li>
            <li><a href="#cases">Кейсы</a></li>
            <li><a href="#services">Услуги</a></li>
            <li><a href="#contact">Контакты</a></li>
          </ul>
        </div>
      </nav>

      <section id="hero">
        <div className="container hero">
          <div>
            <span className="eyebrow">{hero.eyebrow}</span>
            <h1>{hero.title}</h1>
            <p className="hero-subtitle">{hero.subtitle}</p>
            <a className="hero-cta" href="#contact">{hero.cta} →</a>
          </div>

          <div className="filmstrip" aria-hidden="true">
            {cases.slice(0, 3).map((c) => (
              <div className="filmstrip-card" key={c.id}>
                <div className="filmstrip-tag">{c.tags?.[0]}</div>
                <div className="filmstrip-result">{c.result}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">О специалисте</span>
            <h2>{about.title}</h2>
          </div>
          <div className="about-grid">
            <img className="about-photo" src={about.photo} alt="Настя" />
            <div className="about-body">
              <p>{about.body}</p>
              <div className="stats">
                {about.stats.map((s, i) => (
                  <div key={i}>
                    <span className="stat-value">{s.value}</span>
                    <span className="stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cases">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Портфолио</span>
            <h2>Кейсы</h2>
            <p>Что было сделано и к каким результатам это привело.</p>
          </div>
          <div className="cases-grid">
            {cases.map((c) => (
              <article className="case-card" key={c.id}>
                <img className="case-image" src={c.image} alt={c.client} />
                <div className="case-body">
                  <div className="case-tags">
                    {c.tags?.map((t) => (
                      <span className="case-tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <h3 className="case-client">{c.client}</h3>
                  <p className="case-description">{c.description}</p>
                  <div className="case-result">{c.result}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Сотрудничество</span>
            <h2>Услуги и цены</h2>
            <p>Форматы работы — от разового ведения до полного цикла.</p>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <div className="service-card" key={s.id}>
                <h3 className="service-name">{s.name}</h3>
                <div className="service-price">{s.price}</div>
                <p className="service-description">{s.description}</p>
                <ul className="service-features">
                  {s.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container contact-inner">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">На связи</span>
            <h2>Обсудим проект?</h2>
          </div>
          <div className="contact-links">
            {contact.telegram && (
              <a className="contact-link" href={contact.telegram} target="_blank" rel="noreferrer">Telegram</a>
            )}
            {contact.email && (
              <a className="contact-link" href={`mailto:${contact.email}`}>{contact.email}</a>
            )}
            {contact.instagram && (
              <a className="contact-link" href={contact.instagram} target="_blank" rel="noreferrer">Instagram</a>
            )}
          </div>
        </div>
      </section>

      <footer>
        <div className="container">© {new Date().getFullYear()} Настя. Все права защищены.</div>
      </footer>
    </>
  );
}
