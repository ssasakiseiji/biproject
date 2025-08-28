import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import type { Transaction, BarChartData } from '@/lib/types';

/**
 * Convierte un array de datos a formato CSV y lo descarga.
 */
export const exportToCsv = (data: Transaction[] | BarChartData[], filename: string) => {
  // ✅ CAMBIO: Hacemos un casting a 'any[]' para satisfacer a TypeScript.
  // Papaparse manejará correctamente la conversión de cualquier array de objetos.
  const csv = Papa.unparse(data as any[]);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Captura un componente HTML por su ID y lo descarga como una imagen PNG.
 */
export const exportComponentAsPng = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    html2canvas(element, {
        useCORS: true,
        backgroundColor: null // Mantiene el fondo transparente
    }).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = image;
      link.click();
    });
  } else {
      console.error(`Elemento con ID "${elementId}" no encontrado para exportar.`);
  }
};