"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

function emptyCase() {
  return { client: "", period: "", description: "", result: "", image: "", tags: "" };
}
function emptyService() {
  return { name: "", price: "", description: "", features: "" };
}

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState("");
  const [newCase, setNewCase] = useState(emptyCase());
  const [newService, setNewService] = useState(emptyService());

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then(setData);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function saveSection(section, value) {
    setSaving(section);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, value }),
    });
    setSaving("");
  }

  function updateField(section, field, value) {
    setData((d) => ({ ...d, [section]: { ...d[section], [field]: value } }));
  }

  function updateStat(index, field, value) {
    setData((d) => {
      const stats = [...d.about.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...d, about: { ...d.about, stats } };
    });
  }

  async function addCase() {
    const payload = {
      ...newCase,
      tags: newCase.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const res = await fetch("/api/admin/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    setData((d) => ({ ...d, cases: [...d.cases, created] }));
    setNewCase(emptyCase());
  }

  async function updateCase(id, updates) {
    await fetch(`/api/admin/cases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function deleteCase(id) {
    await fetch(`/api/admin/cases/${id}`, { method: "DELETE" });
    setData((d) => ({ ...d, cases: d.cases.filter((c) => c.id !== id) }));
  }

  async function addService() {
    const payload = {
      ...newService,
      features: newService.features.split(",").map((f) => f.trim()).filter(Boolean),
    };
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    setData((d) => ({ ...d, services: [...d.services, created] }));
    setNewService(emptyService());
  }

  async function updateService(id, updates) {
    await fetch(`/api/admin/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function deleteService(id) {
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setData((d) => ({ ...d, services: d.services.filter((s) => s.id !== id) }));
  }

  if (!data) {
    return <div className="admin-shell"><div className="admin-content">Загрузка...</div></div>;
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <strong>Админка — Настя SMM</strong>
        <div style={{ display: "flex", gap: 12 }}>
          <a className="btn btn-ghost" href="/" target="_blank" rel="noreferrer">Открыть сайт</a>
          <button className="btn btn-ghost" onClick={handleLogout}>Выйти</button>
        </div>
      </header>

      <div className="admin-content">
        {/* HERO */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Главный экран (Hero)</h3>
          <div className="field">
            <label>Эйбрау (маленькая строка над заголовком)</label>
            <input value={data.hero.eyebrow} onChange={(e) => updateField("hero", "eyebrow", e.target.value)} />
          </div>
          <div className="field">
            <label>Заголовок</label>
            <input value={data.hero.title} onChange={(e) => updateField("hero", "title", e.target.value)} />
          </div>
          <div className="field">
            <label>Подзаголовок</label>
            <textarea rows={3} value={data.hero.subtitle} onChange={(e) => updateField("hero", "subtitle", e.target.value)} />
          </div>
          <div className="field">
            <label>Текст кнопки</label>
            <input value={data.hero.cta} onChange={(e) => updateField("hero", "cta", e.target.value)} />
          </div>
          <button className="btn" onClick={() => saveSection("hero", data.hero)}>
            {saving === "hero" ? "Сохранение..." : "Сохранить"}
          </button>
        </div>

        {/* ABOUT */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Обо мне</h3>
          <div className="field">
            <label>Заголовок раздела</label>
            <input value={data.about.title} onChange={(e) => updateField("about", "title", e.target.value)} />
          </div>
          <div className="field">
            <label>Текст</label>
            <textarea rows={5} value={data.about.body} onChange={(e) => updateField("about", "body", e.target.value)} />
          </div>
          <ImageUploader label="Фото" value={data.about.photo} onChange={(url) => updateField("about", "photo", url)} />
          <label style={{ fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", color: "var(--color-paper-dim)" }}>
            Цифры / статистика
          </label>
          <div style={{ display: "flex", gap: 12, margin: "10px 0 18px" }}>
            {data.about.stats.map((s, i) => (
              <div key={i} style={{ flex: 1 }}>
                <input
                  placeholder="Значение"
                  value={s.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  style={{ marginBottom: 6, width: "100%" }}
                />
                <input
                  placeholder="Подпись"
                  value={s.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </div>
          <button className="btn" onClick={() => saveSection("about", data.about)}>
            {saving === "about" ? "Сохранение..." : "Сохранить"}
          </button>
        </div>

        {/* CASES */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Кейсы</h3>
          {data.cases.map((c) => (
            <CaseEditRow key={c.id} item={c} onSave={updateCase} onDelete={deleteCase} />
          ))}

          <h4 style={{ marginTop: 24, marginBottom: 12 }}>Добавить кейс</h4>
          <div className="field">
            <label>Клиент / ниша</label>
            <input value={newCase.client} onChange={(e) => setNewCase({ ...newCase, client: e.target.value })} />
          </div>
          <div className="field">
            <label>Период</label>
            <input value={newCase.period} onChange={(e) => setNewCase({ ...newCase, period: e.target.value })} />
          </div>
          <div className="field">
            <label>Описание</label>
            <textarea rows={3} value={newCase.description} onChange={(e) => setNewCase({ ...newCase, description: e.target.value })} />
          </div>
          <div className="field">
            <label>Результат</label>
            <input value={newCase.result} onChange={(e) => setNewCase({ ...newCase, result: e.target.value })} />
          </div>
          <div className="field">
            <label>Теги через запятую</label>
            <input value={newCase.tags} onChange={(e) => setNewCase({ ...newCase, tags: e.target.value })} />
          </div>
          <ImageUploader label="Изображение кейса" value={newCase.image} onChange={(url) => setNewCase({ ...newCase, image: url })} />
          <button className="btn" onClick={addCase}>Добавить кейс</button>
        </div>

        {/* SERVICES */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Услуги и цены</h3>
          {data.services.map((s) => (
            <ServiceEditRow key={s.id} item={s} onSave={updateService} onDelete={deleteService} />
          ))}

          <h4 style={{ marginTop: 24, marginBottom: 12 }}>Добавить услугу</h4>
          <div className="field">
            <label>Название пакета</label>
            <input value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Цена</label>
            <input value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} />
          </div>
          <div className="field">
            <label>Описание</label>
            <textarea rows={2} value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
          </div>
          <div className="field">
            <label>Что входит (через запятую)</label>
            <input value={newService.features} onChange={(e) => setNewService({ ...newService, features: e.target.value })} />
          </div>
          <button className="btn" onClick={addService}>Добавить услугу</button>
        </div>

        {/* CONTACT */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Контакты</h3>
          <div className="field">
            <label>Telegram (ссылка)</label>
            <input value={data.contact.telegram} onChange={(e) => updateField("contact", "telegram", e.target.value)} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={data.contact.email} onChange={(e) => updateField("contact", "email", e.target.value)} />
          </div>
          <div className="field">
            <label>Instagram (ссылка)</label>
            <input value={data.contact.instagram} onChange={(e) => updateField("contact", "instagram", e.target.value)} />
          </div>
          <button className="btn" onClick={() => saveSection("contact", data.contact)}>
            {saving === "contact" ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CaseEditRow({ item, onSave, onDelete }) {
  const [form, setForm] = useState({ ...item, tags: (item.tags || []).join(", ") });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const updates = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
    await onSave(item.id, updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="admin-card" style={{ background: "transparent" }}>
      <div className="admin-card-header">
        <strong>{item.client || "Без названия"}</strong>
        <button className="btn-danger" onClick={() => onDelete(item.id)}>Удалить</button>
      </div>
      <div className="field"><label>Клиент / ниша</label><input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></div>
      <div className="field"><label>Период</label><input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></div>
      <div className="field"><label>Описание</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="field"><label>Результат</label><input value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })} /></div>
      <div className="field"><label>Теги через запятую</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
      <ImageUploader label="Изображение" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
      <button className="btn" onClick={handleSave}>{saved ? "Сохранено ✓" : "Сохранить изменения"}</button>
    </div>
  );
}

function ServiceEditRow({ item, onSave, onDelete }) {
  const [form, setForm] = useState({ ...item, features: (item.features || []).join(", ") });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const updates = { ...form, features: form.features.split(",").map((f) => f.trim()).filter(Boolean) };
    await onSave(item.id, updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="admin-card" style={{ background: "transparent" }}>
      <div className="admin-card-header">
        <strong>{item.name || "Без названия"}</strong>
        <button className="btn-danger" onClick={() => onDelete(item.id)}>Удалить</button>
      </div>
      <div className="field"><label>Название</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div className="field"><label>Цена</label><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
      <div className="field"><label>Описание</label><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="field"><label>Что входит (через запятую)</label><input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></div>
      <button className="btn" onClick={handleSave}>{saved ? "Сохранено ✓" : "Сохранить изменения"}</button>
    </div>
  );
}
