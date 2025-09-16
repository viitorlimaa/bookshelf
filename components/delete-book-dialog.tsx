"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useBookStore } from "@/lib/book-store"
import type { Book } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteBookDialogProps {
  book: Book
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function DeleteBookDialog({ book, trigger, onSuccess }: DeleteBookDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { deleteBook } = useBookStore()
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      deleteBook(book.id)
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error deleting book:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive-foreground hover:bg-destructive bg-transparent"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Livro</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Tem certeza que deseja excluir <strong>"{book.title}"</strong> de {book.author}?
            </p>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. Todas as informações, anotações e progresso de leitura serão perdidos
              permanentemente.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Excluindo..." : "Excluir Livro"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
