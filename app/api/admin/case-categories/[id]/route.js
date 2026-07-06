import { NextResponse } from "next/server";
import { updateItem } from "@/lib/store";

export async function PUT(request, { params }) {
  const { id } = await params;
  const updates = await request.json();
  const updated = updateItem("caseCategories", id, updates);
  if (!updated) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json(updated);
}
