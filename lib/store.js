import fs from "fs";
import path from "path";

// Простое JSON-хранилище вместо полноценной БД.
// Для портфолио-сайта с редким редактированием этого достаточно
// и не требует нативной компиляции (в отличие от sqlite3),
// что упрощает деплой на Render.

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

export function readContent() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeContent(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function updateSection(section, value) {
  const data = readContent();
  data[section] = value;
  writeContent(data);
  return data[section];
}

export function addItem(section, item) {
  const data = readContent();
  const newItem = { ...item, id: item.id || generateId(section) };
  data[section] = [...(data[section] || []), newItem];
  writeContent(data);
  return newItem;
}

export function updateItem(section, id, updates) {
  const data = readContent();
  const list = data[section] || [];
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...updates, id };
  writeContent(data);
  return list[idx];
}

export function deleteItem(section, id) {
  const data = readContent();
  const list = data[section] || [];
  data[section] = list.filter((i) => i.id !== id);
  writeContent(data);
  return true;
}
