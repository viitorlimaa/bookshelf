"use client"

import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GENRES, READING_STATUS } from "@/data/types"
import { Search, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "./ui/button"

export function LibraryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = searchParams.get("query") || ""
  const genre = searchParams.get("genre") || "all"
  const status = searchParams.get("status") || "all"

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    // Clear other filters when setting a new one
    if (key === "query" && value) {
      params.delete("genre")
      params.delete("status")
    } else if (key === "genre" && value) {
      params.delete("query")
      params.delete("status")
    } else if (key === "status" && value) {
      params.delete("query")
      params.delete("genre")
    }
    router.push(`/library?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/library")
  }

  const hasActiveFilters = query || genre !== "all" || status !== "all"

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou autor..."
          value={query}
          onChange={(e) => updateFilters("query", e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={genre} onValueChange={(value) => updateFilters("genre", value)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filtrar por gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os gêneros</SelectItem>
          {GENRES.map((g) => (
            <SelectItem key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(value) => updateFilters("status", value)}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Filtrar por status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          {READING_STATUS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0">
          <X className="h-4 w-4" />
          <span className="sr-only">Limpar filtros</span>
        </Button>
      )}
    </div>
  )
}
