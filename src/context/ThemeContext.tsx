'use client';

import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";

type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
    
    // Use the theme from next-themes, defaulting to 'light' if system or undefined.
    const theme = nextTheme === 'system' ? 'light' : nextTheme || 'light';

    const setTheme = (newTheme: string) => {
        setNextTheme(newTheme);
    };

    const value = useMemo(() => ({ theme, setTheme }), [theme, setNextTheme]);
    
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
