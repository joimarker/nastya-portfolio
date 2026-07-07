"use client";

import { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const UI = {
  ru: { close: "Закрыть" },
  en: { close: "Close" },
};

export default function DiplomaModal({ diploma, onClose }) {
  const { lang, t } = useLanguage();
  const ui = UI[lang];

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel diploma-modal-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label={ui.close}>
          ×
        </button>
        <img className="diploma-modal-image" src={diploma.image} alt={t(diploma.title)} />
        <h3 className="modal-example-title">{t(diploma.title)}</h3>
        <p className="diploma-modal-caption">{t(diploma.issuer)} · {diploma.year}</p>
      </div>
    </div>
  );
}
