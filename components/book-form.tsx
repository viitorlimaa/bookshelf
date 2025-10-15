"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { READING_STATUS, type Book, type ReadingStatus } from "@/data/types";
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
import { useToast } from "./ui/toast";

interface ApiGenre {
  id: number;
  name: string;
}

interface Props {
  book?: Book;
  genresFromDb: ApiGenre[];
  onUpdate?: (book: Book) => void; // opcional, caso queira atualizar a lista de livros
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

export function BookForm({ book, genresFromDb, onUpdate }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormState>({
    title: book?.title || "",
    author: book?.author || "",
    genre:
      book?.genres && book.genres.length > 0
        ? typeof book.genres[0] === "string"
          ? book.genres[0]
          : (book.genres[0] as ApiGenre).name
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

  const updateField = (field: keyof FormState, value: string | number) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value } as FormState;

      if (field === "currentPage" || field === "pages") {
        const total = Number(next.pages || 0);
        const cur = Number(next.currentPage || 0);
        const autoStatus =
          total > 0 && cur === total
            ? "LIDO"
            : total > 0 && cur > 0
            ? "LENDO"
            : "QUERO_LER";
        if (["QUERO_LER", "LENDO"].includes(String(next.status))) {
          next.status = autoStatus;
        }
      }

      return next;
    });

    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const calculateProgress = () => {
    const fields = [
      "title",
      "author",
      "genre",
      "year",
      "pages",
      "currentPage",
      "status",
      "isbn",
      "cover",
      "rating",
      "synopsis",
      "notes",
    ];
    const filled = fields.filter((f) => {
      const v = (formData as any)[f];
      if (v === null || v === undefined || v === "") return false;
      if (!isNaN(Number(v))) return Number(v) > 0;
      return true;
    }).length;
    return Math.round((filled / fields.length) * 100);
  };

  const progress = calculateProgress();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!formData.title?.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.author?.trim()) newErrors.author = "Autor é obrigatório";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const selectedGenre = genresFromDb.find((g) => g.name === formData.genre);

      if (!selectedGenre) {
        toast({
          title: "Erro",
          description: "Selecione um gênero válido.",
          variant: "error",
        });
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        year: parseInt(formData.year || "0", 10) || 0,
        pages: parseInt(formData.pages || "0", 10) || 0,
        currentPage: parseInt(formData.currentPage || "0", 10) || 0,
        status: formData.status as ReadingStatus,
        isbn: formData.isbn?.trim() || undefined,
        cover: formData.cover?.trim() || "https://via.placeholder.com/150",
        rating: Number(formData.rating) || 0,
        synopsis: formData.synopsis?.trim() || "Sem sinopse",
        notes: formData.notes?.trim() || undefined,
        genreIds: [selectedGenre.id],
      };

      const url = book ? `/api/books/${book.id}` : "/api/books";
      const method = book ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao salvar livro");

      toast({
        title: book ? "Livro atualizado" : "Livro adicionado",
        description: `"${formData.title}" salvo com sucesso.`,
        variant: "success",
      });

      // Atualiza a lista sem reload
      setFormData((prev) => ({ ...prev, ...formData }));

      router.push("/library");
    } catch (err: any) {
      console.error("❌ Erro ao salvar livro:", err);
      toast({
        title: "Erro",
        description: err.message || "Erro ao salvar o livro.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
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
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>
            <div>
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => updateField("author", e.target.value)}
              />
              {errors.author && (
                <p className="text-red-500 text-sm mt-1">{errors.author}</p>
              )}
            </div>
          </div>

          {/* Gênero e Avaliação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genre">Gênero</Label>
              <Select
                value={formData.genre || undefined}
                onValueChange={(v) => updateField("genre", v)}
              >
                <SelectTrigger id="genre">
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  {genresFromDb.length > 0 ? (
                    genresFromDb.map((g) => (
                      <SelectItem key={g.id} value={g.name}>
                        {g.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      Carregando gêneros...
                    </div>
                  )}
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
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
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
