"use client";

import { useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";

const UI = {
  ru: { empty: "Нет фото", prev: "Предыдущее фото", next: "Следующее фото" },
  en: { empty: "[EN] Нет фото", prev: "[EN] Предыдущее фото", next: "[EN] Следующее фото" },
};

export default function ImageCarousel({ images }) {
  const { lang } = useLanguage();
  const ui = UI[lang];
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  if (!images || images.length === 0) {
    return <div className="carousel carousel-empty">{ui.empty}</div>;
  }

  const hasMultiple = images.length > 1;

  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setIndex((i) => (i + 1) % images.length);
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      if (delta > 0) prev();
      else next();
    }
    touchStartX.current = null;
  }

  return (
    <div className="carousel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="carousel-image-wrap">
        <img className="carousel-image" src={images[index]} alt="" />
        {hasMultiple && (
          <>
            <button type="button" className="carousel-arrow carousel-arrow-prev" onClick={prev} aria-label={ui.prev}>
              ←
            </button>
            <button type="button" className="carousel-arrow carousel-arrow-next" onClick={next} aria-label={ui.next}>
              →
            </button>
          </>
        )}
      </div>
      {hasMultiple && (
        <div className="carousel-counter">{index + 1} / {images.length}</div>
      )}
    </div>
  );
}
