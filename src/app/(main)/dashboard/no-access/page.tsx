'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

/**
 * Página que se muestra cuando un usuario no tiene acceso a ningún dashboard
 * o intenta acceder a un recurso no permitido.
 */
export default function NoAccessPage() {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <ShieldAlert className="h-8 w-8 text-amber-500" />
            <span>Sin Acceso a Dashboards</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tu cuenta de usuario no tiene dashboards asignados en este momento.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Por favor, contacta a un administrador para que te asigne los permisos necesarios.
            Si eres un administrador, puedes asignar dashboards desde el panel de administración.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
