const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`);
  if (!res.ok) throw new Error("Erro ao buscar livros");
  return res.json();
}

export async function getBook(id: number) {
  const res = await fetch(`${BASE_URL}/books/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar livro");
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

export async function updateBook(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erro ao atualizar livro");
  return res.json();
}

export async function deleteBook(id: number) {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Erro ao deletar livro");
  return res.json();
}
