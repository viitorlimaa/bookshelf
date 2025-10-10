"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Book } from "@/data/types";

// URL base do backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://db-bookshelf.onrender.com";

/** CREATE */
export async function createBook(
  data: Omit<Book, "id" | "createdAt" | "updatedAt">
) {
  try {
    const res = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao criar livro");
    const newBook = await res.json();

    revalidatePath("/library");
    revalidatePath("/");

    return { success: true, book: newBook };
  } catch (error) {
    console.error("Error in createBook action:", error);
    return { success: false, error: "Erro ao criar livro" };
  }
}

/** UPDATE */
export async function updateBook(
  id: string,
  data: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">>
) {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao atualizar livro");
    const updatedBook = await res.json();

    revalidatePath("/library");
    revalidatePath(`/book/${id}`);
    revalidatePath("/");

    return { success: true, book: updatedBook };
  } catch (error) {
    console.error("Error in updateBook action:", error);
    return { success: false, error: "Erro ao atualizar livro" };
  }
}

/** DELETE */
export async function deleteBook(id: string) {
  try {
    const res = await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Erro ao deletar livro");

    revalidatePath("/library");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error in deleteBook action:", error);
    return { success: false, error: "Erro ao deletar livro" };
  }
}

/** DELETE + REDIRECT */
export async function deleteBookAndRedirect(id: string) {
  const result = await deleteBook(id);
  if (result.success) redirect("/library");
  return result;
}
