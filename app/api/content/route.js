import { NextResponse } from "next/server";
import { readContent } from "@/lib/store";

export async function GET() {
  const data = readContent();
  return NextResponse.json(data);
}
