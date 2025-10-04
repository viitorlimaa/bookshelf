"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { GENRES, READING_STATUS, type Book } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import { createBook, updateBook } from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/text-area";
import { Button } from "./ui/button";
import { parseGenre, parseReadingStatus } from "@/lib/utils";

interface BookFormProps {
  book?: Book;
}

export function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    genre: book?.genre || "",
    year: book?.year?.toString() || "",
    pages: book?.pages?.toString() || "",
    currentPage: book?.currentPage?.toString() || "",
    status: book?.status || "",
    isbn: book?.isbn || "",
    cover: book?.cover || "",
    rating: book?.rating || 0,
    synopsis: book?.synopsis || "",
    notes: book?.notes || "",
  });

  const [errors, setErrors] = useState<{ [K in keyof typeof formData]?: string }>({});

  const updateField = (field: keyof typeof formData, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Atualiza status automaticamente se páginas = currentPage
      if (
        field === "currentPage" ||
        field === "pages"
      ) {
        const total = Number(updated.pages);
        const current = Number(updated.currentPage);

        if (total > 0 && current === total) {
          updated.status = "LIDO";
        } else if (current > 0 && current < total) {
          updated.status = "LENDO";
        }
      }
      return updated;
    });
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const calculateProgress = () => {
    const requiredFields: (keyof typeof formData)[] = ["title", "author"];
    const optionalFields: (keyof typeof formData)[] = [
      "genre",
      "year",
      "pages",
      "status",
      "isbn",
      "cover",
      "synopsis",
      "notes",
    ];
    const allFields = [...requiredFields, ...optionalFields];
    const filledFields = allFields.filter((field) => {
      const value = formData[field];
      return value !== "" && value !== 0;
    }).length;
    return Math.round((filledFields / allFields.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!formData.title) newErrors.title = "Título é obrigatório";
    if (!formData.author) newErrors.author = "Autor é obrigatório";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    const bookData = {
      title: formData.title,
      author: formData.author,
      genre: parseGenre(formData.genre),
      year: formData.year ? Number.parseInt(formData.year) : undefined,
      pages: formData.pages ? Number.parseInt(formData.pages) : undefined,
      currentPage: formData.currentPage
        ? Number.parseInt(formData.currentPage)
        : undefined,
      status: parseReadingStatus(formData.status),
      isbn: formData.isbn || undefined,
      cover: formData.cover || undefined,
      rating: formData.rating || undefined,
      synopsis: formData.synopsis || undefined,
      notes: formData.notes || undefined,
    } as Omit<Book, "id" | "createdAt" | "updatedAt">;

    const result = book
      ? await updateBook(book.id, bookData)
      : await createBook(bookData);

    if (result.success) {
      toast({
        title: book ? "Livro atualizado" : "Livro adicionado",
        description: book
          ? `"${formData.title}" foi atualizado com sucesso.`
          : `"${formData.title}" foi adicionado à sua biblioteca.`,
      });
      router.push("/library");
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível salvar o livro.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const progress = calculateProgress();

 return (
  <form
    onSubmit={handleSubmit}
    className="space-y-6 w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6"
  >
    {/* Progresso do Formulário */}
    <Card>
      <CardHeader>
        <CardTitle>Progresso do Formulário</CardTitle>
        <CardDescription>{progress}% completo</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="h-2 w-full" />
      </CardContent>
    </Card>

    {/* Informações Básicas */}
    <Card>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
        <CardDescription>Campos obrigatórios marcados com *</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Título */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm sm:text-base font-medium">
            Título <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Digite o título do livro"
            required
            className={`w-full ${errors.title ? "border-destructive" : ""}`}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        {/* Autor */}
        <div className="space-y-2">
          <Label htmlFor="author" className="text-sm sm:text-base font-medium">
            Autor <span className="text-destructive">*</span>
          </Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => updateField("author", e.target.value)}
            placeholder="Digite o nome do autor"
            required
            className={`w-full ${errors.author ? "border-destructive" : ""}`}
          />
          {errors.author && (
            <p className="text-sm text-destructive">{errors.author}</p>
          )}
        </div>

        {/* Gênero e Ano */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="genre">Gênero</Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => updateField("genre", value)}
            >
              <SelectTrigger id="genre">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Ano de Publicação</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => updateField("year", e.target.value)}
              placeholder="2024"
              min="1000"
              max="2100"
            />
          </div>
        </div>

        {/* ISBN */}
        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            id="isbn"
            value={formData.isbn}
            onChange={(e) => updateField("isbn", e.target.value)}
            placeholder="978-3-16-148410-0"
          />
        </div>
      </CardContent>
    </Card>

    {/* Progresso de Leitura */}
    <Card>
      <CardHeader>
        <CardTitle>Progresso de Leitura</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status de Leitura</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => updateField("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              {READING_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pages">Total de Páginas</Label>
            <Input
              id="pages"
              type="number"
              value={formData.pages}
              onChange={(e) => updateField("pages", e.target.value)}
              placeholder="300"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPage">Página Atual</Label>
            <Input
              id="currentPage"
              type="number"
              value={formData.currentPage}
              onChange={(e) => updateField("currentPage", e.target.value)}
              placeholder="150"
              min="0"
            />
          </div>
        </div>

        {formData.pages && formData.currentPage && (
          <div className="space-y-1">
            <Label>Progresso da Leitura</Label>
            <Progress
              value={
                (Number(formData.currentPage) / Number(formData.pages)) * 100
              }
              className="h-2 w-full"
            />
            <p className="text-sm text-muted-foreground">
              {formData.currentPage} / {formData.pages} páginas
            </p>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Avaliação e Capa */}
    <Card>
      <CardHeader>
        <CardTitle>Avaliação e Capa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avaliação */}
        <div className="space-y-2">
          <Label>Avaliação</Label>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => updateField("rating", i + 1)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 ${
                    i < formData.rating
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
            {formData.rating > 0 && (
              <button
                type="button"
                onClick={() => updateField("rating", 0)}
                className="ml-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* URL da Capa */}
        <div className="space-y-2">
          <Label htmlFor="cover">URL da Capa</Label>
          <Input
            id="cover"
            value={formData.cover}
            onChange={(e) => updateField("cover", e.target.value)}
            placeholder="https://exemplo.com/capa.jpg"
            type="url"
          />
        </div>

        {/* Preview da Capa */}
        <div className="space-y-2">
          <Label>Preview da Capa</Label>
          <div className="relative w-full sm:w-40 md:w-48 aspect-[2/3] overflow-hidden rounded-lg border border-border">
            <Image
              src={formData.cover || "/placeholder.svg"}
              alt="Preview da capa"
              fill
              className="object-cover"
              onError={() => updateField("cover", "")}
            />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Detalhes Adicionais */}
    <Card>
      <CardHeader>
        <CardTitle>Detalhes Adicionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="synopsis">Sinopse</Label>
          <Textarea
            id="synopsis"
            value={formData.synopsis}
            onChange={(e) => updateField("synopsis", e.target.value)}
            placeholder="Escreva uma breve sinopse do livro..."
            rows={4}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notas Pessoais</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            placeholder="Adicione suas anotações pessoais sobre o livro..."
            rows={4}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>

    {/* Botões de Ação */}
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 min-h-[44px] w-full sm:w-auto"
      >
        {isSubmitting
          ? "Salvando..."
          : book
          ? "Atualizar Livro"
          : "Adicionar Livro"}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        disabled={isSubmitting}
        className="min-h-[44px] w-full sm:w-auto"
      >
        Cancelar
      </Button>
    </div>
  </form>
);

}
