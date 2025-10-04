import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 text-center">
      <BookOpen className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground max-w-md text-pretty">
        A página que você está procurando não existe ou foi removida.
      </p>
      <Button asChild>
        <Link href="/">Voltar para o Dashboard</Link>
      </Button>
    </div>
  )
}
