"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cn } from "@/lib/utils"; // une fonction utilitaire pour gérer les classes tailwind (optionnel)

// Toast Provider pour englober l'app
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {children}
      <ToastViewport />
    </ToastPrimitive.Provider>
  );
}

// Composant Toast
export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex items-center justify-between space-x-4 rounded-md border p-4 shadow-md animate-in slide-in-from-bottom",
      className
    )}
    {...props}
  />
));
Toast.displayName = ToastPrimitive.Root.displayName;

// Titre
export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitive.Title.displayName;

// Description
export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitive.Description.displayName;

// Viewport (zone où les toasts s'affichent)
function ToastViewport() {
  return (
    <ToastPrimitive.Viewport className="fixed bottom-0 right-0 flex flex-col p-4 gap-2 w-[360px] max-w-full z-50 outline-none" />
  );
}

// Hook pour gérer les toasts (simplifié)
export function useToast() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  console.log(message, setMessage);

  function toast({
    title,
    description,
  }: {
    title: string;
    description?: string;
  }) {
    setTitle(title);
    setDescription(description || "");
    setOpen(true);
  }

  return { toast, open, setOpen, title, description };
}
