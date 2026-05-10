import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'dark'; // Default to dark as requested
    });

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const setDarkTheme = () => setTheme('dark');
    const setLightTheme = () => setTheme('light');

    return (
        <ThemeContext.Provider value={{ theme, setDarkTheme, setLightTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
