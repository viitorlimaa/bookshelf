const OPTIMIZABLE_COVER_HOSTS = new Set([
  "covers.openlibrary.org",
  "livraria.senado.leg.br",
  "m.media-amazon.com",
]);

const LOCAL_COVERS: Array<{ matches: string[]; src: string }> = [
  { matches: ["duna"], src: "/duna.jpg" },
  { matches: ["cem anos de solidao"], src: "/cem-anos-de-solid-o-book-cover.jpg" },
  { matches: ["grande sertao"], src: "/grande-sert-o-veredas-book-cover.jpg" },
  { matches: ["senhor dos aneis"], src: "/senhor-dos-aneis.jpg" },
  { matches: ["orgulho e preconceito"], src: "/orgulhoe-preconceito.jpg" },
  { matches: ["codigo da vinci"], src: "/codigo-davinci.jpg" },
  { matches: ["it a coisa"], src: "/it-a-coisa.jpg" },
  { matches: ["steve jobs"], src: "/steve-jobs.jpg" },
  { matches: ["sapiens"], src: "/sapiens.jpg" },
  { matches: ["clean code", "coder propement"], src: "/clean-code.jpg" },
  { matches: ["poder do habito"], src: "/poder-do-habito.jpg" },
  { matches: ["meditacoes"], src: "/meditacoes.jpg" },
];

function normalizeTitle(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getBookCover(title: string, fallback?: string): string {
  const normalizedTitle = normalizeTitle(title);
  const localCover = LOCAL_COVERS.find(({ matches }) =>
    matches.some((match) => normalizedTitle.includes(match))
  );

  return localCover?.src ?? (fallback?.trim() || "/placeholder.svg");
}

export function shouldOptimizeCover(source: string): boolean {
  if (source.startsWith("/") && !source.startsWith("//")) {
    return true;
  }

  try {
    const url = new URL(source);
    return (
      url.protocol === "https:" && OPTIMIZABLE_COVER_HOSTS.has(url.hostname)
    );
  } catch {
    return false;
  }
}
