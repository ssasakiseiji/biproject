
'use client';

import type { Transaction } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";

type DataTableProps = {
    data: Transaction[];
};

export function DataTable({ data }: DataTableProps) {
    return (
        <ScrollArea className="h-96">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Región</TableHead>
                        <TableHead className="text-right">Ingresos</TableHead>
                        <TableHead className="text-right">Unidades Vendidas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{new Date(item.fecha).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">{item.producto}</TableCell>
                            <TableCell>{item.categoria}</TableCell>
                            <TableCell>{item.region}</TableCell>
                            <TableCell className="text-right">${item.ingresos.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{item.unidadesVendidas}</TableCell>
                        </TableRow>
                    ))}
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                No hay resultados para los filtros seleccionados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ScrollArea>
    );
}
