"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { deleteBook } from "@/lib/books";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";

interface DeleteBookButtonProps {
  bookId: string;
  bookTitle: string;
  onDelete?: (bookId: string) => void;
}

export function DeleteBookButton({
  bookId,
  bookTitle,
  onDelete,
}: DeleteBookButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    // Atualiza imediatamente o estado local para remover o livro
    onDelete?.(bookId);

    try {
      setIsDeleting(true);

      const result = await deleteBook(bookId);

      if (result?.success) {
        toast({
          title: "Livro excluído",
          description: `"${bookTitle}" removido.`,
          variant: "success",
        });
      } else {
        // Se deu erro no backend, volta o livro pra lista
        toast({
          title: "Erro",
          description: result?.error || "Não foi possível excluir.",
          variant: "error",
        });
        // Opcional: refazer fetch ou re-adicionar livro manualmente
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o livro.",
        variant: "error",
      });
      // Opcional: refazer fetch ou re-adicionar livro manualmente
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={isDeleting}
          className="cursor-pointer"
        >
          <Trash2 />
          <span className="sr-only">
            Excluir
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir <strong>{bookTitle}</strong>? Esta
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-400 cursor-pointer transition-colors duration-200"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
