"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold">O servidor está acordando</h2>
      <p className="text-muted-foreground">
        Tente novamente em alguns instantes.
      </p>
      <Button onClick={reset}>Tentar novamente</Button>
    </main>
  );
}
