"use client";

import { useState } from "react";

export default function ImageUploader({ value, onChange, label = "Изображение" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Ошибка загрузки");
      return;
    }
    onChange(data.url);
  }

  return (
    <div className="field">
      <label>{label}</label>
      {value && (
        <img
          src={value}
          alt=""
          style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}
        />
      )}
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
      {uploading && <span style={{ fontSize: 13, color: "var(--color-paper-dim)" }}>Загрузка...</span>}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
