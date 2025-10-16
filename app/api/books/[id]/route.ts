import { deleteBook, getBook, updateBook } from "@/lib/books";
import { NextResponse } from "next/server";

// Métodos HTTP
export async function GET(req: Request) {
  const id = req.url.split("/").pop()!;
  const book = await getBook(id);
  return NextResponse.json(book);
}

export async function PATCH(req: Request) {
  const id = req.url.split("/").pop()!;
  const body = await req.json();
  const book = await updateBook(id, body);
  return NextResponse.json(book);
}

export async function DELETE(req: Request) {
  try {
    const id = req.url.split("/").pop()!;
    await deleteBook(id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao deletar livro:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Erro ao deletar livro" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
