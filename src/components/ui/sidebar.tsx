"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

// --- CONTEXTO Y PROVIDER SIMPLIFICADOS ---
// Solo se encarga de abrir/cerrar en móvil.
type SidebarContextType = {
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | null>(null)

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [openMobile, setOpenMobile] = React.useState(false)
  return (
    <SidebarContext.Provider value={{ openMobile, setOpenMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

// --- COMPONENTE SIDEBAR REESCRITO ---
const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "hidden md:flex flex-col h-full w-64 border-r bg-card text-card-foreground",
      className
    )}
    {...props}
  />
))
Sidebar.displayName = "Sidebar"

// --- CONTENEDORES INTERNOS (SIN CAMBIOS GRANDES) ---
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2 p-4 border-b", className)} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 overflow-y-auto", className)} {...props} />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2 p-4 border-t", className)} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-col gap-1", className)} {...props}/>
))
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
    <li ref={ref} className={cn("relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

// Exportaciones simplificadas
export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem
}