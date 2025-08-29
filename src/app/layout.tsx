import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ThemeContext } from '@/context/ThemeContext';

export const metadata: Metadata = {
  title: 'KIN BI - Your Business Intelligence Partner',
  description: 'BI as a Service Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-sans antialiased", 'min-h-screen bg-background')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                    {children}
                <Toaster />
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
