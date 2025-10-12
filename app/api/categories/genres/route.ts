import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/genres`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Erro ao buscar gêneros:", err);
    return NextResponse.json(
      { error: "Erro ao buscar gêneros" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_BASE}/genres`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ Erro ao criar gênero:", err);
    return NextResponse.json(
      { error: "Erro ao criar gênero" },
      { status: 500 }
    );
  }
}
