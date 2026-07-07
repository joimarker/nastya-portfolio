import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Без SUPABASE_URL/SUPABASE_SERVICE_KEY (локальная разработка) файлы
// пишутся в public/uploads и отдаются Next.js как обычная статика.
// На проде (переменные заданы) — загружаются в Supabase Storage
// (бесплатный тариф, 1GB), который сразу отдаёт публичный URL; это
// нужно, чтобы загруженные через админку картинки не пропадали при
// каждом рестарте/деплое — локальный диск на Render эфемерный.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const BUCKET = "portfolio";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ

const supabase =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
    : null;

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Разрешены только JPG, PNG, WEBP, GIF" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Файл больше 5 МБ" }, { status: 400 });
  }

  const ext = path.extname(file.name) || "";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  if (supabase) {
    const { error } = await supabase.storage.from(BUCKET).upload(`uploads/${safeName}`, file, {
      contentType: file.type,
    });
    if (error) {
      return NextResponse.json({ error: "Ошибка загрузки в хранилище" }, { status: 500 });
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(`uploads/${safeName}`);
    return NextResponse.json({ url: data.publicUrl });
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, safeName), buffer);
  return NextResponse.json({ url: `/uploads/${safeName}` });
}
