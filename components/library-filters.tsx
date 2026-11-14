"use client";

import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENRES, READING_STATUS } from "@/data/types";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { useCallback, useEffect, useState } from "react";

export function LibraryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("query") || "";
  const genre = searchParams.get("genre") || "all";
  const status = searchParams.get("status") || "all";
  const [search, setSearch] = useState(query);

  const updateFilters = useCallback(
    (key: string, value: string, method: "push" | "replace" = "push") => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      const queryString = params.toString();
      if (queryString === searchParams.toString()) return;

      const href = queryString ? `/library?${queryString}` : "/library";
      const options = { scroll: false };
      if (method === "replace") {
        router.replace(href, options);
      } else {
        router.push(href, options);
      }
    },
    [router, searchParams]
  );

  const hasActiveFilters =
    Boolean(search.trim() || query) || genre !== "all" || status !== "all";

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    const normalizedSearch = search.trim();
    if (search === query || normalizedSearch === query) return;

    const timeout = setTimeout(() => {
      updateFilters("query", normalizedSearch, "replace");
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, query, updateFilters]);

  const clearFilters = () => {
    setSearch("");
    router.replace("/library", { scroll: false });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={genre}
        onValueChange={(value) => updateFilters("genre", value, "push")}
      >
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

      <Select
        value={status}
        onValueChange={(value) => updateFilters("status", value, "push")}
      >
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
        <Button
          variant="ghost"
          size="icon"
          onClick={clearFilters}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Limpar filtros</span>
        </Button>
      )}
    </div>
  );
}
