import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;

export async function getBook(id: string) {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar livro");
  return res.json();
}

export async function updateBook(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar livro");
  return res.json();
}

export async function deleteBook(id: string) {
  const res = await fetch(`${BASE_URL}/books/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erro ao deletar livro");
  return res.json();
}

// Métodos HTTP
export async function GET(req: Request) {
  const id = req.url.split("/").pop()!;
  const book = await getBook(id);
  return NextResponse.json(book);
}

export async function PUT(req: Request) {
  const id = req.url.split("/").pop()!;
  const body = await req.json();
  const book = await updateBook(id, body);
  return NextResponse.json(book);
}

export async function DELETE(req: Request) {
  const id = req.url.split("/").pop()!;
  const book = await deleteBook(id);
  return NextResponse.json(book);
}
