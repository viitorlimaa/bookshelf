// src/data/db.ts
import type { Book, ReadingStatus } from "@/data/types";

const API_BASE = "https://db-bookshelf.onrender.com";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Erro na resposta da API:", res.status, text);
    throw new Error(`Erro ${res.status}: ${text}`);
  }

  // ✅ evita erro quando o backend retorna 204 (sem corpo)
  if (res.status === 204) return {};

  return res.json();
}

export const db = {
  // ============================================
  // NOVAS FUNÇÕES
  // ============================================

  async getBooks(): Promise<Book[]> {
    const res = await fetch(`${API_BASE}/books`, { cache: "no-store" });
    return handleResponse(res);
  },

  async getBook(id: number): Promise<Book> {
    const res = await fetch(`${API_BASE}/books/${id}`, { cache: "no-store" });
    return handleResponse(res);
  },

  async createBook(data: any) {
    const res = await fetch(`${API_BASE}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateBook(id: number, data: any) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // ✅ corrigido: trata corretamente resposta 204
  async deleteBook(id: number) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: "DELETE",
    });

    // alguns backends retornam 204, outros 200 — ambos devem funcionar
    if (res.status === 204) return {};
    return handleResponse(res);
  },

  async getGenres(): Promise<{ id: number; name: string }[]> {
    const res = await fetch(`${API_BASE}/genres`, { cache: "no-store" });
    return handleResponse(res);
  },

  // ============================================
  // ALIAS ANTIGOS (compatibilidade)
  // ============================================

  async getAll(): Promise<Book[]> {
    return this.getBooks();
  },

  async getById(id: number): Promise<Book> {
    return this.getBook(id);
  },

  async add(data: any) {
    return this.createBook(data);
  },

  async update(id: number, data: any) {
    return this.updateBook(id, data);
  },

  async remove(id: number) {
    return this.deleteBook(id);
  },
};
