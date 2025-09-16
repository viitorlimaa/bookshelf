import { Navigation } from "@/components/navigation"
import { BookForm } from "@/components/book-form"

export default function AdicionarPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookForm mode="create" />
      </main>
    </div>
  )
}
