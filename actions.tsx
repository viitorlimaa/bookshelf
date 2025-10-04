"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import type { Book } from "@/types";

export async function createBook(
  data: Omit<Book, "id" | "createdAt" | "updatedAt">
) {
  try {
    // Cast seguro, pois db.create adiciona os campos automaticamente
    const newBook = await db.create(data as Omit<Book, "id">);

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
    const deleted = await db.delete(id);
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
