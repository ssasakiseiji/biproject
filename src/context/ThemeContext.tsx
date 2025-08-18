'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";

type ThemeContextType = {
    theme: string;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const { theme: nextTheme, setTheme } = useNextTheme();
    const [theme, setInternalTheme] = useState('light');

    useEffect(() => {
        setInternalTheme(nextTheme === 'system' ? 'light' : nextTheme || 'light');
    }, [nextTheme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        setInternalTheme(newTheme);
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
};

export { ThemeContext as ThemeCtx };
