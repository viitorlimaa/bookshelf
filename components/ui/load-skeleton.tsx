// components/BookCardSkeleton.tsx
'use client'

import { Skeleton } from './skeleton'

export function BookCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-40 w-full" /> {/* capa */}
      <Skeleton className="h-4 w-3/4" /> {/* título */}
      <Skeleton className="h-3 w-1/2" /> {/* autor */}
    </div>
  )
}
