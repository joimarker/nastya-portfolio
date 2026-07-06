"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

function emptyBilingual() {
  return { ru: "", en: "" };
}
function emptyService() {
  return { name: emptyBilingual(), price: emptyBilingual(), description: emptyBilingual(), features: emptyBilingual() };
}
function emptyPointService() {
  return { name: emptyBilingual(), description: emptyBilingual() };
}
function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function emptyExample() {
  return { id: makeId("example"), title: emptyBilingual(), text: emptyBilingual(), images: [] };
}
function emptyTestimonial() {
  return { author: emptyBilingual(), role: emptyBilingual(), text: emptyBilingual(), avatar: "" };
}
function emptyDiploma() {
  return { title: emptyBilingual(), issuer: emptyBilingual(), year: "", image: "" };
}
function label(value) {
  return value?.ru || value?.en || "";
}

function BilingualField({ label: fieldLabel, value, onChange, textarea, rows }) {
  const Field = textarea ? "textarea" : "input";
  const safeValue = value && typeof value === "object" ? { ru: value.ru || "", en: value.en || "" } : emptyBilingual();
  return (
    <div className="field">
      <label>{fieldLabel}</label>
      <div className="bilingual-row">
        <div className="bilingual-col">
          <span className="bilingual-tag">RU</span>
          <Field rows={rows} value={safeValue.ru} onChange={(e) => onChange({ ru: e.target.value, en: safeValue.en })} />
        </div>
        <div className="bilingual-col">
          <span className="bilingual-tag">EN</span>
          <Field rows={rows} value={safeValue.en} onChange={(e) => onChange({ ru: safeValue.ru, en: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState("");
  const [newService, setNewService] = useState(emptyService());
  const [newPointService, setNewPointService] = useState(emptyPointService());
  const [newTestimonial, setNewTestimonial] = useState(emptyTestimonial());
  const [newDiploma, setNewDiploma] = useState(emptyDiploma());

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

  async function updateCaseCategory(id, updates) {
    await fetch(`/api/admin/case-categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function addService() {
    const payload = {
      name: newService.name,
      price: newService.price,
      description: newService.description,
      features: {
        ru: newService.features.ru.split(",").map((f) => f.trim()).filter(Boolean),
        en: newService.features.en.split(",").map((f) => f.trim()).filter(Boolean),
      },
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

  async function addPointService() {
    const res = await fetch("/api/admin/point-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPointService),
    });
    const created = await res.json();
    setData((d) => ({ ...d, pointServices: [...d.pointServices, created] }));
    setNewPointService(emptyPointService());
  }

  async function updatePointService(id, updates) {
    await fetch(`/api/admin/point-services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function deletePointService(id) {
    await fetch(`/api/admin/point-services/${id}`, { method: "DELETE" });
    setData((d) => ({ ...d, pointServices: d.pointServices.filter((p) => p.id !== id) }));
  }

  async function addTestimonial() {
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTestimonial),
    });
    const created = await res.json();
    setData((d) => ({ ...d, testimonials: [...(d.testimonials || []), created] }));
    setNewTestimonial(emptyTestimonial());
  }

  async function updateTestimonial(id, updates) {
    await fetch(`/api/admin/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function deleteTestimonial(id) {
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setData((d) => ({ ...d, testimonials: d.testimonials.filter((t) => t.id !== id) }));
  }

  async function addDiploma() {
    const res = await fetch("/api/admin/diplomas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDiploma),
    });
    const created = await res.json();
    setData((d) => ({ ...d, diplomas: [...(d.diplomas || []), created] }));
    setNewDiploma(emptyDiploma());
  }

  async function updateDiploma(id, updates) {
    await fetch(`/api/admin/diplomas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
  }

  async function deleteDiploma(id) {
    await fetch(`/api/admin/diplomas/${id}`, { method: "DELETE" });
    setData((d) => ({ ...d, diplomas: d.diplomas.filter((dp) => dp.id !== id) }));
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
          <BilingualField label="Эйбрау (маленькая строка над заголовком)" value={data.hero.eyebrow} onChange={(v) => updateField("hero", "eyebrow", v)} />
          <BilingualField label="Заголовок" value={data.hero.title} onChange={(v) => updateField("hero", "title", v)} />
          <BilingualField label="Подзаголовок" value={data.hero.subtitle} onChange={(v) => updateField("hero", "subtitle", v)} textarea rows={3} />
          <BilingualField label="Текст кнопки" value={data.hero.cta} onChange={(v) => updateField("hero", "cta", v)} />
          <button className="btn" onClick={() => saveSection("hero", data.hero)}>
            {saving === "hero" ? "Сохранение..." : "Сохранить"}
          </button>
        </div>

        {/* ABOUT */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Обо мне</h3>
          <BilingualField label="Заголовок раздела" value={data.about.title} onChange={(v) => updateField("about", "title", v)} />
          <BilingualField label="Текст" value={data.about.body} onChange={(v) => updateField("about", "body", v)} textarea rows={5} />
          <ImageUploader label="Фото" value={data.about.photo} onChange={(url) => updateField("about", "photo", url)} />
          <button className="btn" onClick={() => saveSection("about", data.about)}>
            {saving === "about" ? "Сохранение..." : "Сохранить"}
          </button>
        </div>

        {/* CASE CATEGORIES */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Кейсы: разделы</h3>
          {data.caseCategories.map((c) => (
            <CaseCategoryEditRow key={c.id} item={c} onSave={updateCaseCategory} />
          ))}
        </div>

        {/* TESTIMONIALS */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Отзывы</h3>
          {(data.testimonials || []).map((t) => (
            <TestimonialEditRow key={t.id} item={t} onSave={updateTestimonial} onDelete={deleteTestimonial} />
          ))}

          <h4 style={{ marginTop: 24, marginBottom: 12 }}>Добавить отзыв</h4>
          <BilingualField label="Автор" value={newTestimonial.author} onChange={(v) => setNewTestimonial({ ...newTestimonial, author: v })} />
          <BilingualField label="Роль / ниша" value={newTestimonial.role} onChange={(v) => setNewTestimonial({ ...newTestimonial, role: v })} />
          <BilingualField label="Текст отзыва" value={newTestimonial.text} onChange={(v) => setNewTestimonial({ ...newTestimonial, text: v })} textarea rows={4} />
          <ImageUploader label="Аватар (необязательно)" value={newTestimonial.avatar} onChange={(url) => setNewTestimonial({ ...newTestimonial, avatar: url })} />
          <button className="btn" onClick={addTestimonial}>Добавить отзыв</button>
        </div>

        {/* DIPLOMAS */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Дипломы</h3>
          {(data.diplomas || []).map((d) => (
            <DiplomaEditRow key={d.id} item={d} onSave={updateDiploma} onDelete={deleteDiploma} />
          ))}

          <h4 style={{ marginTop: 24, marginBottom: 12 }}>Добавить диплом</h4>
          <BilingualField label="Название" value={newDiploma.title} onChange={(v) => setNewDiploma({ ...newDiploma, title: v })} />
          <BilingualField label="Кто выдал" value={newDiploma.issuer} onChange={(v) => setNewDiploma({ ...newDiploma, issuer: v })} />
          <div className="field">
            <label>Год</label>
            <input value={newDiploma.year} onChange={(e) => setNewDiploma({ ...newDiploma, year: e.target.value })} />
          </div>
          <ImageUploader label="Скан диплома" value={newDiploma.image} onChange={(url) => setNewDiploma({ ...newDiploma, image: url })} />
          <button className="btn" onClick={addDiploma}>Добавить диплом</button>
        </div>

        {/* SERVICES */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Услуги и цены</h3>
          {data.services.map((s) => (
            <ServiceEditRow key={s.id} item={s} onSave={updateService} onDelete={deleteService} />
          ))}

          <h4 style={{ marginTop: 24, marginBottom: 12 }}>Добавить услугу</h4>
          <BilingualField label="Название пакета" value={newService.name} onChange={(v) => setNewService({ ...newService, name: v })} />
          <BilingualField label="Цена" value={newService.price} onChange={(v) => setNewService({ ...newService, price: v })} />
          <BilingualField label="Описание" value={newService.description} onChange={(v) => setNewService({ ...newService, description: v })} textarea rows={2} />
          <BilingualField label="Что входит (через запятую)" value={newService.features} onChange={(v) => setNewService({ ...newService, features: v })} />
          <button className="btn" onClick={addService}>Добавить услугу</button>
        </div>

        {/* POINT SERVICES */}
        <div className="admin-card">
          <h3 style={{ marginBottom: 16 }}>Точечные услуги</h3>
          {data.pointServices.map((p) => (
            <PointServiceEditRow key={p.id} item={p} onSave={updatePointService} onDelete={deletePointService} />
          ))}

          <h4 style={{ marginTop: 24, marginBottom: 12 }}>Добавить точечную услугу</h4>
          <BilingualField label="Название" value={newPointService.name} onChange={(v) => setNewPointService({ ...newPointService, name: v })} />
          <BilingualField label="Описание" value={newPointService.description} onChange={(v) => setNewPointService({ ...newPointService, description: v })} textarea rows={2} />
          <button className="btn" onClick={addPointService}>Добавить услугу</button>
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

function CaseCategoryEditRow({ item, onSave }) {
  const [name, setName] = useState(item.name);
  const [examples, setExamples] = useState(item.examples || []);
  const [saved, setSaved] = useState(false);

  function updateExample(id, updates) {
    setExamples((list) => list.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)));
  }

  function addExample() {
    setExamples((list) => [...list, emptyExample()]);
  }

  function removeExample(id) {
    setExamples((list) => list.filter((ex) => ex.id !== id));
  }

  async function handleSave() {
    await onSave(item.id, { name, examples });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="admin-card" style={{ background: "transparent" }}>
      <div className="admin-card-header">
        <strong>{label(item.name) || "Без названия"}</strong>
      </div>
      <BilingualField label="Название" value={name} onChange={setName} />

      <label style={{ fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", color: "var(--color-paper-dim)" }}>
        Примеры
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "10px 0 18px" }}>
        {examples.map((ex, i) => (
          <ExampleEditor
            key={ex.id}
            example={ex}
            index={i}
            onChange={(updates) => updateExample(ex.id, updates)}
            onRemove={() => removeExample(ex.id)}
          />
        ))}
      </div>
      <button type="button" className="btn btn-ghost" style={{ marginBottom: 16 }} onClick={addExample}>+ Добавить пример</button>

      <div>
        <button className="btn" onClick={handleSave}>{saved ? "Сохранено ✓" : "Сохранить изменения"}</button>
      </div>
    </div>
  );
}

function ExampleEditor({ example, index, onChange, onRemove }) {
  function addImage(url) {
    onChange({ images: [...(example.images || []), url] });
  }

  function removeImage(idx) {
    onChange({ images: example.images.filter((_, i) => i !== idx) });
  }

  return (
    <div className="admin-card" style={{ background: "var(--color-ink-green)" }}>
      <div className="admin-card-header">
        <strong>{label(example.title) || `Пример ${index + 1}`}</strong>
        <button type="button" className="btn-danger" onClick={onRemove}>Удалить пример</button>
      </div>
      <BilingualField label="Заголовок" value={example.title} onChange={(v) => onChange({ title: v })} />
      <BilingualField label="Текст" value={example.text} onChange={(v) => onChange({ text: v })} textarea rows={4} />
      <label style={{ fontFamily: "var(--font-mono)", fontSize: 12, textTransform: "uppercase", color: "var(--color-paper-dim)" }}>
        Фото
      </label>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "10px 0" }}>
        {(example.images || []).map((url, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img src={url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, border: "1px solid var(--color-line)" }} />
            <button
              type="button"
              onClick={() => removeImage(i)}
              aria-label="Удалить фото"
              style={{
                position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%",
                background: "var(--color-coral)", color: "var(--color-ink-green)", border: "none", cursor: "pointer", lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <ImageUploader label="Добавить фото" value="" onChange={addImage} />
    </div>
  );
}

function ServiceEditRow({ item, onSave, onDelete }) {
  const [form, setForm] = useState({
    ...item,
    features: {
      ru: (item.features?.ru || []).join(", "),
      en: (item.features?.en || []).join(", "),
    },
  });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const updates = {
      ...form,
      features: {
        ru: form.features.ru.split(",").map((f) => f.trim()).filter(Boolean),
        en: form.features.en.split(",").map((f) => f.trim()).filter(Boolean),
      },
    };
    await onSave(item.id, updates);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="admin-card" style={{ background: "transparent" }}>
      <div className="admin-card-header">
        <strong>{label(item.name) || "Без названия"}</strong>
        <button className="btn-danger" onClick={() => onDelete(item.id)}>Удалить</button>
      </div>
      <BilingualField label="Название" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <BilingualField label="Цена" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
      <BilingualField label="Описание" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea rows={2} />
      <BilingualField label="Что входит (через запятую)" value={form.features} onChange={(v) => setForm({ ...form, features: v })} />
      <button className="btn" onClick={handleSave}>{saved ? "Сохранено ✓" : "Сохранить изменения"}</button>
    </div>
  );
}

function PointServiceEditRow({ item, onSave, onDelete }) {
  const [form, setForm] = useState({ ...item });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await onSave(item.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="admin-card" style={{ background: "transparent" }}>
      <div className="admin-card-header">
        <strong>{label(item.name) || "Без названия"}</strong>
        <button className="btn-danger" onClick={() => onDelete(item.id)}>Удалить</button>
      </div>
      <BilingualField label="Название" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <BilingualField label="Описание" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea rows={2} />
      <button className="btn" onClick={handleSave}>{saved ? "Сохранено ✓" : "Сохранить изменения"}</button>
    </div>
  );
}

function TestimonialEditRow({ item, onSave, onDelete }) {
  const [form, setForm] = useState({ ...item });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await onSave(item.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="admin-card" style={{ background: "transparent" }}>
      <div className="admin-card-header">
        <strong>{label(item.author) || "Без имени"}</strong>
        <button className="btn-danger" onClick={() => onDelete(item.id)}>Удалить</button>
      </div>
      <BilingualField label="Автор" value={form.author} onChange={(v) => setForm({ ...form, author: v })} />
      <BilingualField label="Роль / ниша" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
      <BilingualField label="Текст отзыва" value={form.text} onChange={(v) => setForm({ ...form, text: v })} textarea rows={4} />
      <ImageUploader label="Аватар (необязательно)" value={form.avatar} onChange={(url) => setForm({ ...form, avatar: url })} />
      <button className="btn" onClick={handleSave}>{saved ? "Сохранено ✓" : "Сохранить изменения"}</button>
    </div>
  );
}

function DiplomaEditRow({ item, onSave, onDelete }) {
  const [form, setForm] = useState({ ...item });
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    await onSave(item.id, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="admin-card" style={{ background: "transparent" }}>
      <div className="admin-card-header">
        <strong>{label(item.title) || "Без названия"}</strong>
        <button className="btn-danger" onClick={() => onDelete(item.id)}>Удалить</button>
      </div>
      <BilingualField label="Название" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
      <BilingualField label="Кто выдал" value={form.issuer} onChange={(v) => setForm({ ...form, issuer: v })} />
      <div className="field">
        <label>Год</label>
        <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
      </div>
      <ImageUploader label="Скан диплома" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
      <button className="btn" onClick={handleSave}>{saved ? "Сохранено ✓" : "Сохранить изменения"}</button>
    </div>
  );
}
