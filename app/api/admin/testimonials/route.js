import { NextResponse } from "next/server";
import { readContent, addItem } from "@/lib/store";

export async function GET() {
  const data = readContent();
  return NextResponse.json(data.testimonials || []);
}

export async function POST(request) {
  const item = await request.json();
  const created = addItem("testimonials", item);
  return NextResponse.json(created, { status: 201 });
}
