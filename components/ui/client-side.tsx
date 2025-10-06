"use client";

import { ReactNode } from "react";
import { Toaster } from "./toast";


interface Props {
  children: ReactNode;
}

export function LibraryToaster({ children }: Props) {
  return <Toaster>{children}</Toaster>;
}
