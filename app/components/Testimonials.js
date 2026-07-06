"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const UI = {
  ru: { readMore: "Читать полностью", readLess: "Свернуть" },
  en: { readMore: "[EN] Читать полностью", readLess: "[EN] Свернуть" },
};

const PREVIEW_LIMIT = 200;

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function TestimonialBubble({ item }) {
  const { lang, t } = useLanguage();
  const ui = UI[lang];
  const [expanded, setExpanded] = useState(false);
  const text = t(item.text);
  const isLong = text.length > PREVIEW_LIMIT;
  const shown = expanded || !isLong ? text : `${text.slice(0, PREVIEW_LIMIT).trimEnd()}…`;

  return (
    <div className="testimonial-bubble">
      <div className="testimonial-header">
        {item.avatar ? (
          <img className="testimonial-avatar" src={item.avatar} alt="" />
        ) : (
          <div className="testimonial-avatar testimonial-avatar-fallback">{initials(t(item.author))}</div>
        )}
        <div>
          <div className="testimonial-author">{t(item.author)}</div>
          <div className="testimonial-role">{t(item.role)}</div>
        </div>
      </div>
      <p className="testimonial-text">{shown}</p>
      {isLong && (
        <button type="button" className="testimonial-toggle" onClick={() => setExpanded((v) => !v)}>
          {expanded ? ui.readLess : ui.readMore}
        </button>
      )}
    </div>
  );
}

export default function Testimonials({ testimonials }) {
  if (!testimonials?.length) return null;

  return (
    <div className="testimonials-scroll">
      {testimonials.map((item) => (
        <TestimonialBubble key={item.id} item={item} />
      ))}
    </div>
  );
}
