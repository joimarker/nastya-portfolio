import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Отдаёт файлы, загруженные после деплоя на Render (см. app/api/admin/upload).
// Используется только когда задан DATA_DIR (Persistent Disk) — такие файлы
// не лежат в public/, поэтому Next.js не может отдать их статикой напрямую.
const UPLOAD_DIR = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, "uploads")
  : path.join(process.cwd(), "public", "uploads");

const MIME_TYPES = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(request, { params }) {
  const { filename } = await params;
  const safeName = path.basename(filename); // защита от path traversal
  const filePath = path.join(UPLOAD_DIR, safeName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  const contentType = MIME_TYPES[path.extname(safeName).toLowerCase()] || "application/octet-stream";

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
