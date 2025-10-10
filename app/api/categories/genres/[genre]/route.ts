// app/api/genres/[id]/route.ts
import { NextResponse } from "next/server";

const API_BASE = "https://db-bookshelf.onrender.com";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${API_BASE}/genres/${params.id}`, {
      method: "DELETE",
    });

    if (res.status === 204) return NextResponse.json({ ok: true });
    const text = await res.text();

    return NextResponse.json({ message: text }, { status: res.status });
  } catch (error) {
    console.error("❌ Error deleting genre:", error);
    return NextResponse.json({ error: "Failed to delete genre" }, { status: 500 });
  }
}
