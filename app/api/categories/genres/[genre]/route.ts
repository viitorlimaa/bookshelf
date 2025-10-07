import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function DELETE(
  _req: Request,
  { params }: { params: { genre: string } }
) {
  try {
    const { genre } = params;

    // Buscar gênero pelo nome (case-insensitive)
    const genreRecord = (await db.getGenres()).find(
      (g) => g.name.toLowerCase() === genre.toLowerCase()
    );
    console.log(genre);
    if (!genreRecord)
      return NextResponse.json(
        { error: "Gênero não encontrado" },
        { status: 404 }
      );

    await db.removeGenre(genreRecord.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao deletar gênero:", error);
    return NextResponse.json(
      { error: "Erro ao deletar gênero" },
      { status: 500 }
    );
  }
}
