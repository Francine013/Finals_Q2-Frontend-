import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

export type Theme = "default" | "midnight" | "emerald" | "solarized";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("todo-theme") as Theme;
    return saved || "midnight";
  });

  useEffect(() => {
    localStorage.setItem("todo-theme", theme);
    
    // Apply theme class to body for consistent background colors
    const body = document.body;
    body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used within ThemeProvider");
  return context;
};
