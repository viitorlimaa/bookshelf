"use server";

import { createBook, deleteBook, updateBook } from "@/actions";
import { Book } from "@/types";
import { revalidatePath } from "next/cache";

export async function createBookAction(formData: FormData) {
  const payload = Object.fromEntries(formData as any) as any;
  await createBook(payload as Omit<Book, "id" | "createdAt" | "updatedAt">);
  revalidatePath("/library");
}

export async function updateBookAction(id: string, formData: FormData) {
  const patch = Object.fromEntries(formData as any) as any;
  await updateBook(id, patch);
  revalidatePath("/library");
}

export async function deleteBookAction(id: string) {
  await deleteBook(id);
  revalidatePath("/library");
}
