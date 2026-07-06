"use client";

import { useState } from "react";
import CategoryModal from "./CategoryModal";
import { useLanguage } from "../context/LanguageContext";

export default function CaseCategories({ categories }) {
  const [openId, setOpenId] = useState(null);
  const { t } = useLanguage();
  const openCategory = categories.find((c) => c.id === openId) || null;

  return (
    <div className="category-grid">
      {categories.map((c, i) => (
        <button
          type="button"
          key={c.id}
          className="category-tile"
          onClick={() => setOpenId(c.id)}
        >
          <span className="category-index">{String(i + 1).padStart(2, "0")}</span>
          <span className="category-name">{t(c.name)}</span>
        </button>
      ))}

      {openCategory && (
        <CategoryModal category={openCategory} onClose={() => setOpenId(null)} />
      )}
    </div>
  );
}
