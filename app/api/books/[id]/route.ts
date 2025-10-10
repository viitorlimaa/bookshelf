import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

// GET /api/books/[id]
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${API_BASE}/books/${params.id}`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Erro ao buscar livro:", err);
    return NextResponse.json({ error: "Erro ao buscar livro" }, { status: 500 });
  }
}

// PATCH /api/books/[id]
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/books/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ Erro ao atualizar livro:", err);
    return NextResponse.json({ error: "Erro ao atualizar livro" }, { status: 500 });
  }
}
