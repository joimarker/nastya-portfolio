import { NextResponse } from "next/server";
import { readContent } from "@/lib/store";

export async function GET() {
  const data = await readContent();
  return NextResponse.json(data);
}
