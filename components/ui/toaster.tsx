"use client"

import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "success" | "error"

interface ToastOptions {
  title: string
  description?: string
  duration?: number
  variant?: ToastVariant
}

const ToastContext = React.createContext<{ toast: (options: ToastOptions) => void } | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within a Toaster")
  return context
}

export const Toaster: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Array<ToastOptions & { id: string }>>([])

  const toast = (options: ToastOptions) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { ...options, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, options.duration ?? 4000)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/*  O Provider deve envolver o Viewport e todos os toasts */}
      <ToastPrimitive.Provider swipeDirection="right">
        <ToastPrimitive.Viewport
          className={cn(
            "fixed bottom-0 right-0 z-50 flex w-[390px] max-w-full flex-col p-4 gap-2 outline-none md:w-[420px]"
          )}
        />
        {toasts.map(({ id, title, description, variant }) => (
          <ToastPrimitive.Root
            key={id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out",
              variant === "success" && "bg-green-500 text-white border-green-600",
              variant === "error" && "bg-red-500 text-white border-red-600",
              !variant && "bg-white dark:bg-gray-800 dark:text-white"
            )}
          >
            <div className="flex flex-col space-y-1">
              <ToastPrimitive.Title className="text-sm font-semibold">{title}</ToastPrimitive.Title>
              {description && (
                <ToastPrimitive.Description className="text-sm opacity-80">{description}</ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="absolute right-2 top-2 text-muted-foreground" />
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}
