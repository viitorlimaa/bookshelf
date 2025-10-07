import { NextResponse } from "next/server";
import { db } from "@/data/db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");
    const genre = url.searchParams.get("genre");
    const status = url.searchParams.get("status");

    let books = await db.getAll();

    if (query)
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase())
      );

    if (genre)
      books = books.filter(
        (b) => b.genre?.toLowerCase() === genre.toLowerCase()
      );
    if (status) books = books.filter((b) => b.status === status);

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Erro ao buscar livros" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newBook = await db.createBook(body);
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ error: "Erro ao criar livro" }, { status: 500 });
  }
}
