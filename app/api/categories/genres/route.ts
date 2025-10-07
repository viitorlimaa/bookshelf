import { NextResponse } from "next/server";

const BACKEND_URL = "https://db-bookshelf.onrender.com";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/genres`);
    if (!res.ok) throw new Error("Erro ao buscar gêneros");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error);
    return NextResponse.json({ error: "Erro ao buscar gêneros" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const res = await fetch(`${BACKEND_URL}/genres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Erro ao criar gênero:", error);
    return NextResponse.json({ error: "Erro ao criar gênero" }, { status: 500 });
  }
}
