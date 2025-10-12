import { NextResponse } from "next/server";


export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE!}/books`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ Erro ao buscar livros:", err);
    return NextResponse.json(
      { error: "Erro ao buscar livros" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE!}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ Erro ao criar livro:", err);
    return NextResponse.json({ error: "Erro ao criar livro" }, { status: 500 });
  }
}
