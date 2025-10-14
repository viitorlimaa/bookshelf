import { NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;

// Funções que podem ser chamadas no frontend
export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`);
  if (!res.ok) throw new Error("Erro ao buscar livros");
  return res.json();
}

export async function createBook(data: any) {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar livro");
  return res.json();
}

// Método HTTP para Next.js
export async function GET() {
  const books = await getBooks();
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  const body = await req.json();
  const book = await createBook(body);
  return NextResponse.json(book);
}
