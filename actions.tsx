"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/data/db";
import type { Book } from "@/data/types";

export async function createBook(
  data: Omit<Book, "id" | "createdAt" | "updatedAt">
) {
  try {
    // Forçar valores padrão para campos obrigatórios
    const payload = {
      title: data.title,
      author: data.author,
      genres: data.genres || [],
      year: data.year ?? 0,
      pages: data.pages ?? 0,
      rating: data.rating ?? 0,
      synopsis: data.synopsis || "",
      cover: data.cover || "",
      currentPage: data.currentPage ?? 0,
      status: data.status ?? "QUERO_LER",
      isbn: data.isbn,
      notes: data.notes,
    };

    const newBook = await db.create(payload);

    revalidatePath("/library");
    revalidatePath("/");
    return { success: true, book: newBook };
  } catch (error) {
    console.error("Error in createBook action:", error);
    return { success: false, error: "Erro ao criar livro" };
  }
}
export async function updateBook(
  id: string,
  data: Partial<Omit<Book, "id" | "createdAt">>
) {
  try {
    const updatedBook = await db.update(id, data);
    if (!updatedBook) {
      return { success: false, error: "Livro não encontrado" };
    }
    revalidatePath("/library");
    revalidatePath(`/book/${id}`);
    revalidatePath("/");
    return { success: true, book: updatedBook };
  } catch (error) {
    console.error("[v0] Error in updateBook action:", error);
    return { success: false, error: "Erro ao atualizar livro" };
  }
}

export async function deleteBook(id: string) {
  try {
    const deleted = await db.deleteBook(Number(id));
    if (!deleted) {
      return { success: false, error: "Livro não encontrado" };
    }
    revalidatePath("/library");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(" Error in deleteBook action:", error);
    return { success: false, error: "Erro ao deletar livro" };
  }
}

export async function deleteBookAndRedirect(id: string) {
  const result = await deleteBook(id);
  if (result.success) {
    redirect("/library");
  }
  return result;
}
