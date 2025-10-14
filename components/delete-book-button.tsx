"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { deleteBook } from "@/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";

interface DeleteBookButtonProps {
  bookId: string;
  bookTitle: string;
  onDelete?: (bookId: string) => void; // opcional
}

export function DeleteBookButton({
  bookId,
  bookTitle,
  onDelete,
}: DeleteBookButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteBook(bookId);

    if (result.success) {
      toast({
        title: "Livro excluído",
        description: `"${bookTitle}" removido.`,
        variant: "success",
      });
      onDelete?.(bookId); // 🔹 Atualiza o estado do LibraryBooks
    } else {
      toast({
        title: "Erro",
        description: result.error || "Não foi possível excluir.",
        variant: "error",
      });
    }

    setIsDeleting(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={isDeleting}>
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">Excluir</span>
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
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
