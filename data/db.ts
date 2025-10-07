// db.ts
import type { Book, Genre, ReadingStatus } from "@/data/types";

const API_BASE = "https://db-bookshelf.onrender.com";

/* ========================================================
   🔹 Função utilitária genérica para requisições JSON
======================================================== */
async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Erro na API: ${res.status} ${res.statusText} - ${text}`);

  return JSON.parse(text);
}

/* ========================================================
   🔹 Função auxiliar para converter nomes de gênero em IDs
======================================================== */
async function resolveGenreIds(genres?: (string | number)[]): Promise<number[]> {
  if (!genres) return [];
  const allGenres = await db.getGenres();
  return genres.map((g) => {
    if (typeof g === "number") return g;
    const found = allGenres.find((ag) => ag.name === g);
    if (!found) throw new Error(`Gênero desconhecido: ${g}`);
    return found.id;
  });
}

/* ========================================================
   🔹 Conversão do formato da API → formato interno
======================================================== */
function mapBookApiToBook(apiBook: any): Book {
  const genresArray: string[] = apiBook.genres?.map((g: any) => g.name ?? g) ?? [];
  return {
    id: String(apiBook.id),
    title: apiBook.title,
    author: apiBook.author,
    genre: genresArray[0] ?? "",
    genres: genresArray,
    year: apiBook.year,
    isbn: apiBook.isbn ?? undefined,
    status: apiBook.status as ReadingStatus,
    pages: apiBook.pages,
    currentPage: apiBook.currentPage,
    rating: apiBook.rating ?? 0,
    cover: apiBook.cover,
    synopsis: apiBook.synopsis,
    notes: apiBook.notes ?? undefined,
    createdAt: apiBook.createdAt ?? new Date().toISOString(),
    updatedAt: apiBook.updatedAt ?? new Date().toISOString(),
  };
}

/* ========================================================
   🔹 API principal
======================================================== */
export const db = {
  async getGenres(): Promise<Genre[]> {
    try {
      const data = await fetchJSON<Genre[]>(`${API_BASE}/genres`);
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (err) {
      console.warn("⚠️ Falha ao carregar gêneros remotos, usando fallback");
    }

    return [
      { id: 1, name: "Literatura Brasileira" },
      { id: 2, name: "Ficção Científica" },
      { id: 3, name: "Realismo Mágico" },
      { id: 4, name: "Ficção" },
      { id: 5, name: "Fantasia" },
      { id: 6, name: "Romance" },
      { id: 7, name: "Biografia" },
      { id: 8, name: "História" },
      { id: 9, name: "Autoajuda" },
      { id: 10, name: "Tecnologia" },
      { id: 11, name: "Programação" },
      { id: 12, name: "Negócios" },
      { id: 13, name: "Psicologia" },
      { id: 14, name: "Filosofia" },
      { id: 15, name: "Poesia" },
      { id: 16, name: "Mistério" },
    ];
  },
async create(data: Partial<Book>): Promise<Book> {
  // 1️⃣ Resolve IDs numéricos
  const genreIds = await resolveGenreIds(data.genres);

  // 2️⃣ Monta payload
  const payload: any = {
    ...data,
    genreIds,
    cover: data.cover || "https://via.placeholder.com/150",
    synopsis: data.synopsis || "Sem sinopse",
  };
  delete payload.genres;

  // 3️⃣ Envia para o backend
  const newBook = await fetchJSON<any>(`${API_BASE}/books`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapBookApiToBook(newBook);
}
,

  async update(id: string | number, data: Partial<Book>): Promise<Book | null> {
    try {
      const genreIds = await resolveGenreIds(data.genres);
      const payload: any = {
        ...data,
        cover: data.cover || "https://via.placeholder.com/150",
        synopsis: data.synopsis || "Sem sinopse",
        genreIds,
      };
      delete payload.genres;

      const updated = await fetchJSON<any>(`${API_BASE}/books/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return mapBookApiToBook(updated);
    } catch (err) {
      console.error("❌ Erro ao atualizar livro:", err);
      return null;
    }
  },

  async getAll(): Promise<Book[]> {
    const data = await fetchJSON<any[]>(`${API_BASE}/books`);
    return data.map(mapBookApiToBook);
  },

  async getById(id: string | number): Promise<Book | null> {
    try {
      const data = await fetchJSON<any>(`${API_BASE}/books/${id}`);
      return mapBookApiToBook(data);
    } catch {
      return null;
    }
  },

  async delete(id: string | number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/books/${id}`, { method: "DELETE" });
      return res.ok;
    } catch {
      return false;
    }
  },
};
