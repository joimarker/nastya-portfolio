import { NextResponse } from "next/server";
import { updateItem, deleteItem } from "@/lib/store";

export async function PUT(request, { params }) {
  const { id } = await params;
  const updates = await request.json();
  const updated = await updateItem("diplomas", id, updates);
  if (!updated) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteItem("diplomas", id);
  return NextResponse.json({ ok: true });
}
