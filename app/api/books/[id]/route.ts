// app/api/books/[id]/route.ts
import { NextResponse } from "next/server";

const API_BASE = "https://db-bookshelf.onrender.com";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${API_BASE}/books/${params.id}`, { cache: "no-store" });
    if (res.status === 404)
      return NextResponse.json({ error: "Book not found" }, { status: 404 });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error fetching book:", error);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/books/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("❌ Error updating book:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${API_BASE}/books/${params.id}`, {
      method: "DELETE",
    });

    if (res.status === 204) return NextResponse.json({ ok: true });
    const text = await res.text();

    return NextResponse.json({ message: text }, { status: res.status });
  } catch (error) {
    console.error("❌ Error deleting book:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
