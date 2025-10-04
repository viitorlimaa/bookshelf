// app/api/categories/genres/[genre]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db";

export async function DELETE(_req: Request, { params }: { params: { genre: string } }) {
  const { genre } = params;
  const ok = await db.removeGenre(genre);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
