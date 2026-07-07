import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Без DATA_DIR (локальная разработка) файлы лежат в public/uploads и
// отдаются как обычные статические файлы Next.js. На Render с
// Persistent Disk (DATA_DIR задан) они пишутся на смонтированный диск
// и отдаются через app/api/uploads/[filename] — иначе новые загрузки
// пропадали бы при каждом рестарте/деплое.
const UPLOAD_DIR = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, "uploads")
  : path.join(process.cwd(), "public", "uploads");
const UPLOAD_URL_PREFIX = process.env.DATA_DIR ? "/api/uploads" : "/uploads";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 МБ

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

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const ext = path.extname(file.name) || "";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, safeName), buffer);

  return NextResponse.json({ url: `${UPLOAD_URL_PREFIX}/${safeName}` });
}
