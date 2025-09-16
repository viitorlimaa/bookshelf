"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GENRES, type ReadingStatus, STATUS_LABELS } from "@/lib/types"
import { Search, X, Filter } from "lucide-react"

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedGenre: string
  onGenreChange: (genre: string) => void
  selectedStatus: string
  onStatusChange: (status: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedStatus,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou autor..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              !
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Gênero</label>
            <Select value={selectedGenre} onValueChange={onGenreChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os gêneros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os gêneros</SelectItem>
                {GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                  <SelectItem key={status} value={status}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Busca: "{searchQuery}"
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => onSearchChange("")} />
            </Badge>
          )}
          {selectedGenre !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Gênero: {selectedGenre}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => onGenreChange("all")} />
            </Badge>
          )}
          {selectedStatus !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {STATUS_LABELS[selectedStatus as ReadingStatus]}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => onStatusChange("all")} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
