"use client";

import { useEffect, useState } from "react";
import ImageCarousel from "./ImageCarousel";
import { useLanguage } from "../context/LanguageContext";

const UI = {
  ru: { close: "Закрыть", empty: "Пока нет примеров в этом разделе.", example: "Пример" },
  en: { close: "Close", empty: "No examples in this section yet.", example: "Example" },
};

export default function CategoryModal({ category, onClose }) {
  const { lang, t } = useLanguage();
  const ui = UI[lang];
  const examples = category.examples || [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [category.id]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const active = examples[activeIndex];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label={ui.close}>
          ×
        </button>
        <h3 className="modal-title">{t(category.name)}</h3>

        {examples.length === 0 ? (
          <p className="modal-empty">{ui.empty}</p>
        ) : (
          <>
            <div className="modal-tabs">
              {examples.map((ex, i) => (
                <button
                  type="button"
                  key={ex.id}
                  className={`modal-tab${i === activeIndex ? " modal-tab-active" : ""}`}
                  onClick={() => setActiveIndex(i)}
                >
                  {t(ex.title) || `${ui.example} ${i + 1}`}
                </button>
              ))}
            </div>

            {active && (
              <div className="modal-example">
                <h4 className="modal-example-title">{t(active.title)}</h4>
                <ImageCarousel images={active.images} />
                <p className="modal-example-text">{t(active.text)}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
