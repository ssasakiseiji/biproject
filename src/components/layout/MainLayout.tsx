'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { useThemeContext } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';


export function MainLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeContext();
    return (
        <div className={cn("flex min-h-screen bg-background", theme)}>
            <Sidebar />
            <main className="flex-1 overflow-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
