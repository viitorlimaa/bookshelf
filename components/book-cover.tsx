"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { shouldOptimizeCover } from "@/data/cover-images";

interface BookCoverProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function BookCover({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: BookCoverProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = hasError ? "/placeholder.svg" : src;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!shouldOptimizeCover(imageSrc)}
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
