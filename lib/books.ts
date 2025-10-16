"use server";

import { revalidatePath } from "next/cache";
import { Book } from "@/data/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;

// Busca todos os livros
export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`, {
    cache: "no-store", // garante dados atualizados
  });

  if (!res.ok) throw new Error("Erro ao buscar livros");
  return res.json();
}

// Cria novo livro
export async function createBook(data: any) {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erro ao criar livro");

  // Invalida cache do Dashboard e Library
  revalidatePath("/dashboard");
  revalidatePath("/library");

  return res.json();
}

// Busca um livro específico
export async function getBook(id: string) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    cache: "no-store",
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

  revalidatePath("/dashboard");
  revalidatePath("/library");

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

  revalidatePath("/dashboard");
  revalidatePath("/library");

  return { success: true };
}
