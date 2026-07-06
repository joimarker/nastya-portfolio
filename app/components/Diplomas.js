"use client";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import DiplomaModal from "./DiplomaModal";

export default function Diplomas({ diplomas }) {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState(null);
  const openDiploma = diplomas?.find((d) => d.id === openId) || null;

  if (!diplomas?.length) return null;

  return (
    <div className="diplomas-scroll">
      {diplomas.map((d) => (
        <button type="button" className="diploma-card" key={d.id} onClick={() => setOpenId(d.id)}>
          <div className="diploma-thumb-wrap">
            <img className="diploma-thumb" src={d.image} alt={t(d.title)} />
            <span className="diploma-stamp" aria-hidden="true">✓</span>
          </div>
          <div className="diploma-title">{t(d.title)}</div>
          <div className="diploma-meta">{t(d.issuer)} · {d.year}</div>
        </button>
      ))}

      {openDiploma && (
        <DiplomaModal diploma={openDiploma} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
