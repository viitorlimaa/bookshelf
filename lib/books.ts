const BASE_URL = process.env.NEXT_PUBLIC_API_BASE!;

// =======================
// BOOKS
// =======================
export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`);
  if (!res.ok) throw new Error("Erro ao buscar livros");
  return res.json();
}

export async function createBook(data: any) {
  const res = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao criar livro");
  return res.json();
}

export async function getBook(id: string) {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar livro");
  return res.json();
}

export async function updateBook(id: string, data: any) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar livro");
  return res.json();
}

export async function deleteBook(id: string) {
  const res = await fetch(`${BASE_URL}/books/${id}`, { method: "DELETE" });

  if (!res.ok) {
    // Tenta ler o texto de erro da resposta
    const text = await res.text();
    console.error("Erro ao deletar livro:", text);
    return { success: false, error: text || "Erro ao deletar livro" };
  }

  // Sucesso: retorna sempre um objeto consistente
  return { success: true };
}
