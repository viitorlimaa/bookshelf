"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { useBookStore } from "@/lib/book-store";
import { GENRES, ReadingStatus, type Book } from "@/lib/types";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Upload, BookOpen, Save, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "./ui/input";

const bookSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  author: z.string().min(1, "Autor é obrigatório"),
  genre: z.string().optional(),
  year: z
    .number()
    .min(1000)
    .max(new Date().getFullYear() + 10)
    .optional()
    .or(z.literal("")),
  pages: z.number().min(1).optional().or(z.literal("")),
  currentPage: z.number().min(0).optional().or(z.literal("")),
  status: z.nativeEnum(ReadingStatus),
  isbn: z.string().optional(),
  cover: z.string().optional(),
  rating: z.number().min(1).max(5).optional().or(z.literal("")),
  synopsis: z.string().optional(),
  notes: z.string().optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface BookFormProps {
  book?: Book;
  mode?: "create" | "edit";
}

export function BookForm({ book, mode = "create" }: BookFormProps) {
  const router = useRouter();
  const { addBook, updateBook } = useBookStore();
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: book
      ? {
          title: book.title,
          author: book.author,
          genre: book.genre || "Nenhum gênero",
          year: book.year,
          pages: book.pages || "",
          currentPage: book.currentPage || "",
          status: book.status,
          isbn: book.isbn || "",
          cover: book?.cover || "", // mantém a capa existente se input estiver vazio,,
          rating: book.rating || "",
          synopsis: book.synopsis || "",
          notes: book.notes || "",
        }
      : {
          status: ReadingStatus.QUERO_LER,
          genre: "Nenhum gênero",
          year: 2025,
        },
    mode: "onChange",
  });

  const watchedFields = watch();
  const coverUrl = watch("cover");

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = [
      "title",
      "author",
      "genre",
      "year",
      "pages",
      "status",
      "isbn",
      "cover",
      "rating",
      "synopsis",
      "notes",
    ];
    const filledFields = fields.filter((field) => {
      const value = watchedFields[field as keyof BookFormData];
      return value !== "" && value !== undefined && value !== null;
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const progress = calculateProgress();

  // Update cover preview when URL changes
  useEffect(() => {
    if (coverUrl && coverUrl !== "") {
      setCoverPreview(coverUrl);
    } else {
      setCoverPreview("");
    }
  }, [coverUrl]);

  const onSubmit = async (data: BookFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Convert empty strings to undefined for optional numeric fields
      const processedData = {
        ...data,
        year: data.year === "" ? undefined : Number(data.year),
        pages: data.pages === "" ? undefined : Number(data.pages),
        currentPage:
          data.currentPage === "" ? undefined : Number(data.currentPage),
        rating: data.rating === "" ? undefined : Number(data.rating),
        genre: data.genre === "" ? undefined : data.genre,
        isbn: data.isbn === "" ? undefined : data.isbn,
        cover: data.cover || book?.cover || "", // mantém a capa existente se input estiver vazio,
        synopsis: data.synopsis === "" ? undefined : data.synopsis,
        notes: data.notes === "" ? undefined : data.notes,
      };

      if (mode === "edit" && book) {
        updateBook(book.id, processedData);
      } else {
        addBook(processedData);
      }
      setSubmitSuccess(true);

      setTimeout(() => router.push("/biblioteca?success=1"), 1000);
    } catch (err) {
      console.error(err);
      setSubmitError("Erro ao salvar livro");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (book?.cover) {
      setValue("cover", book.cover);
      setCoverPreview(book.cover);
    }
  }, [book, setValue]);

  const renderStarRating = () => {
    const rating = watch("rating");
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-6 w-6 cursor-pointer transition-colors",
              i < Number(rating || 0)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
            )}
            onClick={() => setValue("rating", i + 1)}
          />
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setValue("rating", "")}
          className="ml-2 text-xs text-muted-foreground"
        >
          Limpar
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
            {mode === "edit" ? "Editar Livro" : "Adicionar Novo Livro"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base text-pretty">
            {mode === "edit"
              ? "Atualize as informações do livro"
              : "Preencha as informações do seu novo livro"}
          </p>
        </div>
        <Button
          variant="outline"
          asChild
          size="sm"
          className="self-start sm:self-auto bg-transparent"
        >
          <Link href="/biblioteca">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Progresso do formulário
              </span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm">
                      Título <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Digite o título do livro"
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm">
                      Autor <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="author"
                      {...register("author")}
                      placeholder="Digite o nome do autor"
                      className={errors.author ? "border-destructive" : ""}
                    />
                    {errors.author && (
                      <p className="text-sm text-destructive">
                        {errors.author.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="genre" className="text-sm">
                      Gênero
                    </Label>
                    <Select
                      value={watch("genre") || "Nenhum gênero"}
                      onValueChange={(value) => setValue("genre", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nenhum gênero">
                          Nenhum gênero
                        </SelectItem>
                        {GENRES.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm">
                      Ano de Publicação
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      {...register("year", { valueAsNumber: true })}
                      placeholder="2024"
                      min="1000"
                      max={new Date().getFullYear() + 10}
                    />
                    {errors.year && (
                      <p className="text-sm text-destructive">
                        {errors.year.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isbn" className="text-sm">
                      ISBN
                    </Label>
                    <Input
                      id="isbn"
                      {...register("isbn")}
                      placeholder="978-0000000000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Informações de Leitura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm">
                      Status de Leitura
                    </Label>
                    <Select
                      value={watch("status")}
                      onValueChange={(value) =>
                        setValue("status", value as ReadingStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ReadingStatus.QUERO_LER}>
                          Quero Ler
                        </SelectItem>
                        <SelectItem value={ReadingStatus.LENDO}>
                          Lendo
                        </SelectItem>
                        <SelectItem value={ReadingStatus.LIDO}>Lido</SelectItem>
                        <SelectItem value={ReadingStatus.PAUSADO}>
                          Pausado
                        </SelectItem>
                        <SelectItem value={ReadingStatus.ABANDONADO}>
                          Abandonado
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pages" className="text-sm">
                      Total de Páginas
                    </Label>
                    <Input
                      id="pages"
                      type="number"
                      {...register("pages", { valueAsNumber: true })}
                      placeholder="300"
                      min="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentPage" className="text-sm">
                      Página Atual
                    </Label>
                    <Input
                      id="currentPage"
                      type="number"
                      {...register("currentPage", { valueAsNumber: true })}
                      placeholder="150"
                      min="0"
                      max={watch("pages") || undefined}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Avaliação</Label>
                  <div className="flex flex-wrap items-center gap-2">
                    {renderStarRating()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="synopsis" className="text-sm">
                    Sinopse
                  </Label>
                  <Textarea
                    id="synopsis"
                    {...register("synopsis")}
                    placeholder="Digite uma breve sinopse do livro..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm">
                    Notas Pessoais
                  </Label>
                  <Textarea
                    id="notes"
                    {...register("notes")}
                    placeholder="Suas anotações e impressões sobre o livro..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Upload className="h-5 w-5 text-primary" />
                  Capa do Livro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cover" className="text-sm">
                    URL da Capa
                  </Label>
                  <Input
                    id="cover"
                    {...register("cover")}
                    placeholder="https://exemplo.com/capa.jpg"
                    type="text"
                    defaultValue={book?.cover || ""}
                  />
                  {errors.cover && (
                    <p className="text-sm text-destructive">
                      {errors.cover.message}
                    </p>
                  )}
                </div>

                <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center overflow-hidden max-w-xs mx-auto">
                  {coverPreview ? (
                    <Image
                      src={coverPreview || "/placeholder.svg"}
                      alt="Preview da capa"
                      width={200}
                      height={267}
                      className="object-cover w-full h-full"
                      onError={() => setCoverPreview("")}
                    />
                  ) : (
                    <div className="text-center text-muted-foreground p-4">
                      <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2" />
                      <p className="text-sm">Preview da capa</p>
                      <p className="text-xs">
                        Adicione uma URL para ver a prévia
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="space-y-3 sm:space-y-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting
                      ? "Salvando..."
                      : mode === "edit"
                      ? "Atualizar Livro"
                      : "Adicionar Livro"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => reset()}
                    size="sm"
                  >
                    Limpar Formulário
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
