"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ru");

  useEffect(() => {
    const stored = window.localStorage.getItem("lang");
    if (stored === "ru" || stored === "en") setLang(stored);
  }, []);

  function changeLang(next) {
    setLang(next);
    window.localStorage.setItem("lang", next);
  }

  function t(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    return field[lang] ?? field.ru ?? "";
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
