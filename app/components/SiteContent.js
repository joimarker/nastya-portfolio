"use client";

import { useLanguage } from "../context/LanguageContext";
import CaseCategories from "./CaseCategories";
import Testimonials from "./Testimonials";
import Diplomas from "./Diplomas";
import Services from "./Services";

const UI = {
  ru: {
    navAbout: "Обо мне",
    navCases: "Кейсы",
    navTestimonials: "Отзывы",
    navDiplomas: "Дипломы",
    navServices: "Услуги",
    navContact: "Контакты",
    aboutEyebrow: "О специалисте",
    casesEyebrow: "Портфолио",
    casesTitle: "Кейсы",
    casesSubtitle: "Нажмите на раздел, чтобы посмотреть примеры.",
    testimonialsEyebrow: "Отзывы",
    testimonialsTitle: "Что говорят клиенты",
    testimonialsSubtitle: "Реальные сообщения о работе — коротко и без прикрас.",
    diplomasEyebrow: "Дипломы",
    diplomasTitle: "Подтверждённая квалификация",
    diplomasSubtitle: "Курсы и сертификаты — нажмите, чтобы рассмотреть скан целиком.",
    servicesEyebrow: "Сотрудничество",
    servicesTitle: "Услуги и цены",
    servicesSubtitle: "Нажмите на пакет, чтобы посмотреть, что в него входит.",
    pointServicesEyebrow: "Дополнительно",
    pointServicesTitle: "Точечные услуги",
    pointServicesSubtitle: "Разовые задачи без ведения аккаунта на постоянной основе.",
    contactEyebrow: "На связи",
    contactTitle: "Обсудим проект?",
    footer: "Все права защищены.",
  },
  en: {
    navAbout: "About",
    navCases: "Cases",
    navTestimonials: "Testimonials",
    navDiplomas: "Diplomas",
    navServices: "Services",
    navContact: "Contact",
    aboutEyebrow: "About",
    casesEyebrow: "Portfolio",
    casesTitle: "Cases",
    casesSubtitle: "Click a section to see examples.",
    testimonialsEyebrow: "Testimonials",
    testimonialsTitle: "What clients say",
    testimonialsSubtitle: "Real messages about the work — short and honest.",
    diplomasEyebrow: "Diplomas",
    diplomasTitle: "Verified qualifications",
    diplomasSubtitle: "Courses and certificates — click to view the full scan.",
    servicesEyebrow: "Collaboration",
    servicesTitle: "Services & pricing",
    servicesSubtitle: "Click a package to see what's included.",
    pointServicesEyebrow: "Add-ons",
    pointServicesTitle: "One-off services",
    pointServicesSubtitle: "Single tasks without ongoing account management.",
    contactEyebrow: "Get in touch",
    contactTitle: "Let's discuss your project?",
    footer: "All rights reserved.",
  },
};

export default function SiteContent({ data }) {
  const { hero, about, caseCategories, testimonials, diplomas, services, pointServices, contact } = data;
  const { lang, setLang, t } = useLanguage();
  const ui = UI[lang];
  const heroPhotos = (hero.photos || []).slice(0, 2);

  return (
    <>
      <nav className="nav">
        <div className="container nav-inner">
          <span className="nav-logo">Настя</span>
          <ul className="nav-links">
            <li><a href="#about">{ui.navAbout}</a></li>
            <li><a href="#cases">{ui.navCases}</a></li>
            <li><a href="#testimonials">{ui.navTestimonials}</a></li>
            <li><a href="#diplomas">{ui.navDiplomas}</a></li>
            <li><a href="#services">{ui.navServices}</a></li>
            <li><a href="#contact">{ui.navContact}</a></li>
          </ul>
          <div className="lang-switch">
            <button
              type="button"
              className={`lang-switch-option${lang === "ru" ? " lang-switch-active" : ""}`}
              onClick={() => setLang("ru")}
            >
              RU
            </button>
            <span className="lang-switch-sep">/</span>
            <button
              type="button"
              className={`lang-switch-option${lang === "en" ? " lang-switch-active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>
        </div>
      </nav>

      <section id="hero">
        <div className="container hero">
          <div className="hero-text">
            <span className="eyebrow">{t(hero.eyebrow)}</span>
            <h1>{t(hero.title)}</h1>
            <p className="hero-subtitle">{t(hero.subtitle)}</p>
            <a className="hero-cta" href="#contact">{t(hero.cta)} →</a>
          </div>
          {heroPhotos.length > 0 && (
            <div className={`hero-photos hero-photos-${heroPhotos.length}`} aria-hidden="true">
              {heroPhotos.map((src, i) => (
                <div className="hero-photo-frame" key={i}>
                  <img className="hero-photo" src={src} alt="" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{ui.aboutEyebrow}</span>
            <h2>{t(about.title)}</h2>
          </div>
          <div className="about-grid">
            <img className="about-photo" src={about.photo} alt="Настя" />
            <div className="about-body">
              <p>{t(about.body)}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="cases">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{ui.casesEyebrow}</span>
            <h2>{ui.casesTitle}</h2>
            <p>{ui.casesSubtitle}</p>
          </div>
          <CaseCategories categories={caseCategories} />
        </div>
      </section>

      <section id="testimonials">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{ui.testimonialsEyebrow}</span>
            <h2>{ui.testimonialsTitle}</h2>
            <p>{ui.testimonialsSubtitle}</p>
          </div>
          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      <section id="diplomas">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{ui.diplomasEyebrow}</span>
            <h2>{ui.diplomasTitle}</h2>
            <p>{ui.diplomasSubtitle}</p>
          </div>
          <Diplomas diplomas={diplomas} />
        </div>
      </section>

      <section id="services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{ui.servicesEyebrow}</span>
            <h2>{ui.servicesTitle}</h2>
            <p>{ui.servicesSubtitle}</p>
          </div>
          <Services services={services} />
        </div>
      </section>

      <section id="point-services">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">{ui.pointServicesEyebrow}</span>
            <h2>{ui.pointServicesTitle}</h2>
            <p>{ui.pointServicesSubtitle}</p>
          </div>
          <div className="point-services-grid">
            {pointServices?.map((p) => (
              <div className="point-service-card" key={p.id}>
                <h3 className="point-service-name">{t(p.name)}</h3>
                <div className="point-service-hidden">
                  <p className="point-service-description">{t(p.description)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="container contact-inner">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">{ui.contactEyebrow}</span>
            <h2>{ui.contactTitle}</h2>
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
        <div className="container">© {new Date().getFullYear()} Настя. {ui.footer}</div>
      </footer>
    </>
  );
}
