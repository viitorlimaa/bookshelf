import Link from "next/link"
import { BookOpen, Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown"
import { Button } from "@/components/ui/button"

export function Header() {
return (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex flex-wrap items-center justify-between h-16 px-4 sm:px-6 md:px-8">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-semibold cursor-pointer">
        <BookOpen className="h-6 w-6 text-primary cursor-pointer" />
        <span className="text-lg sm:text-xl">BookShelf</span>
      </Link>

      {/* Navegação Desktop */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link
          href="/"
          className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer" 
        >
          Dashboard
        </Link>
        <Link
          href="/library"
          className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
        >
          Biblioteca
        </Link>
        <Link
          href="/add"
          className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
        >
          Adicionar Livro
        </Link>
      </nav>

      {/* Ações à direita */}
      <div className="flex items-center gap-3">
        {/* Menu Mobile */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="p-2 cursor-pointer">
                <Menu className="h-5 w-5 cursor-pointer" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 sm:w-48 cursor-pointer">
              <DropdownMenuItem asChild>
                <Link href="/">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/library">Biblioteca</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/add">Adicionar Livro</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </div>
  </header>
)

}
