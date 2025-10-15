const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;

// GENRES
// =======================
export async function getGenres() {
  const res = await fetch(`${BASE_URL}/genres`);
  if (!res.ok) throw new Error("Erro ao buscar gêneros");
  return res.json();
}

export async function createGenre(data: any) {
  const res = await fetch(`${BASE_URL}/genres`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar gênero");
  return res.json();
}

export async function getGenre(id: string) {
  const res = await fetch(`${BASE_URL}/genres/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar gênero");
  return res.json();
}
