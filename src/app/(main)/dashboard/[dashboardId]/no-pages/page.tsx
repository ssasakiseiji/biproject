'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

export default function NoPagesPage() {
  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <LayoutDashboard className="h-8 w-8 text-blue-500" />
            <span>Dashboard Vacío</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este dashboard no tiene ninguna página configurada.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Por favor, selecciona otro dashboard o contacta a un administrador para que configure las páginas de este.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
