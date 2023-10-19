// ThemeContext.js
import React from 'react';

export const themes = {
    light: {
        foreground: "#000000",
        background: "#eeeeee",
        navbarBackground: "#dddddd"  // Slightly darker for the navbar
    },
    dark: {
        foreground: "#ffffff",
        background: "#222222",
        navbarBackground: "#333333"  // Slightly lighter for the navbar
    }
};


export const ThemeContext = React.createContext(
    themes.dark // default value
);
