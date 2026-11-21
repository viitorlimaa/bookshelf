"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { useBooksActions } from "./book-actions";
import { useRouter } from "next/navigation";
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
  redirectToLibrary?: boolean;
}

export function DeleteBookButton({
  bookId,
  bookTitle,
  redirectToLibrary = false,
}: DeleteBookButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { deleteBook } = useBooksActions();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBook(bookId);
      if (result.success) {
        toast({
          title: "Livro excluído",
          description: `"${bookTitle}" foi removido.`,
          variant: "success",
        });
        if (redirectToLibrary) router.replace("/library");
      } else {
        toast({
          title: "Erro",
          description: result.error || "Não foi possível excluir o livro.",
          variant: "error",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Falha ao excluir o livro.",
        variant: "error",
      });
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
          className="cursor-pointer flex items-center justify-center"
        >
          <Trash2 className="h-4 w-4 cursor-pointer" />
          <span className="sr-only cursor-pointer">Excluir</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription className="cursor-pointer">
            Deseja excluir <strong>{bookTitle}</strong>? Esta ação não pode ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
