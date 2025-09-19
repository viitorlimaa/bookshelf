"use client";

import type React from "react";

import Image from "next/image";
import Link from "next/link";
import { type Book, ReadingStatus, STATUS_LABELS } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteBookDialog } from "@/components/delete-book-dialog";
import { Star, Eye, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  onEdit?: (book: Book) => void;
  onDelete?: (book: Book) => React.ReactNode;
}

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  const renderStars = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="flex items-center gap-1">
      
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  const getStatusColor = (status: ReadingStatus) => {
    switch (status) {
      case ReadingStatus.LENDO:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case ReadingStatus.LIDO:
        return "bg-green-100 text-green-800 border-green-200";
      case ReadingStatus.QUERO_LER:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case ReadingStatus.PAUSADO:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case ReadingStatus.ABANDONADO:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    
   <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col">
  {/* Capa do livro */}
  <div className="w-full relative pb-[150%] sm:pb-[150%] rounded-md overflow-hidden">
    <Image
      src={book.cover || "/placeholder.svg"}
      alt={book.title}
      fill
      className="object-cover w-full h-full"
      sizes="(max-width: 640px) 100vw, 180px"
    />
  </div>

  <CardContent className="flex flex-col flex-1 p-3 sm:p-4">
    <div className="flex-1 flex flex-col justify-between">
      {/* Título e autor */}
      <div>
        <h3 className="font-semibold text-foreground line-clamp-2 text-sm sm:text-base">
          {book.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground truncate">
          {book.author}
        </p>
      </div>

      {/* Info extra */}
      <div className="mt-2 space-y-1">
        {book.year && <p className="text-xs text-muted-foreground">{book.year}</p>}

        {book.genre && (
          <Badge variant="secondary" className="text-xs">
            {book.genre}
          </Badge>
        )}

        <Badge className={cn("text-xs", getStatusColor(book.status))}>
          {STATUS_LABELS[book.status]}
        </Badge>

        {book.rating && (
          <div className="flex items-center gap-2">
            {renderStars(book.rating)}
            <span className="text-xs text-muted-foreground">{book.rating}/5</span>
          </div>
        )}

        {book.status === ReadingStatus.LENDO &&
          book.pages &&
          book.currentPage && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {book.currentPage} / {book.pages} páginas
                </span>
                <span>{Math.round((book.currentPage / book.pages) * 100)}%</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${(book.currentPage / book.pages) * 100}%` }}
                />
              </div>
            </div>
          )}
      </div>

      {/* Botões */}
      <div className="flex gap-1 sm:gap-2 mt-3 sm:mt-4 duration-200">
        <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent text-xs sm:text-sm">
          <Link href={`/livro/${book.id}`}>
            <Eye className="h-3 w-3 mr-1 cursor-pointer" />
            <span className="hidden sm:inline">Ver</span>
          </Link>
        </Button>
        {onEdit && (
          <Button size="sm" variant="outline" onClick={() => onEdit(book)} className="flex-1 text-xs sm:text-sm cursor-pointer">
            <Edit className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Editar</span>
          </Button>
        )}
        {onDelete && (
          <DeleteBookDialog
            book={book}
            trigger={
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent px-2 sm:px-3 cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            }
          />
        )}
      </div>
    </div>
  </CardContent>
</Card>

  );
}
