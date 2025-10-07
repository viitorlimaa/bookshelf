import { db } from "./data/db";
import fs from "fs";
import path from "path";
import type { ReadingStatus } from "./data/types";

interface LegacyBook {
  id: number;
  title: string;
  author: string;
  genre?: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
}

async function migrate() {
  const booksPath = path.resolve(process.cwd(), "books.json");
  const booksJson: LegacyBook[] = JSON.parse(fs.readFileSync(booksPath, "utf-8"));

  // Carrega gêneros existentes
  let existingGenres = await db.getGenres();
  const genreNames = existingGenres.map((g) => g.name);

  for (const b of booksJson) {
    const genreName = b.genre?.trim();
    let genres: string[] = [];

    if (genreName) {
      // Cria gênero novo se não existir
      if (!genreNames.includes(genreName)) {
        console.log(`Criando gênero novo: ${genreName}`);
        // Simula addGenre: apenas adiciona ao array de existentes
        existingGenres.push({ id: existingGenres.length + 1, name: genreName });
        genreNames.push(genreName);
      }
      genres = [genreName];
    }

    const payload: Partial<any> = {
      title: b.title || "Título Desconhecido",
      author: b.author || "Autor Desconhecido",
      genres,
      year: b.year ?? 0,
      pages: b.pages ?? 0,
      currentPage: 0,
      status: "QUERO_LER" as ReadingStatus,
      rating: b.rating ?? 0,
      synopsis: b.synopsis || "Sem sinopse",
      cover: b.cover || "https://via.placeholder.com/150",
      isbn: undefined,
      notes: undefined,
    };

    try {
      const newBook = await db.create(payload);
      console.log(`✅ Livro migrado: ${newBook.title}`);
    } catch (err) {
      console.error(`❌ Erro ao migrar livro: ${b.title}`, err);
    }
  }

  console.log("🎉 Migration concluída!");
}

migrate().catch(console.error);
