"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  READING_STATUS,
  GENRES,
  type Book,
  type ReadingStatus,
} from "@/data/types";
import { createBook, updateBook } from "@/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { Star } from "lucide-react";

interface ApiGenre {
  id: number;
  name: string;
}

interface Props {
  book?: Book;
}

type FormState = {
  title: string;
  author: string;
  genre: string;
  year: string;
  pages: string;
  currentPage: string;
  status: ReadingStatus | string;
  isbn: string;
  cover: string;
  rating: number;
  synopsis: string;
  notes: string;
};

export function BookForm({ book }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [genresFromDb, setGenresFromDb] = useState<ApiGenre[]>([]);
  const [formData, setFormData] = useState<FormState>({
    title: book?.title || "",
    author: book?.author || "",
    genre:
      book?.genres && book.genres.length > 0
        ? typeof book.genres[0] === "string"
          ? book.genres[0]
          : (book.genres[0] as any).name
        : "",
    year: book?.year?.toString() || "",
    pages: book?.pages?.toString() || "",
    currentPage: book?.currentPage?.toString() || "",
    status: book?.status || "QUERO_LER",
    isbn: book?.isbn || "",
    cover: book?.cover || "",
    rating: book?.rating || 0,
    synopsis: book?.synopsis || "",
    notes: book?.notes || "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  // 🔹 Carregar gêneros da API (ou fallback)
  useEffect(() => {
    async function loadGenres() {
      try {
        const res = await fetch("https://db-bookshelf.onrender.com/genres");
        if (!res.ok) throw new Error("Falha ao carregar gêneros");
        const data = await res.json();
        setGenresFromDb(
          Array.isArray(data) && data.length > 0
            ? data
            : GENRES.map((g, i) => ({ id: i + 1, name: g }))
        );
      } catch (err) {
        console.warn("⚠️ Falha ao carregar gêneros, usando fallback:", err);
        setGenresFromDb(GENRES.map((g, i) => ({ id: i + 1, name: g })));
      }
    }
    loadGenres();
  }, []);

  // 🔹 Atualiza campo do formulário
  const updateField = (field: keyof FormState, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value } as FormState;
      if (field === "currentPage" || field === "pages") {
        const total = Number(next.pages || 0);
        const cur = Number(next.currentPage || 0);
        if (total > 0 && cur === total) next.status = "LIDO";
        else if (total > 0 && cur > 0 && cur < total) next.status = "LENDO";
        else if (cur === 0) next.status = "QUERO_LER";
      }
      return next;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // 🔹 Calcula progresso
  const calculateProgress = () => {
    const required = ["title", "author"];
    const optional = [
      "genre",
      "year",
      "pages",
      "status",
      "isbn",
      "cover",
      "synopsis",
      "notes",
      "rating",
      "currentPage",
    ];
    const all = [...required, ...optional];
    const filled = all.filter((f) => {
      const v = (formData as any)[f];
      if (typeof v === "number") return v !== 0 && !isNaN(v);
      return v !== "" && v !== undefined && v !== null;
    }).length;
    return Math.round((filled / all.length) * 100);
  };

  const progress = calculateProgress();

  // 🔹 Converte nomes de gêneros em IDs
  const resolveGenreIds = (genres: string[]) =>
    genres
      .map((g) => genresFromDb.find((x) => x.name === g)?.id)
      .filter((id): id is number => typeof id === "number");

  // 🔹 Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!formData.title?.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.author?.trim()) newErrors.author = "Autor é obrigatório";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // 🔧 Garante que genre seja sempre string[]
      const genresArray =
        formData.genre && formData.genre.trim() !== ""
          ? [String(formData.genre)]
          : [];
      const genreIds = resolveGenreIds(genresArray);

      const rawPayload: Partial<Omit<Book, "id" | "createdAt" | "updatedAt">> =
        {
          title: formData.title.trim(),
          author: formData.author.trim(),
          year: formData.year ? parseInt(formData.year, 10) : undefined,
          pages: formData.pages ? parseInt(formData.pages, 10) : undefined,
          currentPage: formData.currentPage
            ? parseInt(formData.currentPage, 10)
            : undefined,
          status:
            ["QUERO_LER", "LENDO", "LIDO", "PAUSADO", "ABANDONADO"].includes(
              String(formData.status)
            )
              ? (formData.status as ReadingStatus)
              : "QUERO_LER",
          isbn: formData.isbn?.trim() || undefined,
          cover:
            formData.cover?.trim() || "https://via.placeholder.com/150",
          rating:
            typeof formData.rating === "number" && !isNaN(formData.rating)
              ? formData.rating
              : 0,
          synopsis: formData.synopsis?.trim() || "Sem sinopse",
          notes: formData.notes?.trim() || undefined,
          genreIds, // <- envia IDs
        };

      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(([_, v]) => v !== undefined)
      ) as Omit<Book, "id" | "createdAt" | "updatedAt">;

      console.log("📤 Payload enviado:", payload);

      const result = book
        ? await updateBook(book.id, payload)
        : await createBook(payload);

      if (result?.success) {
        toast({
          title: book ? "Livro atualizado" : "Livro adicionado",
          description: `"${formData.title}" salvo com sucesso.`,
          variant: "success",
        });
        router.push("/library");
      } else {
        toast({
          title: "Erro",
          description: result?.error || "Não foi possível salvar.",
          variant: "error",
        });
      }
    } catch (err) {
      console.error("❌ Erro ao salvar livro:", err);
      toast({
        title: "Erro",
        description: "Erro ao salvar o livro.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 UI
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6"
    >
      {/* Progresso */}
      <Card className="bg-gray-50 dark:bg-gray-900">
        <CardHeader>
          <CardTitle>Progresso do Formulário</CardTitle>
          <CardDescription>{progress}% completo</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3 w-full rounded-full" />
        </CardContent>
      </Card>

      {/* Informações */}
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Informações do Livro</CardTitle>
          <CardDescription>Campos obrigatórios marcados com *</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Título e Autor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-destructive text-sm">{errors.title}</p>
              )}
            </div>
            <div>
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => updateField("author", e.target.value)}
                className={errors.author ? "border-red-500" : ""}
              />
              {errors.author && (
                <p className="text-destructive text-sm">{errors.author}</p>
              )}
            </div>
          </div>

          {/* Gênero e Avaliação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genre">Gênero</Label>
              <Select
                value={formData.genre}
                onValueChange={(v) => updateField("genre", v)}
              >
                <SelectTrigger id="genre">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  {genresFromDb.map((g) => (
                    <SelectItem key={g.id} value={g.name}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Avaliação</Label>
              <div className="flex gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => updateField("rating", i + 1)}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        i < formData.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ano, Páginas, Página Atual */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Ano</Label>
              <Input
                type="number"
                value={formData.year}
                onChange={(e) => updateField("year", e.target.value)}
              />
            </div>
            <div>
              <Label>Páginas</Label>
              <Input
                type="number"
                value={formData.pages}
                onChange={(e) => updateField("pages", e.target.value)}
              />
            </div>
            <div>
              <Label>Página Atual</Label>
              <Input
                type="number"
                value={formData.currentPage}
                onChange={(e) => updateField("currentPage", e.target.value)}
              />
            </div>
          </div>

          {/* Status, ISBN, Capa */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Status</Label>
              <Select
                value={String(formData.status)}
                onValueChange={(v) => updateField("status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {READING_STATUS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>ISBN</Label>
              <Input
                value={formData.isbn}
                onChange={(e) => updateField("isbn", e.target.value)}
              />
            </div>
            <div>
              <Label>Capa (URL)</Label>
              <Input
                value={formData.cover}
                onChange={(e) => updateField("cover", e.target.value)}
              />
              {formData.cover ? (
                <img
                  src={formData.cover}
                  alt="Capa"
                  className="mt-2 w-32 h-48 object-cover rounded shadow"
                />
              ) : (
                <div className="mt-2 w-32 h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded">
                  Sem Capa
                </div>
              )}
            </div>
          </div>

          {/* Sinopse e Notas */}
          <div>
            <Label>Sinopse</Label>
            <Textarea
              value={formData.synopsis}
              onChange={(e) => updateField("synopsis", e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <Label>Notas</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Salvando..." : book ? "Atualizar" : "Adicionar"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
