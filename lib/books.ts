import { revalidatePath, revalidateTag } from "next/cache";
import { Book } from "@/data/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;
const BOOKS_CACHE_TAG = "books";

// Busca todos os livros
export async function getBooks(): Promise<Book[]> {
  const res = await fetch(`${BASE_URL}/books`, {
    cache: "force-cache",
    next: { tags: [BOOKS_CACHE_TAG] },
  });

  if (!res.ok) throw new Error("Erro ao buscar livros");
  return res.json();
}

// Cria novo livro
export async function createBook(data: Partial<Book>) {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar livro");

  revalidateBooks();

  return res.json();
}

// Busca um livro específico
export async function getBook(id: string): Promise<Book> {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    cache: "force-cache",
    next: { tags: [BOOKS_CACHE_TAG, `${BOOKS_CACHE_TAG}:${id}`] },
  });

  if (!res.ok) throw new Error("Erro ao buscar livro");
  return res.json();
}

// Atualiza livro existente
export async function updateBook(id: string, data: Partial<Book>) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ao atualizar livro (${res.status})`);
  }

  revalidateBooks(id);

  return res.json();
}

// Deleta um livro
export async function deleteBook(id: string) {
  const res = await fetch(`${BASE_URL}/books/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const text = await res.text();
    console.error("Erro ao deletar livro:", text);
    return { success: false, error: text || "Erro ao deletar livro" };
  }

  revalidateBooks(id);

  return { success: true };
}

function revalidateBooks(id?: string) {
  revalidateTag(BOOKS_CACHE_TAG);
  if (id) revalidateTag(`${BOOKS_CACHE_TAG}:${id}`);

  revalidatePath("/");
  revalidatePath("/library");

  if (id) {
    revalidatePath(`/book/${id}`);
    revalidatePath(`/edit/${id}`);
  }
}
