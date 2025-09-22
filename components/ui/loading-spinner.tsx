"use client";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"
        role="status"
        aria-label="Carregando"
      />
    </div>
  );
}