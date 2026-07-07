"use client";

import { useState } from "react";
import ServiceModal from "./ServiceModal";
import { useLanguage } from "../context/LanguageContext";

export default function Services({ services }) {
  const [openId, setOpenId] = useState(null);
  const { t } = useLanguage();
  const openService = services.find((s) => s.id === openId) || null;

  return (
    <div className="services-grid">
      {services.map((s) => (
        <button type="button" className="service-tile" key={s.id} onClick={() => setOpenId(s.id)}>
          <span className="service-tile-name">{t(s.name)}</span>
          <span className="service-tile-price">{t(s.price)}</span>
        </button>
      ))}

      {openService && (
        <ServiceModal service={openService} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
