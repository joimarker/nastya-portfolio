// Простая cookie-сессия без внешних зависимостей.
// Проблема: нужен способ подтвердить, что запрос пришёл от вошедшего
//   администратора, без базы пользователей (у нас один пароль). При этом
//   middleware.js выполняется в Edge Runtime, где недоступен Node.js
//   модуль "crypto" (createHmac/timingSafeEqual) — только Web Crypto API.
// Решение: подписываем значение "admin" секретом через Web Crypto
//   (crypto.subtle.sign с HMAC-SHA256), которая работает и в Node, и в Edge.
//   Куки хранит "admin.<подпись>". Подделать подпись без секрета невозможно.
// Логика: секрет живёт только на сервере (переменная окружения),
//   поэтому даже если куки украдут, подделать новую с другим значением
//   без секрета нельзя, а подмена содержимого куки сломает подпись.

const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";
export const COOKIE_NAME = "nastya_admin_session";

const encoder = new TextEncoder();

async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function sign(value) {
  const key = await getKey();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionValue() {
  const value = "admin";
  return `${value}.${await sign(value)}`;
}

export async function isValidSession(cookieValue) {
  if (!cookieValue) return false;
  const [value, sig] = cookieValue.split(".");
  if (!value || !sig) return false;
  const expected = await sign(value);
  if (sig.length !== expected.length) return false;
  // Побайтовое сравнение постоянного времени без Node Buffer (недоступен в Edge).
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function checkPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme";
  return password === adminPassword;
}
