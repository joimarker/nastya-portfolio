import { NextResponse } from "next/server";
import { readContent, addItem } from "@/lib/store";

export async function GET() {
  const data = await readContent();
  return NextResponse.json(data.diplomas || []);
}

export async function POST(request) {
  const item = await request.json();
  const created = await addItem("diplomas", item);
  return NextResponse.json(created, { status: 201 });
}
