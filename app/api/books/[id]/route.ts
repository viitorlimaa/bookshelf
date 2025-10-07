import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const book = await db.getById(id);
    if (!book)
      return NextResponse.json(
        { error: "Livro não encontrado" },
        { status: 404 }
      );

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    return NextResponse.json(
      { error: "Erro ao buscar livro" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const body = await request.json();
    const updatedBook = await db.update(id, body);

    if (!updatedBook)
      return NextResponse.json(
        { error: "Livro não encontrado" },
        { status: 404 }
      );

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar livro" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const deleted = await db.delete(id);
    if (!deleted)
      return NextResponse.json(
        { error: "Livro não encontrado" },
        { status: 404 }
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Erro ao deletar livro" },
      { status: 500 }
    );
  }
}
