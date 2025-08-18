import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import type { Transaction } from '@/lib/types';

export const exportToCsv = (data: Transaction[], filename: string) => {
  const csv = Papa.unparse(data);
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

export const exportComponentAsPng = (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    html2canvas(element, {
        useCORS: true,
        backgroundColor: null // Use null for transparent background
    }).then((canvas) => {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = image;
      link.click();
    });
  }
};
