"use client";

import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const UI = {
  ru: { close: "Закрыть", included: "Что входит" },
  en: { close: "Close", included: "What's included" },
};

export default function ServiceModal({ service, onClose }) {
  const { lang, t } = useLanguage();
  const ui = UI[lang];

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const features = t(service.features) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel service-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label={ui.close}>
          ×
        </button>
        <h3 className="modal-title">{t(service.name)}</h3>
        <div className="service-modal-price">{t(service.price)}</div>
        <p className="service-modal-description">{t(service.description)}</p>

        {features.length > 0 && (
          <>
            <h4 className="service-modal-included">{ui.included}</h4>
            <ul className="service-modal-features">
              {features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
