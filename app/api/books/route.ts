import { NextResponse } from "next/server";
import { getBooks, createBook } from "@/lib/books";

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
