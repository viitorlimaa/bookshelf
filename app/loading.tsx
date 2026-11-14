import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      aria-label="Carregando página inicial"
      aria-busy="true"
      className="min-h-screen space-y-10 px-4 py-10 sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-2xl">
            <CardHeader className="space-y-2 pb-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="rounded-2xl">
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((__, rowIndex) => (
                <Skeleton key={rowIndex} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
