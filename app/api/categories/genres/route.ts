import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET() {
  try {
    const genres = await db.getGenres();
    return NextResponse.json(genres);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Erro ao buscar categorias" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });

    const genre = await db.addGenre(name);
    return NextResponse.json(genre, { status: 201 });
  } catch (error) {
    console.error("Error creating genre:", error);
    return NextResponse.json({ error: "Erro ao criar gênero" }, { status: 500 });
  }
}
