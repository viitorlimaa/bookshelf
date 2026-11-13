import { revalidatePath, revalidateTag } from "next/cache";
import type { Book } from "@/data/types";
import { BOOKS_CACHE_TAG, bookCacheTag } from "@/lib/reads";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;

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
  if (id) revalidateTag(bookCacheTag(id));

  revalidatePath("/");
  revalidatePath("/library");

  if (id) {
    revalidatePath(`/book/${id}`);
    revalidatePath(`/edit/${id}`);
  }
}
