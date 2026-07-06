import { NextResponse } from "next/server";
import { updateSection } from "@/lib/store";

// Ожидает { section: "hero" | "about" | "contact", value: {...} }
export async function PUT(request) {
  const { section, value } = await request.json();

  if (!["hero", "about", "contact"].includes(section)) {
    return NextResponse.json({ error: "Неизвестный раздел" }, { status: 400 });
  }

  const updated = updateSection(section, value);
  return NextResponse.json(updated);
}
