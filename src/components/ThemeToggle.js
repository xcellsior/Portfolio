// ThemeToggle.js
import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const ThemeToggle = ({ onToggleTheme }) => {
    const theme = useContext(ThemeContext);

    return (
        <button className={`theme-toggle ${theme}`} onClick={onToggleTheme}>
            Toggle theme
        </button>
    );
};

export default ThemeToggle;
