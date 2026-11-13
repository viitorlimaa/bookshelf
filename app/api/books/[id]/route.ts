import { deleteBook, updateBook } from "@/lib/book-mutations";
import { getBook } from "@/lib/reads";
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
    const result = await deleteBook(id);
    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
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
