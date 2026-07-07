import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// JSON-хранилище вместо полноценной БД — для портфолио-сайта с редким
// редактированием этого достаточно.
//
// Локальная файловая система (как на Render) эфемерна между
// рестартами/деплоями — без внешнего хранилища любые изменения из
// админки слетают. Если заданы SUPABASE_URL и SUPABASE_SERVICE_KEY,
// content.json хранится как файл в Supabase Storage (бесплатный тариф,
// 1GB) вместо локального диска. Без них — локальный файл, как раньше
// (для офлайн-разработки).

const SEED_PATH = path.join(process.cwd(), "data", "content.json");
const BUCKET = "portfolio";
const CONTENT_KEY = "content.json";

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    : null;

export async function readContent() {
  if (!supabase) {
    return JSON.parse(fs.readFileSync(SEED_PATH, "utf-8"));
  }

  const { data, error } = await supabase.storage.from(BUCKET).download(CONTENT_KEY);
  if (error) {
    // Ещё не сидировано (первый запуск на чистом бакете) — заливаем
    // исходный content.json из репозитория и используем его.
    const seedText = fs.readFileSync(SEED_PATH, "utf-8");
    await supabase.storage.from(BUCKET).upload(CONTENT_KEY, new Blob([seedText], { type: "application/json" }), { upsert: true });
    return JSON.parse(seedText);
  }
  return JSON.parse(await data.text());
}

export async function writeContent(data) {
  const json = JSON.stringify(data, null, 2);
  if (!supabase) {
    fs.writeFileSync(SEED_PATH, json, "utf-8");
    return;
  }
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(CONTENT_KEY, new Blob([json], { type: "application/json" }), { upsert: true });
  if (error) throw error;
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function updateSection(section, value) {
  const data = await readContent();
  data[section] = value;
  await writeContent(data);
  return data[section];
}

export async function addItem(section, item) {
  const data = await readContent();
  const newItem = { ...item, id: item.id || generateId(section) };
  data[section] = [...(data[section] || []), newItem];
  await writeContent(data);
  return newItem;
}

export async function updateItem(section, id, updates) {
  const data = await readContent();
  const list = data[section] || [];
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates, id };
  await writeContent(data);
  return list[idx];
}

export async function deleteItem(section, id) {
  const data = await readContent();
  const list = data[section] || [];
  data[section] = list.filter((i) => i.id !== id);
  await writeContent(data);
  return true;
}
